import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: IconDefinition;
  color: "sky" | "emerald" | "cyan" | "blue" | "slate";
  loading?: boolean;
}

const colorMap = {
  sky: { bg: "bg-sky-50", icon: "bg-sky-100 text-sky-600", value: "text-sky-700", border: "border-sky-100" },
  emerald: { bg: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-600", value: "text-emerald-700", border: "border-emerald-100" },
  cyan: { bg: "bg-cyan-50", icon: "bg-cyan-100 text-cyan-600", value: "text-cyan-700", border: "border-cyan-100" },
  blue: { bg: "bg-blue-50", icon: "bg-blue-100 text-blue-600", value: "text-blue-700", border: "border-blue-100" },
  slate: { bg: "bg-slate-50", icon: "bg-slate-100 text-slate-600", value: "text-slate-700", border: "border-slate-200" },
};

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100" />
        <div className="flex-1">
          <div className="h-3 bg-slate-100 rounded w-20 mb-2" />
          <div className="h-6 bg-slate-100 rounded w-12" />
        </div>
      </div>
    </div>
  );
}

export default function StatCard({ label, value, icon, color, loading }: StatCardProps) {
  const c = colorMap[color];

  if (loading) return <StatCardSkeleton />;

  return (
    <div className={`min-w-0 bg-white rounded-xl border ${c.border} p-3 sm:p-4 hover:shadow-sm transition-shadow`}>
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${c.icon} flex items-center justify-center flex-shrink-0`}>
          <FontAwesomeIcon icon={icon} className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[11px] sm:text-xs text-slate-500 font-medium">{label}</p>
          <p className={`text-xl sm:text-2xl font-bold ${c.value} leading-tight`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
