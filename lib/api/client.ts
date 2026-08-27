"use client";

import { useUserStore } from "@/lib/stores/useUserStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errorCode?: string,
  ) {
    super(message);
  }
}

const getAccessToken = () =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/auth/refresh", { method: "POST" })
      .then((res) => res.ok)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export type ApiOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  isFormData?: boolean;
  skipAuth?: boolean;
};

export async function apiFetch<T = any>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { method = "GET", body, isFormData, skipAuth } = options;

  const doFetch = async (): Promise<Response> => {
    const headers: Record<string, string> = {};
    if (!isFormData) headers["Content-Type"] = "application/json";

    if (!skipAuth) {
      const token = getAccessToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    });
  };

  let res = await doFetch();

  if (res.status === 401 && !skipAuth) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      res = await doFetch();
    } else {
      useUserStore.getState().clearUser();
      if (typeof window !== "undefined") {
        window.location.href = "/auth?mode=login";
      }
    }
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      res.status,
      data.message || data.error || "Request failed",
      data.errorCode,
    );
  }

  return data as T;
}
