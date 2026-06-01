"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,
  faThumbTack,
  faExternalLink,
  faDesktop,
  faLayerGroup,
  faUserPen,
  faToggleOn,
  faArrowsUpDown,
} from "@fortawesome/free-solid-svg-icons";
import type { System } from "@/types";
import EmptyState from "@/components/ui/EmptyState";

interface SystemsTableProps {
  systems: System[];
  isAdmin: boolean;
  onEdit: (system: System) => void;
  onDelete: (system: System) => void;
  onTogglePin: (system: System) => void;
  onToggleStatus: (system: System) => void;
  onAdd: () => void;
}

function WorkgroupBadge({ color, name }: { color: string | null; name: string }) {
  if (color) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border"
        style={{ backgroundColor: color + "22", color, borderColor: color + "55" }}
      >
        <FontAwesomeIcon icon={faLayerGroup} className="w-2.5 h-2.5 flex-shrink-0" />
        {name}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
      <FontAwesomeIcon icon={faLayerGroup} className="w-2.5 h-2.5 flex-shrink-0" />
      {name}
    </span>
  );
}

export default function SystemsTable({ systems, isAdmin, onEdit, onDelete, onTogglePin, onToggleStatus, onAdd }: SystemsTableProps) {
  if (systems.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200">
        <EmptyState
          title="ไม่พบข้อมูลระบบ"
          description="ลองเปลี่ยนคำค้นหา หรือเพิ่มระบบใหม่"
          onAdd={isAdmin ? onAdd : undefined}
        />
      </div>
    );
  }

  return (
    <div className="max-w-full min-w-0 bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="max-w-full min-w-0 overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 w-12">#</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faDesktop} className="w-3 h-3 text-slate-400" />
                  ชื่อระบบ
                </span>
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden md:table-cell">
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faLayerGroup} className="w-3 h-3 text-slate-400" />
                  กลุ่มงาน
                </span>
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden lg:table-cell">
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faUserPen} className="w-3 h-3 text-slate-400" />
                  ผู้สร้าง
                </span>
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden sm:table-cell">
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faToggleOn} className="w-3 h-3 text-slate-400" />
                  สถานะ
                </span>
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden xl:table-cell">
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faArrowsUpDown} className="w-3 h-3 text-slate-400" />
                  ลำดับ
                </span>
              </th>
              {isAdmin && <th className="px-4 py-3 w-28" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {systems.map((sys, idx) => (
              <tr
                key={sys.id}
                className={`group hover:bg-slate-50/70 transition-colors ${sys.is_pinned ? "bg-sky-50/40" : ""}`}
              >
                <td className="px-4 py-3 text-slate-400 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    {sys.is_pinned && (
                      <FontAwesomeIcon icon={faThumbTack} className="w-2.5 h-2.5 text-sky-500 rotate-45" />
                    )}
                    {idx + 1}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{sys.system_name}</span>
                      {sys.system_url && (
                        <a
                          href={sys.system_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-500 hover:text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FontAwesomeIcon icon={faExternalLink} className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    {sys.note && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-xs">{sys.note}</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {sys.workgroup ? (
                    <WorkgroupBadge color={sys.workgroup.color_code} name={sys.workgroup.group_name} />
                  ) : (
                    <span className="text-slate-400 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-slate-600 text-xs">{sys.creator_name ?? "—"}</span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <button
                    onClick={() => isAdmin && onToggleStatus(sys)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${
                      sys.status === "active" ? "bg-emerald-500" : "bg-slate-300"
                    } ${isAdmin ? "cursor-pointer" : "cursor-default"}`}
                    title={sys.status === "active" ? "ใช้งาน" : "ปิดใช้งาน"}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      sys.status === "active" ? "translate-x-4" : "translate-x-0.5"
                    }`} />
                  </button>
                </td>
                <td className="px-4 py-3 hidden xl:table-cell">
                  <span className="text-slate-500 text-xs font-mono">{sys.sort_order}</span>
                </td>
                {isAdmin && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onTogglePin(sys)}
                        title={sys.is_pinned ? "ยกเลิกปักหมุด" : "ปักหมุด"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          sys.is_pinned
                            ? "text-sky-600 bg-sky-100 hover:bg-sky-200"
                            : "text-slate-400 hover:bg-slate-100 hover:text-sky-500"
                        }`}
                      >
                        <FontAwesomeIcon icon={faThumbTack} className="w-3 h-3" />
                      </button>
                      <button onClick={() => onEdit(sys)} title="แก้ไข" className="p-1.5 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <FontAwesomeIcon icon={faPen} className="w-3 h-3" />
                      </button>
                      <button onClick={() => onDelete(sys)} title="ลบ" className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
