import type { ApiErrorResponse, ApiResponse } from "@archana/types";

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: ApiErrorResponse["error"]["details"],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiClientConfig {
  baseUrl: string;
  getAccessToken?: () => string | null;
  onUnauthorized?: () => void;
}

export function createApiClient(config: ApiClientConfig) {
  async function request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    const token = config.getAccessToken?.();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${config.baseUrl}${path}`, {
      ...options,
      headers,
    });

    const body = await response.json();

    if (!response.ok) {
      const err = body as ApiErrorResponse;
      if (response.status === 401) {
        config.onUnauthorized?.();
      }
      throw new ApiError(
        err.error?.code ?? "UNKNOWN_ERROR",
        err.error?.message ?? "Request failed",
        response.status,
        err.error?.details,
      );
    }

    return (body as ApiResponse<T>).data;
  }

  return {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, data?: unknown) =>
      request<T>(path, { method: "POST", body: JSON.stringify(data) }),
    patch: <T>(path: string, data?: unknown) =>
      request<T>(path, { method: "PATCH", body: JSON.stringify(data) }),
    delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
