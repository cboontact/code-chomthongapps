"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield, faTimes, faSpinner, faEye, faEyeSlash, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => Promise<boolean>;
}

export default function AdminLoginModal({ isOpen, onClose, onLogin }: AdminLoginModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        setPassword("");
        setError("");
        setShowPassword(false);
        inputRef.current?.focus();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, loading, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) { setError("กรุณาใส่รหัสผ่าน"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const ok = await onLogin(password).catch(() => false);
    setLoading(false);
    if (ok) {
      onClose();
    } else {
      setError("รหัสผ่านไม่ถูกต้อง");
      setPassword("");
      inputRef.current?.focus();
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 px-6 py-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
            <FontAwesomeIcon icon={faShield} className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-base font-semibold text-white">เข้าสู่ระบบผู้ดูแล</h2>
          <p className="text-xs text-slate-400 mt-1">ใส่รหัสผ่านเพื่อจัดการข้อมูล</p>
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">รหัสผ่าน</label>
            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="ใส่รหัสผ่านผู้ดูแลระบบ"
                className={`w-full px-3 pr-10 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all
                  ${error ? "border-red-300 focus:ring-red-200 bg-red-50" : "border-slate-200 focus:ring-sky-200 focus:border-sky-400"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-3.5 h-3.5" />
              </button>
            </div>
            {error && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
                <FontAwesomeIcon icon={faTriangleExclamation} className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading || !password}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading && <FontAwesomeIcon icon={faSpinner} className="w-3.5 h-3.5 animate-spin" />}
              {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
