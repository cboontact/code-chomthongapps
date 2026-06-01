"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield, faBars, faRightFromBracket, faLock } from "@fortawesome/free-solid-svg-icons";

interface HeaderProps {
  onMenuToggle: () => void;
  isAdmin: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
}

export default function Header({ onMenuToggle, isAdmin, onAdminClick, onLogout }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 shadow-sm">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
      >
        <FontAwesomeIcon icon={faBars} className="w-4 h-4" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <Image src="/logo.png" alt="โรงเรียนจอมทอง" width={32} height={32} className="rounded-lg" />
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-slate-800 leading-tight">Chomthong Web Apps</p>
          <p className="text-[10px] text-slate-400 leading-tight">โรงเรียนจอมทอง</p>
        </div>
      </div>

      <div className="flex-1" />

      {/* Admin controls */}
      <div className="flex items-center gap-2">
        {isAdmin ? (
          <>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
              <FontAwesomeIcon icon={faShield} className="w-3 h-3 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">ชลนที บุญทา</span>
            </div>
            <button
              onClick={onLogout}
              title="ออกจากระบบ"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="w-3 h-3" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </>
        ) : (
          <button
            onClick={onAdminClick}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-sky-700 bg-slate-100 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faLock} className="w-3 h-3" />
            <span>Admin</span>
          </button>
        )}
      </div>
    </header>
  );
}
