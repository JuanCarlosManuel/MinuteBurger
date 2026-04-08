import { ADMIN_STORAGE_KEY } from "@/lib/config";

export function isAdminAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(ADMIN_STORAGE_KEY) === "true";
}

export function setAdminAuthenticated() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(ADMIN_STORAGE_KEY, "true");
}

export function clearAdminAuthenticated() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(ADMIN_STORAGE_KEY);
}
