"use client";

import { useHealth } from "@archana/hooks";
import { createApiClient } from "@archana/utils";

const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
});

export function HealthBadge() {
  const { data, isLoading, isError } = useHealth(api);

  if (isLoading) {
    return <span className="text-brand-600">Checking API status…</span>;
  }

  if (isError || !data) {
    return (
      <span className="inline-flex items-center gap-2 text-red-600">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        API unreachable — start backend with docker compose
      </span>
    );
  }

  const isHealthy = data.status === "healthy";

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`h-2 w-2 rounded-full ${isHealthy ? "bg-green-500" : "bg-yellow-500"}`}
      />
      API {data.status} · v{data.version}
      <span className="text-brand-500">
        ({Object.entries(data.services).map(([k, v]) => `${k}: ${v}`).join(", ")})
      </span>
    </span>
  );
}
