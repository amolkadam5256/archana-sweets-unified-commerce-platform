import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "@archana/constants";
import type { HealthStatus } from "@archana/types";
import type { ApiClient } from "@archana/utils";

export function useHealth(api: ApiClient) {
  return useQuery({
    queryKey: ["health"],
    queryFn: () => api.get<HealthStatus>(API_ROUTES.HEALTH),
    staleTime: 30_000,
  });
}

export { useHealth as default };
