"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableList, faLayerGroup, faChartBar, faTimes } from "@fortawesome/free-solid-svg-icons";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  isAdmin: boolean;
}

const menuItems = [
  { id: "systems",    label: "รายการเว็บแอปพลิเคชัน", icon: faTableList,  adminOnly: false },
  { id: "workgroups", label: "กลุ่มงาน",           icon: faLayerGroup, adminOnly: true },
  { id: "stats",      label: "สถิติภาพรวม",         icon: faChartBar,   adminOnly: true },
];

export default function Sidebar({ isOpen, onClose, activeMenu, onMenuChange, isAdmin }: SidebarProps) {
  if (!isAdmin) return null;
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-56 bg-white border-r border-slate-200 flex flex-col shadow-lg transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:shadow-none`}
      >
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="โรงเรียนจอมทอง" width={28} height={28} className="rounded-lg" />
            <span className="text-sm font-semibold text-slate-800">Chomthong Web Apps</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="px-3 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">เมนู</p>
          {menuItems.map((item) => {
            const active = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onMenuChange(item.id); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150
                  ${active
                    ? "bg-sky-50 text-sky-700 shadow-sm border border-sky-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800 border border-transparent"
                  }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                  ${active ? "bg-sky-100" : "bg-slate-100"}`}>
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`w-3.5 h-3.5 ${active ? "text-sky-600" : "text-slate-400"}`}
                  />
                </div>
                <p className="text-sm font-medium leading-tight">{item.label}</p>
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center">v1.0.0 · โรงเรียนจอมทอง</p>
        </div>
      </aside>
    </>
  );
}
