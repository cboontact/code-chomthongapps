"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,
  faThumbTack,
  faExternalLink,
  faDesktop,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import type { System } from "@/types";

interface SystemCardProps {
  system: System;
  isAdmin: boolean;
  onEdit: (system: System) => void;
  onDelete: (system: System) => void;
  onTogglePin: (system: System) => void;
  onToggleStatus: (system: System) => void;
}

export default function SystemCard({ system, isAdmin, onEdit, onDelete, onTogglePin, onToggleStatus }: SystemCardProps) {
  const wg = system.workgroup;

  return (
    <div
      className={`group bg-white rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col
        ${system.is_pinned ? "border-sky-200 shadow-sm shadow-sky-100" : "border-slate-200"}`}
    >
      {/* Card Header */}
      <div className="p-4 flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={wg?.color_code ? { backgroundColor: wg.color_code + "20" } : { backgroundColor: "#f1f5f9" }}
          >
            <FontAwesomeIcon
              icon={faDesktop}
              className="w-4 h-4"
              style={wg?.color_code ? { color: wg.color_code } : { color: "#94a3b8" }}
            />
          </div>
          <div className="flex items-center gap-1.5">
            {system.is_pinned && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-sky-100 text-sky-600 text-[10px] font-semibold rounded-full">
                <FontAwesomeIcon icon={faThumbTack} className="w-2.5 h-2.5" />
                ปักหมุด
              </span>
            )}
            <button
              onClick={() => isAdmin && onToggleStatus(system)}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${
                system.status === "active" ? "bg-emerald-500" : "bg-slate-300"
              } ${isAdmin ? "cursor-pointer" : "cursor-default"}`}
              title={system.status === "active" ? "ใช้งาน" : "ปิดใช้งาน"}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                system.status === "active" ? "translate-x-4" : "translate-x-0.5"
              }`} />
            </button>
          </div>
        </div>

        <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-1 line-clamp-2">
          {system.system_name}
        </h3>

        {wg && (
          wg.color_code ? (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border mb-2"
              style={{ backgroundColor: wg.color_code + "22", color: wg.color_code, borderColor: wg.color_code + "55" }}
            >
              <FontAwesomeIcon icon={faLayerGroup} className="w-2.5 h-2.5 flex-shrink-0" />
              {wg.group_name}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200 mb-2">
              <FontAwesomeIcon icon={faLayerGroup} className="w-2.5 h-2.5 flex-shrink-0" />
              {wg.group_name}
            </span>
          )
        )}

        {isAdmin && system.creator_name && (
          <p className="text-xs text-slate-400">ผู้สร้าง: {system.creator_name}</p>
        )}
        {isAdmin && system.note && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{system.note}</p>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-4 pb-4 flex items-center gap-2 border-t border-slate-100 pt-3 mt-auto">
        {system.system_url ? (
          <a
            href={system.system_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faExternalLink} className="w-3 h-3" />
            เปิดระบบ
          </a>
        ) : (
          <div className="flex-1 flex items-center justify-center py-1.5 text-xs text-slate-400 bg-slate-50 rounded-lg">
            ไม่มีลิงก์
          </div>
        )}
        {isAdmin && (
          <>
            <button
              onClick={() => onTogglePin(system)}
              className={`p-1.5 rounded-lg transition-colors ${
                system.is_pinned
                  ? "text-sky-600 bg-sky-100 hover:bg-sky-200"
                  : "text-slate-400 hover:bg-slate-100 hover:text-sky-500"
              }`}
            >
              <FontAwesomeIcon icon={faThumbTack} className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onEdit(system)}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <FontAwesomeIcon icon={faPen} className="w-3.5 h-3.5" />
            </button>
            <button
          onClick={() => onDelete(system)}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
              <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
