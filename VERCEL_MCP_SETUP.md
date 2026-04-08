# Vercel MCP Setup

This project includes a local stdio MCP server for Vercel and a project-local Codex configuration.

## Security

- Never place your Vercel token in committed files.
- Keep your token only in a local `.env` file or in shell environment variables.
- If you pasted a real token into chat, logs, or a screenshot, rotate it in Vercel and replace it locally.

## Environment

1. Copy `.env.example` to `.env`
2. Fill in your local values:

```env
VERCEL_TOKEN=YOUR_VERCEL_TOKEN_HERE
VERCEL_TEAM_ID=optional_team_id
VERCEL_PROJECT_ID=optional_project_id
VERCEL_API_BASE_URL=https://api.vercel.com
```

Notes:

- `VERCEL_TOKEN` is required.
- `VERCEL_TEAM_ID` is optional and is automatically applied to requests when present.
- `VERCEL_PROJECT_ID` is optional and is used as a default by `get_project` and `list_deployments`.

## Local Codex Config

The project-local MCP config lives at `.codex/config.toml`:

```toml
[mcp_servers.vercel]
command = "node"
args = ["mcp/vercel-server.mjs"]
```

## Install

```bash
npm install
```

## Run a Manual Smoke Test

This starts the MCP server as a stdio process:

```bash
node mcp/vercel-server.mjs
```

It will stay attached waiting for an MCP client. If `VERCEL_TOKEN` is missing, it will fail safely on the first tool call.

## Verify with Codex

From the project root:

```bash
codex mcp list
codex mcp get vercel
```

You should see the `vercel` server from the project-local `.codex/config.toml`.

## Exposed Tools

- `list_projects`
- `get_project`
- `list_deployments`
- `get_deployment`

This first pass is read-only on purpose. It is safe to extend later with deployment-triggering tools after you decide on the desired workflow.
