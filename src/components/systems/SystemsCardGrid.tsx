"use client";

import type { System } from "@/types";
import SystemCard from "./SystemCard";
import EmptyState from "@/components/ui/EmptyState";

interface SystemsCardGridProps {
  systems: System[];
  isAdmin: boolean;
  onEdit: (system: System) => void;
  onDelete: (system: System) => void;
  onTogglePin: (system: System) => void;
  onToggleStatus: (system: System) => void;
  onAdd: () => void;
}

export default function SystemsCardGrid({ systems, isAdmin, onEdit, onDelete, onTogglePin, onToggleStatus, onAdd }: SystemsCardGridProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {systems.map((system) => (
        <SystemCard
          key={system.id}
          system={system}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePin={onTogglePin}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
}
