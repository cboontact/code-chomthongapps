"use client";

import { useState } from "react";
import { faTableList, faCircleCheck, faCircleXmark, faThumbTack } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import SearchBar from "@/components/ui/SearchBar";
import StatCard, { StatCardSkeleton } from "@/components/ui/StatCard";
import TableSkeleton from "@/components/ui/TableSkeleton";
import CardSkeleton from "@/components/ui/CardSkeleton";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import SystemsTable from "@/components/systems/SystemsTable";
import SystemsCardGrid from "@/components/systems/SystemsCardGrid";
import SystemModal from "@/components/systems/SystemModal";
import AdminLoginModal from "@/components/auth/AdminLoginModal";
import WorkgroupsPage from "@/components/workgroups/WorkgroupsPage";
import StatsPage from "@/components/stats/StatsPage";

import { useSystems } from "@/hooks/useSystems";
import { useWorkgroups } from "@/hooks/useWorkgroups";
import { useAuth } from "@/hooks/useAuth";
import type { System, ViewMode } from "@/types";
import type { SystemInput } from "@/lib/validators";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("systems");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<System | null>(null);
  const [deletingSystem, setDeletingSystem] = useState<System | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const { isAdmin, adminToken, login, logout } = useAuth();
  const { systems, total, loading, saving, deleting, filters, updateFilters, clearSearch, createSystem, updateSystem, deleteSystem, togglePin, toggleStatus } = useSystems(adminToken);
  const { workgroups, refetch: refetchWorkgroups } = useWorkgroups();

  const activeCount = systems.filter((s) => s.status === "active").length;
  const inactiveCount = systems.filter((s) => s.status === "inactive").length;
  const pinnedCount = systems.filter((s) => s.is_pinned).length;

  function requireAdmin(action: () => void) {
    if (!isAdmin) { toast.warning("กรุณาเข้าสู่ระบบ Admin ก่อน"); setLoginModalOpen(true); return; }
    action();
  }

  function handleAdd() { requireAdmin(() => { setEditingSystem(null); setModalOpen(true); }); }
  function handleEdit(system: System) { requireAdmin(() => { setEditingSystem(system); setModalOpen(true); }); }
  function handleDeleteClick(system: System) { requireAdmin(() => setDeletingSystem(system)); }
  function handleTogglePin(system: System) { requireAdmin(() => togglePin(system)); }
  function handleToggleStatus(system: System) { requireAdmin(() => toggleStatus(system)); }

  async function handleSave(data: SystemInput) {
    const ok = editingSystem ? await updateSystem(editingSystem.id, data) : await createSystem(data);
    if (ok) setModalOpen(false);
  }

  async function handleConfirmDelete() {
    if (!deletingSystem) return;
    const ok = await deleteSystem(deletingSystem.id);
    if (ok) setDeletingSystem(null);
  }

  function handleLogout() {
    logout();
    toast.success("ออกจากระบบเรียบร้อย");
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <Header
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        isAdmin={isAdmin}
        onAdminClick={() => setLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        isAdmin={isAdmin}
      />

      <main className={`${isAdmin ? "lg:ml-56" : ""} pt-14 min-h-screen min-w-0`}>
        <div className="w-full max-w-screen-2xl min-w-0 overflow-x-hidden p-4 sm:p-5">

          {/* ── Systems Page ── */}
          {activeMenu === "systems" && (
            <>
              <TopNav
                title="รายการเว็บแอปพลิเคชัน"
                subtitle="ระบบสารสนเทศทั้งหมดของโรงเรียนจอมทอง"
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onAddClick={handleAdd}
                totalCount={total}
                isAdmin={isAdmin}
              />

              <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-5 min-w-0">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                  : <>
                      <StatCard label="ทั้งหมด"    value={total}         icon={faTableList}   color="sky" />
                      <StatCard label="ใช้งาน"     value={activeCount}   icon={faCircleCheck} color="emerald" />
                      <StatCard label="ปิดใช้งาน"  value={inactiveCount} icon={faCircleXmark} color="slate" />
                      <StatCard label="ปักหมุด"    value={pinnedCount}   icon={faThumbTack}   color="cyan" />
                    </>
                }
              </div>

              <SearchBar
                filters={filters}
                workgroups={workgroups}
                isAdmin={isAdmin}
                onFiltersChange={updateFilters}
                onClearSearch={clearSearch}
              />

              {loading
                ? viewMode === "table" ? <TableSkeleton rows={8} /> : <CardSkeleton count={8} />
                : viewMode === "table"
                  ? <SystemsTable systems={systems} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDeleteClick} onTogglePin={handleTogglePin} onToggleStatus={handleToggleStatus} onAdd={handleAdd} />
                  : <SystemsCardGrid systems={systems} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDeleteClick} onTogglePin={handleTogglePin} onToggleStatus={handleToggleStatus} onAdd={handleAdd} />
              }
            </>
          )}

          {/* ── Workgroups Page ── */}
          {activeMenu === "workgroups" && (
            <WorkgroupsPage
              workgroups={workgroups}
              isAdmin={isAdmin}
              adminToken={adminToken}
              onRefresh={refetchWorkgroups}
            />
          )}

          {/* ── Stats Page ── */}
          {activeMenu === "stats" && (
            <StatsPage systems={systems} workgroups={workgroups} />
          )}

        </div>
      </main>

      {/* Modals */}
      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={login}
      />

      <SystemModal
        isOpen={modalOpen}
        system={editingSystem}
        workgroups={workgroups}
        isLoading={saving}
        onClose={() => !saving && setModalOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        isOpen={!!deletingSystem}
        title="ยืนยันการลบระบบ"
        message={`คุณต้องการลบ "${deletingSystem?.system_name}" ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`}
        confirmLabel="ลบระบบ"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => !deleting && setDeletingSystem(null)}
      />
    </div>
  );
}
