import { useMutation } from "@tanstack/react-query";
import { api, buildUrl, type CreateApplicationInput } from "@shared/routes";

export function useCreateApplication() {
  return useMutation({
    mutationFn: async (data: CreateApplicationInput) => {
      const res = await fetch(api.applications.create.path, {
        method: api.applications.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const body = await res.json().catch(() => ({}) as any);
        // API returns { error: "..." }, fallback to status text
        throw new Error(body.error || body.message || `Server error: ${res.status}`);
      }
      
      return res.json();
    },
  });
}

export function useApplicationStatus() {
  return useMutation({
    mutationFn: async (address: string) => {
      if (!address.trim()) throw new Error("Please enter an EVM address");
      
      const url = buildUrl(api.applications.status.path, { address: address.trim() });
      const res = await fetch(url);
      
      if (res.status === 404) {
        return { status: "not_found" };
      }
      
      if (!res.ok) {
        const body = await res.json().catch(() => ({}) as any);
        throw new Error(body.error || body.message || "Failed to fetch application status");
      }
      
      return res.json();
    }
  });
}
