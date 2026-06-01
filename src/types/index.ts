export type SystemStatus = "active" | "inactive";

export interface Workgroup {
  id: string;
  group_name: string;
  description: string | null;
  color_code: string | null;
  created_at: string;
  _count?: { systems: number };
}

export interface System {
  id: string;
  system_name: string;
  system_url: string | null;
  workgroup_id: string | null;
  creator_name: string | null;
  note: string | null;
  is_pinned: boolean;
  sort_order: number;
  status: SystemStatus;
  created_at: string;
  updated_at: string;
  workgroup: Workgroup | null;
}

export interface SystemsResponse {
  data: System[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type ViewMode = "table" | "card";

export type SortField = "system_name" | "sort_order" | "created_at" | "status";
export type SortOrder = "asc" | "desc";

export interface SystemFilters {
  search: string;
  workgroup_id: string;
  status: string;
  sortField: SortField;
  sortOrder: SortOrder;
}
