export default function CardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg" />
            <div className="w-16 h-5 bg-slate-100 rounded-full" />
          </div>
          <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
          <div className="h-3 bg-slate-100 rounded w-1/2 mb-4" />
          <div className="flex gap-2 pt-3 border-t border-slate-100">
            <div className="flex-1 h-8 bg-slate-100 rounded-lg" />
            <div className="w-8 h-8 bg-slate-100 rounded-lg" />
            <div className="w-8 h-8 bg-slate-100 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
