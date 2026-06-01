"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTableList, faGrip, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import type { ViewMode } from "@/types";

interface TopNavProps {
  title: string;
  subtitle?: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddClick: () => void;
  totalCount: number;
  isAdmin?: boolean;
}

export default function TopNav({
  title,
  subtitle,
  viewMode,
  onViewModeChange,
  onAddClick,
  totalCount,
  isAdmin,
}: TopNavProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 min-w-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-sm shadow-sky-200 flex-shrink-0">
          <FontAwesomeIcon icon={faLayerGroup} className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold text-slate-800">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
              {subtitle}{" "}
              <span className="inline-flex whitespace-nowrap items-center px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold ml-1">
                {totalCount} รายการ
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 min-w-0">
        {/* View toggle */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
          <button
            onClick={() => onViewModeChange("table")}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === "table"
                ? "bg-white text-sky-600 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
            title="Table View"
          >
            <FontAwesomeIcon icon={faTableList} className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("card")}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === "card"
                ? "bg-white text-sky-600 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
            title="Card View"
          >
            <FontAwesomeIcon icon={faGrip} className="w-4 h-4" />
          </button>
        </div>

        {/* Add button — admin only */}
        {isAdmin && (
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-sky-200"
          >
            <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
            <span>เพิ่มระบบ</span>
          </button>
        )}
      </div>
    </div>
  );
}
