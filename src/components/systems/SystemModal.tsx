"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faSpinner,
  faFloppyDisk,
  faDesktop,
  faLink,
  faLayerGroup,
  faUserPen,
  faCircleDot,
  faArrowsUpDown,
  faNoteSticky,
  faThumbTack,
  faPenToSquare,
  faPlus,
  faTriangleExclamation,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import type { System, Workgroup } from "@/types";
import type { SystemInput } from "@/lib/validators";

interface SystemModalProps {
  isOpen: boolean;
  system: System | null;
  workgroups: Workgroup[];
  isLoading: boolean;
  onClose: () => void;
  onSave: (data: SystemInput) => Promise<void>;
}

const defaultForm: SystemInput = {
  system_name: "",
  system_url: "",
  workgroup_id: null,
  creator_name: "",
  note: "",
  is_pinned: false,
  sort_order: 0,
  status: "active",
};

function SectionHeader({ icon, label }: { icon: typeof faDesktop; label: string }) {
  return (
    <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
      <div className="w-5 h-5 rounded bg-sky-100 flex items-center justify-center flex-shrink-0">
        <FontAwesomeIcon icon={icon} className="w-2.5 h-2.5 text-sky-600" />
      </div>
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function FieldLabel({
  icon,
  label,
  required,
}: {
  icon: typeof faDesktop;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
      <FontAwesomeIcon icon={icon} className="w-3 h-3 text-slate-400" />
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

export default function SystemModal({
  isOpen,
  system,
  workgroups,
  isLoading,
  onClose,
  onSave,
}: SystemModalProps) {
  const [form, setForm] = useState<SystemInput>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (system) {
        setForm({
          system_name: system.system_name,
          system_url: system.system_url ?? "",
          workgroup_id: system.workgroup_id,
          creator_name: system.creator_name ?? "",
          note: system.note ?? "",
          is_pinned: system.is_pinned,
          sort_order: system.sort_order,
          status: system.status,
        });
      } else {
        setForm(defaultForm);
      }
      setErrors({});
    }, 0);
    return () => window.clearTimeout(timer);
  }, [system, isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, isLoading, onClose]);

  function set(field: keyof SystemInput, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.system_name.trim()) errs.system_name = "กรุณาระบุชื่อระบบ";
    if (form.system_url && !/^https?:\/\/.+/.test(form.system_url)) {
      errs.system_url = "รูปแบบ URL ไม่ถูกต้อง (ต้องขึ้นต้นด้วย http:// หรือ https://)";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSave(form);
  }

  if (!isOpen) return null;

  const isEdit = !!system;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">

        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-sky-50 to-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${isEdit ? "bg-blue-600" : "bg-sky-600"}`}>
              <FontAwesomeIcon
                icon={isEdit ? faPenToSquare : faPlus}
                className="w-4 h-4 text-white"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-slate-800">
                {isEdit ? "แก้ไขระบบ" : "เพิ่มระบบใหม่"}
              </h2>
              <p className="truncate text-[11px] text-slate-400 mt-0.5">
                {isEdit ? `กำลังแก้ไข: ${system.system_name}` : "กรอกข้อมูลระบบสารสนเทศใหม่"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </div>

        {/* ── Modal Body ── */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="px-4 sm:px-6 py-5 space-y-5">

            {/* Section: ข้อมูลพื้นฐาน */}
            <SectionHeader icon={faDesktop} label="ข้อมูลพื้นฐาน" />

            {/* ชื่อระบบ */}
            <div>
              <FieldLabel icon={faDesktop} label="ชื่อระบบ" required />
              <input
                type="text"
                value={form.system_name}
                onChange={(e) => set("system_name", e.target.value)}
                placeholder="ระบุชื่อระบบ เช่น ระบบลงทะเบียนนักเรียน..."
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all
                  ${errors.system_name
                    ? "border-red-300 focus:ring-red-200 bg-red-50"
                    : "border-slate-200 focus:ring-sky-200 focus:border-sky-400"
                  }`}
              />
              {errors.system_name && (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="w-3 h-3" />
                  {errors.system_name}
                </p>
              )}
            </div>

            {/* URL */}
            <div>
              <FieldLabel icon={faLink} label="URL ระบบ" />
              <input
                type="text"
                value={form.system_url ?? ""}
                onChange={(e) => set("system_url", e.target.value)}
                placeholder="https://chomthongschool.ac.th/..."
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all
                  ${errors.system_url
                    ? "border-red-300 focus:ring-red-200 bg-red-50"
                    : "border-slate-200 focus:ring-sky-200 focus:border-sky-400"
                  }`}
              />
              {errors.system_url && (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="w-3 h-3" />
                  {errors.system_url}
                </p>
              )}
            </div>

            {/* Workgroup + Creator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FieldLabel icon={faLayerGroup} label="กลุ่มงาน" />
                <select
                  value={form.workgroup_id ?? ""}
                  onChange={(e) => set("workgroup_id", e.target.value || null)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all appearance-none bg-white"
                >
                  <option value="">— ไม่ระบุ —</option>
                  {workgroups.map((wg) => (
                    <option key={wg.id} value={wg.id}>
                      {wg.group_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel icon={faUserPen} label="ผู้สร้าง / ดูแล" />
                <input
                  type="text"
                  value={form.creator_name ?? ""}
                  onChange={(e) => set("creator_name", e.target.value)}
                  placeholder="ชื่อผู้รับผิดชอบ..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all"
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <FieldLabel icon={faNoteSticky} label="หมายเหตุ / รายละเอียด" />
              <textarea
                value={form.note ?? ""}
                onChange={(e) => set("note", e.target.value)}
                rows={3}
                placeholder="อธิบายรายละเอียดของระบบ..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all resize-none"
              />
            </div>

            {/* Section: การตั้งค่า */}
            <SectionHeader icon={faGear} label="การตั้งค่า" />

            {/* Status + Sort */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FieldLabel icon={faCircleDot} label="สถานะการใช้งาน" />
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all appearance-none bg-white"
                >
                  <option value="active">✓ เปิดใช้งาน</option>
                  <option value="inactive">✕ ปิดใช้งาน</option>
                </select>
              </div>
              <div>
                <FieldLabel icon={faArrowsUpDown} label="ลำดับแสดงผล" />
                <input
                  type="number"
                  min={0}
                  value={form.sort_order}
                  onChange={(e) => set("sort_order", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all"
                />
              </div>
            </div>

            {/* Pin toggle */}
            <div
              className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors cursor-pointer
                ${form.is_pinned ? "bg-sky-50 border-sky-200" : "bg-slate-50 border-slate-200"}`}
              onClick={() => set("is_pinned", !form.is_pinned)}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                ${form.is_pinned ? "bg-sky-500" : "bg-slate-200"}`}>
                <FontAwesomeIcon icon={faThumbTack} className={`w-3.5 h-3.5 ${form.is_pinned ? "text-white" : "text-slate-500"}`} />
              </div>
              <div className="flex-1">
                <p className={`text-xs font-semibold ${form.is_pinned ? "text-sky-700" : "text-slate-700"}`}>
                  ปักหมุดรายการนี้
                </p>
                <p className="text-[11px] text-slate-400">รายการที่ปักหมุดจะแสดงอยู่ด้านบนเสมอ</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); set("is_pinned", !form.is_pinned); }}
                className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${form.is_pinned ? "bg-sky-500" : "bg-slate-300"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${form.is_pinned ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>

          </div>

          {/* ── Modal Footer ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <p className="text-[11px] text-slate-400">
              <FontAwesomeIcon icon={faTriangleExclamation} className="w-3 h-3 mr-1 text-amber-400" />
              ช่องที่มี <span className="text-red-500 font-bold">*</span> จำเป็นต้องกรอก
            </p>
            <div className="flex w-full sm:w-auto items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex flex-1 sm:flex-none items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors disabled:opacity-70 min-w-[110px] justify-center shadow-sm shadow-sky-200"
              >
                {isLoading ? (
                  <FontAwesomeIcon icon={faSpinner} className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faFloppyDisk} className="w-3.5 h-3.5" />
                )}
                {isLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
