import dotenv from "dotenv";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(projectRoot, ".env"), quiet: true });

const API_BASE_URL =
  process.env.VERCEL_API_BASE_URL?.trim() || "https://api.vercel.com";

function getRequiredToken() {
  const token = process.env.VERCEL_TOKEN?.trim();

  if (!token) {
    throw new Error(
      "Missing VERCEL_TOKEN. Add it to a local .env file or export it in your shell before starting the MCP server."
    );
  }

  return token;
}

function getTeamId() {
  return process.env.VERCEL_TEAM_ID?.trim() || undefined;
}

function getDefaultProjectId() {
  return process.env.VERCEL_PROJECT_ID?.trim() || undefined;
}

function toTextContent(value) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(value, null, 2),
      },
    ],
  };
}

function toErrorContent(error) {
  return {
    content: [
      {
        type: "text",
        text: error instanceof Error ? error.message : String(error),
      },
    ],
    isError: true,
  };
}

function withTeamId(searchParams) {
  const teamId = getTeamId();

  if (teamId && !searchParams.has("teamId")) {
    searchParams.set("teamId", teamId);
  }

  return searchParams;
}

async function vercelRequest(endpoint, { method = "GET", searchParams, body } = {}) {
  const token = getRequiredToken();
  const url = new URL(endpoint, API_BASE_URL);
  const params = withTeamId(searchParams || new URLSearchParams());

  params.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.error?.message || data?.message || "Unknown Vercel API error.";

    throw new Error(`Vercel API ${response.status}: ${message}`);
  }

  return data;
}

async function listProjects(args = {}) {
  const searchParams = new URLSearchParams();

  if (args.limit) {
    searchParams.set("limit", String(args.limit));
  }

  if (args.search) {
    searchParams.set("search", String(args.search));
  }

  if (args.from) {
    searchParams.set("from", String(args.from));
  }

  return vercelRequest("/v9/projects", { searchParams });
}

async function getProject(args = {}) {
  const projectIdOrName = args.idOrName || getDefaultProjectId();

  if (!projectIdOrName) {
    throw new Error(
      "Missing project identifier. Pass idOrName or set VERCEL_PROJECT_ID in your environment."
    );
  }

  return vercelRequest(`/v9/projects/${encodeURIComponent(projectIdOrName)}`);
}

async function listDeployments(args = {}) {
  const searchParams = new URLSearchParams();
  const projectId = args.projectId || getDefaultProjectId();

  if (projectId) {
    searchParams.set("projectId", String(projectId));
  }

  if (args.limit) {
    searchParams.set("limit", String(args.limit));
  }

  if (args.state) {
    searchParams.set("state", String(args.state));
  }

  if (args.target) {
    searchParams.set("target", String(args.target));
  }

  if (args.until) {
    searchParams.set("until", String(args.until));
  }

  return vercelRequest("/v6/deployments", { searchParams });
}

async function getDeployment(args = {}) {
  if (!args.idOrUrl) {
    throw new Error("Missing idOrUrl. Provide a deployment id or deployment url.");
  }

  return vercelRequest(`/v13/deployments/${encodeURIComponent(args.idOrUrl)}`);
}

const server = new Server(
  {
    name: "vercel-local-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_projects",
        description:
          "List Vercel projects visible to the configured token. Optionally filter by search or limit.",
        inputSchema: {
          type: "object",
          properties: {
            search: {
              type: "string",
              description: "Optional project search text.",
            },
            limit: {
              type: "number",
              description: "Optional maximum number of projects to return.",
            },
            from: {
              type: "string",
              description: "Optional pagination cursor.",
            },
          },
          additionalProperties: false,
        },
      },
      {
        name: "get_project",
        description:
          "Get a single Vercel project by id or name. Falls back to VERCEL_PROJECT_ID when omitted.",
        inputSchema: {
          type: "object",
          properties: {
            idOrName: {
              type: "string",
              description: "Project id or project name.",
            },
          },
          additionalProperties: false,
        },
      },
      {
        name: "list_deployments",
        description:
          "List deployments, optionally filtered by project id, target, state, or limit.",
        inputSchema: {
          type: "object",
          properties: {
            projectId: {
              type: "string",
              description:
                "Optional project id. Falls back to VERCEL_PROJECT_ID when omitted.",
            },
            limit: {
              type: "number",
              description: "Optional maximum number of deployments to return.",
            },
            state: {
              type: "string",
              description: "Optional deployment state filter.",
            },
            target: {
              type: "string",
              description: "Optional deployment target, such as production or preview.",
            },
            until: {
              type: "number",
              description: "Optional timestamp or pagination boundary accepted by Vercel.",
            },
          },
          additionalProperties: false,
        },
      },
      {
        name: "get_deployment",
        description: "Get a single deployment by deployment id or deployment url.",
        inputSchema: {
          type: "object",
          properties: {
            idOrUrl: {
              type: "string",
              description: "Deployment id or deployment url.",
            },
          },
          required: ["idOrUrl"],
          additionalProperties: false,
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case "list_projects":
        return toTextContent(await listProjects(request.params.arguments));
      case "get_project":
        return toTextContent(await getProject(request.params.arguments));
      case "list_deployments":
        return toTextContent(await listDeployments(request.params.arguments));
      case "get_deployment":
        return toTextContent(await getDeployment(request.params.arguments));
      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    return toErrorContent(error);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
