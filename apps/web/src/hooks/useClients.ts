import { useQuery } from "@tanstack/react-query";
import { fetchClients } from "../lib/api";

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
    staleTime: 30_000,
  });
}
