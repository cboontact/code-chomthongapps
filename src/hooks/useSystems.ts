"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { System, SystemFilters } from "@/types";
import { toast } from "sonner";
import type { SystemInput } from "@/lib/validators";

const defaultFilters: SystemFilters = {
  search: "",
  workgroup_id: "",
  status: "",
  sortField: "sort_order",
  sortOrder: "asc",
};

function serializeSystem(s: System & { id: bigint | string; workgroup_id: bigint | string | null; workgroup?: (System["workgroup"] & { id: bigint | string }) | null }): System {
  return {
    ...s,
    id: String(s.id),
    workgroup_id: s.workgroup_id ? String(s.workgroup_id) : null,
    workgroup: s.workgroup
      ? { ...s.workgroup, id: String(s.workgroup.id) }
      : null,
  };
}

export function useSystems(adminToken?: string | null) {
  const [systems, setSystems] = useState<System[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [filters, setFilters] = useState<SystemFilters>(defaultFilters);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchValueRef = useRef(filters.search);

  const fetchSystems = useCallback(async (f: SystemFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (f.search) params.set("search", f.search);
      if (f.workgroup_id) params.set("workgroup_id", f.workgroup_id);
      if (f.status) params.set("status", f.status);
      params.set("sortField", f.sortField);
      params.set("sortOrder", f.sortOrder);

      const res = await fetch(`/api/systems?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        setSystems(json.data.data.map(serializeSystem));
        setTotal(json.data.total);
      }
    } catch (err) {
      console.error("Failed to fetch systems", err);
      toast.error("ไม่สามารถดึงข้อมูลได้");
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const isSearchChange = filters.search !== searchValueRef.current;
    searchValueRef.current = filters.search;

    if (isSearchChange) {
      debounceRef.current = setTimeout(() => fetchSystems(filters), 350);
    } else {
      fetchSystems(filters);
    }
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [filters, fetchSystems]);

  function updateFilters(partial: Partial<SystemFilters>) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  function clearSearch() {
    setFilters((prev) => ({ ...prev, search: "" }));
  }

  function getAuthHeaders(): HeadersInit {
    return adminToken ? { Authorization: `Bearer ${adminToken}` } : {};
  }

  async function createSystem(data: SystemInput): Promise<boolean> {
    setSaving(true);
    try {
      const res = await fetch("/api/systems", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      await fetchSystems(filters);
      toast.success("เพิ่มระบบเรียบร้อยแล้ว");
      return true;
    } catch {
      toast.error("ไม่สามารถเพิ่มระบบได้");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function updateSystem(id: string, data: Partial<SystemInput>): Promise<boolean> {
    setSaving(true);
    try {
      const res = await fetch(`/api/systems/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      await fetchSystems(filters);
      toast.success("อัปเดตระบบเรียบร้อยแล้ว");
      return true;
    } catch {
      toast.error("ไม่สามารถอัปเดตระบบได้");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function deleteSystem(id: string): Promise<boolean> {
    setDeleting(true);
    try {
      const res = await fetch(`/api/systems/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      await fetchSystems(filters);
      toast.success("ลบระบบเรียบร้อยแล้ว");
      return true;
    } catch {
      toast.error("ไม่สามารถลบระบบได้");
      return false;
    } finally {
      setDeleting(false);
    }
  }

  async function togglePin(system: System): Promise<void> {
    await updateSystem(system.id, { is_pinned: !system.is_pinned });
  }

  async function toggleStatus(system: System): Promise<void> {
    const next = system.status === "active" ? "inactive" : "active";
    setSystems((prev) => prev.map((s) => s.id === system.id ? { ...s, status: next } : s));
    try {
      const res = await fetch(`/api/systems/${system.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ status: next }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success(next === "active" ? "เปิดใช้งานแล้ว" : "ปิดใช้งานแล้ว");
    } catch {
      setSystems((prev) => prev.map((s) => s.id === system.id ? { ...s, status: system.status } : s));
      toast.error("ไม่สามารถเปลี่ยนสถานะได้");
    }
  }

  return {
    systems,
    total,
    loading,
    saving,
    deleting,
    filters,
    updateFilters,
    clearSearch,
    createSystem,
    updateSystem,
    deleteSystem,
    togglePin,
    toggleStatus,
    refetch: () => fetchSystems(filters),
  };
}
