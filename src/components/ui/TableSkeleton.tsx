export default function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-3 bg-slate-50 border-b border-slate-200">
          {[80, 200, 120, 100, 80, 80].map((w, i) => (
            <div key={i} className="h-3 bg-slate-200 rounded" style={{ width: w }} />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-slate-100 last:border-0">
            <div className="w-6 h-3 bg-slate-100 rounded" />
            <div className="flex-1 h-4 bg-slate-100 rounded" />
            <div className="w-24 h-3 bg-slate-100 rounded" />
            <div className="w-20 h-5 bg-slate-100 rounded-full" />
            <div className="w-16 h-3 bg-slate-100 rounded" />
            <div className="flex gap-2">
              <div className="w-7 h-7 bg-slate-100 rounded-lg" />
              <div className="w-7 h-7 bg-slate-100 rounded-lg" />
              <div className="w-7 h-7 bg-slate-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
