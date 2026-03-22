import { useState, useCallback, useEffect } from "react";
import type { Category, Status } from "@ledgers/shared";
import { CATEGORIES, STATUSES } from "@ledgers/shared";

export interface FilterState {
  status: Status | "All";
  category: Category | "All";
}

export function useFilters(clientId: string | null) {
  const [filters, setFilters] = useState<FilterState>({
    status: "All",
    category: "All",
  });

  // Reset filters when client changes
  useEffect(() => {
    setFilters({ status: "All", category: "All" });
  }, [clientId]);

  const setStatus = useCallback((status: Status | "All") => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const setCategory = useCallback((category: Category | "All") => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  return {
    filters,
    setStatus,
    setCategory,
    statusOptions: ["All", ...STATUSES] as const,
    categoryOptions: ["All", ...CATEGORIES] as const,
  };
}
