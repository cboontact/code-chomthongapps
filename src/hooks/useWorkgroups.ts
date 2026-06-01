"use client";

import { useState, useEffect, useCallback } from "react";
import type { Workgroup } from "@/types";

export function useWorkgroups() {
  const [workgroups, setWorkgroups] = useState<Workgroup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkgroups = useCallback(async () => {
    try {
      const res = await fetch("/api/workgroups");
      const json = await res.json();
      if (json.success) {
        setWorkgroups(
          json.data.map((w: Workgroup & { id: bigint | string }) => ({
            ...w,
            id: String(w.id),
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch workgroups", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchWorkgroups();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchWorkgroups]);

  return { workgroups, loading, refetch: fetchWorkgroups };
}
