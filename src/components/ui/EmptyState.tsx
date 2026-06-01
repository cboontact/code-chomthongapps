import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox, faPlus } from "@fortawesome/free-solid-svg-icons";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAdd?: () => void;
}

export default function EmptyState({
  title = "ยังไม่มีข้อมูล",
  description = "เริ่มต้นโดยการเพิ่มระบบแรกของคุณ",
  onAdd,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <FontAwesomeIcon icon={faInbox} className="w-7 h-7 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-5">{description}</p>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
          เพิ่มระบบใหม่
        </button>
      )}
    </div>
  );
}
