"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark, faFilter, faArrowUpAZ, faArrowDownAZ, faSort } from "@fortawesome/free-solid-svg-icons";
import type { SystemFilters, SortField, Workgroup } from "@/types";

interface SearchBarProps {
  filters: SystemFilters;
  workgroups: Workgroup[];
  onFiltersChange: (filters: Partial<SystemFilters>) => void;
  onClearSearch: () => void;
}

const sortOptions: { value: SortField; label: string }[] = [
  { value: "sort_order", label: "ลำดับ" },
  { value: "system_name", label: "ชื่อระบบ" },
  { value: "created_at", label: "วันที่สร้าง" },
  { value: "status", label: "สถานะ" },
];

export default function SearchBar({ filters, workgroups, onFiltersChange, onClearSearch }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap xl:flex-nowrap gap-2.5 mb-5 min-w-0">
      {/* Search input */}
      <div className="relative flex-1">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
        />
        <input
          type="text"
          placeholder="ค้นหาชื่อระบบ, ผู้สร้าง, หมายเหตุ..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition-all"
        />
        {filters.search && (
          <button
            onClick={onClearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Workgroup filter */}
      <div className="relative sm:w-auto">
        <FontAwesomeIcon
          icon={faFilter}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
        />
        <select
          value={filters.workgroup_id}
          onChange={(e) => onFiltersChange({ workgroup_id: e.target.value })}
          className="w-full sm:w-auto pl-8 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition-all appearance-none cursor-pointer sm:min-w-[140px]"
        >
          <option value="">ทุกกลุ่มงาน</option>
          {workgroups.map((wg) => (
            <option key={wg.id} value={wg.id}>
              {wg.group_name}
            </option>
          ))}
        </select>
      </div>

      {/* Status filter */}
      <div className="relative sm:w-auto">
        <FontAwesomeIcon
          icon={faFilter}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none"
        />
        <select
          value={filters.status}
          onChange={(e) => onFiltersChange({ status: e.target.value })}
          className="w-full sm:w-auto pl-8 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition-all appearance-none cursor-pointer"
        >
          <option value="">ทุกสถานะ</option>
          <option value="active">✓ ใช้งาน</option>
          <option value="inactive">✕ ปิดใช้งาน</option>
        </select>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-1.5 min-w-0">
        <div className="relative flex-1 sm:flex-none">
          <FontAwesomeIcon
            icon={faSort}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none"
          />
          <select
            value={filters.sortField}
            onChange={(e) => onFiltersChange({ sortField: e.target.value as SortField })}
            className="w-full sm:w-auto pl-8 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition-all appearance-none cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => onFiltersChange({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" })}
          className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-sky-600 hover:border-sky-300 transition-all"
          title={filters.sortOrder === "asc" ? "เรียงจากมากไปน้อย" : "เรียงจากน้อยไปมาก"}
        >
          <FontAwesomeIcon
            icon={filters.sortOrder === "asc" ? faArrowUpAZ : faArrowDownAZ}
            className="w-4 h-4"
          />
        </button>
      </div>
    </div>
  );
}
