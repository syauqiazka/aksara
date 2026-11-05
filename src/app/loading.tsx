export default function GlobalLoading() {
  return (
    <div className="w-full min-h-[70vh] bg-[var(--cream-50)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-3 max-w-lg">
          <div className="h-4 w-32 bg-[var(--sage-200)] rounded" />
          <div className="h-9 w-3/4 bg-[var(--sage-200)]/80 rounded-lg" />
          <div className="h-4 w-full bg-[var(--sage-100)] rounded" />
        </div>

        {/* Highlight Monolith Skeleton */}
        <div className="w-full h-48 bg-white border border-[var(--sage-200)] rounded-xl p-6 space-y-4 shadow-sm">
          <div className="h-6 w-48 bg-[var(--sage-100)] rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="h-20 bg-[var(--cream-100)] rounded-lg" />
            <div className="h-20 bg-[var(--cream-100)] rounded-lg" />
            <div className="h-20 bg-[var(--cream-100)] rounded-lg" />
          </div>
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-white border border-[var(--sage-200)] rounded-xl p-5 space-y-3 shadow-sm"
            >
              <div className="h-32 bg-[var(--cream-100)] rounded-lg" />
              <div className="h-5 w-2/3 bg-[var(--sage-100)] rounded" />
              <div className="h-4 w-5/6 bg-[var(--cream-100)] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

