"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup, faPlus, faPen, faTrash, faSpinner,
  faCircle, faLock,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import type { Workgroup } from "@/types";

interface WorkgroupsPageProps {
  workgroups: Workgroup[];
  isAdmin: boolean;
  adminToken?: string | null;
  onRefresh: () => void;
}

const PRESET_COLORS = [
  "#dc2626","#2563eb","#059669","#0284c7","#d97706",
  "#0891b2","#b45309","#db2777","#65a30d","#16a34a",
  "#0d9488","#1d4ed8","#9a3412","#ca8a04","#047857",
  "#0369a1","#0e7490","#166534","#075985","#1e3a5f","#78350f","#374151",
];

interface FormState { group_name: string; description: string; color_code: string; }
const defaultForm: FormState = { group_name: "", description: "", color_code: "#0284c7" };

export default function WorkgroupsPage({ workgroups, isAdmin, adminToken, onRefresh }: WorkgroupsPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Workgroup | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  function openAdd() {
    setEditing(null);
    setForm(defaultForm);
    setShowForm(true);
  }

  function openEdit(wg: Workgroup) {
    setEditing(wg);
    setForm({ group_name: wg.group_name, description: wg.description ?? "", color_code: wg.color_code ?? "#0284c7" });
    setShowForm(true);
  }

  function cancelForm() { setShowForm(false); setEditing(null); }

  function getAuthHeaders(): HeadersInit {
    return adminToken ? { Authorization: `Bearer ${adminToken}` } : {};
  }

  async function handleSave() {
    if (!form.group_name.trim()) { toast.error("กรุณาระบุชื่อกลุ่มงาน"); return; }
    setSaving(true);
    try {
      const url = editing ? `/api/workgroups/${editing.id}` : "/api/workgroups";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json", ...getAuthHeaders() }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success(editing ? "อัปเดตกลุ่มงานเรียบร้อย" : "เพิ่มกลุ่มงานเรียบร้อย");
      cancelForm();
      onRefresh();
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(wg: Workgroup) {
    setDeleting(wg.id);
    try {
      const res = await fetch(`/api/workgroups/${wg.id}`, { method: "DELETE", headers: getAuthHeaders() });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success("ลบกลุ่มงานเรียบร้อย");
      onRefresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      toast.error(msg.includes("มีระบบ") ? "ไม่สามารถลบได้ เพราะยังมีระบบอยู่ในกลุ่มนี้" : "เกิดข้อผิดพลาด");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-sm">
            <FontAwesomeIcon icon={faLayerGroup} className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-slate-800">กลุ่มงาน</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              จัดการกลุ่มงานทั้งหมด
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold ml-1.5">
                {workgroups.length} กลุ่ม
              </span>
            </p>
          </div>
        </div>
        {isAdmin ? (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
            เพิ่มกลุ่มงาน
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-500 text-xs rounded-lg">
            <FontAwesomeIcon icon={faLock} className="w-3 h-3" />
            ต้องเข้าสู่ระบบเพื่อแก้ไข
          </div>
        )}
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-emerald-200 shadow-sm p-5 mb-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            {editing ? "แก้ไขกลุ่มงาน" : "เพิ่มกลุ่มงานใหม่"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">ชื่อกลุ่มงาน <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.group_name}
                onChange={(e) => setForm((p) => ({ ...p, group_name: e.target.value }))}
                placeholder="เช่น งานวิชาการ, คณิตศาสตร์..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">คำอธิบาย</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="อธิบายกลุ่มงาน..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-600 mb-2">สีกลุ่มงาน</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, color_code: c }))}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${form.color_code === c ? "border-slate-800 scale-110 shadow-md" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={form.color_code}
                onChange={(e) => setForm((p) => ({ ...p, color_code: e.target.value }))}
                className="w-7 h-7 rounded-full border-2 border-slate-200 cursor-pointer"
                title="เลือกสีเอง"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                style={{ backgroundColor: form.color_code + "22", color: form.color_code, borderColor: form.color_code + "55" }}
              >
                <FontAwesomeIcon icon={faLayerGroup} className="w-2.5 h-2.5" />
                {form.group_name || "ตัวอย่าง"}
              </span>
              <span className="text-xs text-slate-400">ตัวอย่าง badge</span>
            </div>
          </div>
          <div className="flex gap-2.5 mt-5 justify-end">
            <button onClick={cancelForm} disabled={saving} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
              ยกเลิก
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-60 min-w-[90px] justify-center">
              {saving && <FontAwesomeIcon icon={faSpinner} className="w-3.5 h-3.5 animate-spin" />}
              {saving ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="max-w-full min-w-0 bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="max-w-full min-w-0 overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 w-10">#</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faLayerGroup} className="w-3 h-3 text-slate-400" />ชื่อกลุ่มงาน</span>
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden sm:table-cell">คำอธิบาย</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden md:table-cell">
                <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faCircle} className="w-2.5 h-2.5 text-slate-400" />สี</span>
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden lg:table-cell">จำนวนระบบ</th>
              {isAdmin && <th className="px-4 py-3 w-24" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {workgroups.map((wg, idx) => (
              <tr key={wg.id} className="group hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-3 text-xs text-slate-400 font-medium">{idx + 1}</td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                    style={wg.color_code ? { backgroundColor: wg.color_code + "22", color: wg.color_code, borderColor: wg.color_code + "55" } : {}}
                  >
                    <FontAwesomeIcon icon={faLayerGroup} className="w-2.5 h-2.5 flex-shrink-0" />
                    {wg.group_name}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 hidden sm:table-cell max-w-xs truncate">
                  {wg.description ?? <span className="text-slate-300">—</span>}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: wg.color_code ?? "#94a3b8" }} />
                    <span className="text-xs text-slate-400 font-mono">{wg.color_code ?? "—"}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-xs font-medium text-slate-600">{wg._count?.systems ?? 0} ระบบ</span>
                </td>
                {isAdmin && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(wg)} className="p-1.5 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <FontAwesomeIcon icon={faPen} className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(wg)}
                        disabled={deleting === wg.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        {deleting === wg.id
                          ? <FontAwesomeIcon icon={faSpinner} className="w-3 h-3 animate-spin" />
                          : <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />}
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
    </div>
  );
}
