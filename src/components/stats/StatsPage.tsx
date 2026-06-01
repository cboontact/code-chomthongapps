"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar, faDesktop, faCircleCheck, faCircleXmark,
  faThumbTack, faLayerGroup, faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import type { System, Workgroup } from "@/types";

interface StatsPageProps {
  systems: System[];
  workgroups: Workgroup[];
}

export default function StatsPage({ systems, workgroups }: StatsPageProps) {
  const active = systems.filter((s) => s.status === "active").length;
  const inactive = systems.filter((s) => s.status === "inactive").length;
  const pinned = systems.filter((s) => s.is_pinned).length;
  const withUrl = systems.filter((s) => s.system_url).length;

  // Systems per workgroup
  const wgStats = workgroups
    .map((wg) => ({
      ...wg,
      count: systems.filter((s) => s.workgroup_id === wg.id).length,
    }))
    .filter((wg) => wg.count > 0)
    .sort((a, b) => b.count - a.count);

  const maxCount = wgStats[0]?.count ?? 1;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm">
          <FontAwesomeIcon icon={faChartBar} className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-800">สถิติภาพรวม</h1>
          <p className="text-sm text-slate-500 mt-0.5">ข้อมูลสรุประบบสารสนเทศทั้งหมด</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-6 min-w-0">
        {[
          { label: "ระบบทั้งหมด", value: systems.length, icon: faDesktop, color: "sky" },
          { label: "เปิดใช้งาน", value: active, icon: faCircleCheck, color: "emerald" },
          { label: "ปิดใช้งาน", value: inactive, icon: faCircleXmark, color: "slate" },
          { label: "ปักหมุด", value: pinned, icon: faThumbTack, color: "cyan" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="min-w-0 bg-white rounded-xl border border-slate-200 p-3 sm:p-4">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                ${color === "sky" ? "bg-sky-100 text-sky-600"
                  : color === "emerald" ? "bg-emerald-100 text-emerald-600"
                  : color === "cyan" ? "bg-cyan-100 text-cyan-600"
                  : "bg-slate-100 text-slate-500"}`}>
                <FontAwesomeIcon icon={icon} className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11px] sm:text-xs text-slate-500">{label}</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Workgroup breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faLayerGroup} className="w-3.5 h-3.5 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700">ระบบแยกตามกลุ่มงาน</h2>
          </div>
          {wgStats.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">ยังไม่มีข้อมูล</p>
          ) : (
            <div className="space-y-3">
              {wgStats.map((wg) => (
                <div key={wg.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold"
                      style={wg.color_code ? { color: wg.color_code } : {}}
                    >
                      <FontAwesomeIcon icon={faLayerGroup} className="w-2.5 h-2.5" />
                      {wg.group_name}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{wg.count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(wg.count / maxCount) * 100}%`,
                        backgroundColor: wg.color_code ?? "#94a3b8",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faTrophy} className="w-3.5 h-3.5 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700">สรุปข้อมูล</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "จำนวนกลุ่มงานทั้งหมด", value: `${workgroups.length} กลุ่ม`, color: "text-slate-700" },
              { label: "ระบบที่มีลิงก์", value: `${withUrl} / ${systems.length} ระบบ`, color: "text-sky-700" },
              { label: "อัตราการใช้งาน", value: systems.length > 0 ? `${Math.round((active / systems.length) * 100)}%` : "—", color: "text-emerald-700" },
              { label: "ระบบที่ยังไม่มีกลุ่มงาน", value: `${systems.filter((s) => !s.workgroup_id).length} ระบบ`, color: "text-amber-700" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-500">{label}</span>
                <span className={`text-sm font-semibold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
