// Skeleton loaders for DelhiBikesHub components

// ─── Card Skeleton ─────────────────────────────────────
export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
    <div className="h-44 sm:h-48 bg-slate-200" />
    <div className="p-4 sm:p-5 space-y-3">
      <div className="h-5 bg-slate-200 rounded-lg w-3/4" />
      <div className="flex gap-3">
        <div className="h-4 bg-slate-100 rounded w-16" />
        <div className="h-4 bg-slate-100 rounded w-12" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-slate-200 rounded-lg w-24" />
        <div className="h-4 bg-slate-100 rounded w-16" />
      </div>
      <div className="h-11 bg-slate-200 rounded-xl w-full mt-2" />
    </div>
  </div>
);

// ─── Grid of Card Skeletons ────────────────────────────
export const CardGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

// ─── Detail Page Skeleton ──────────────────────────────
export const DetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-pulse">
    <div className="h-5 bg-slate-200 rounded w-32 mb-6" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
      <div className="lg:col-span-2 space-y-6">
        <div className="aspect-[4/3] sm:aspect-[16/10] bg-slate-200 rounded-2xl lg:rounded-[2.5rem]" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl" />
          ))}
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <div className="h-6 bg-slate-200 rounded w-48 mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-100 rounded w-full" />
            <div className="h-4 bg-slate-100 rounded w-5/6" />
            <div className="h-4 bg-slate-100 rounded w-3/4" />
          </div>
        </div>
      </div>
      <div className="hidden lg:block space-y-6">
        <div className="h-64 bg-slate-200 rounded-[2.5rem]" />
        <div className="h-56 bg-slate-100 rounded-[2.5rem]" />
      </div>
    </div>
  </div>
);

// ─── Profile Skeleton ──────────────────────────────────
export const ProfileSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 animate-pulse">
    <div className="h-24 bg-slate-200 rounded-t-2xl -m-6 mb-4" />
    <div className="pt-8 space-y-4 text-center">
      <div className="w-20 h-20 bg-slate-200 rounded-2xl mx-auto" />
      <div className="h-6 bg-slate-200 rounded w-32 mx-auto" />
      <div className="h-4 bg-slate-100 rounded w-24 mx-auto" />
      <div className="space-y-2 pt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 bg-slate-100 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

// ─── Inline Spinner ────────────────────────────────────
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-10 w-10 border-[3px]',
    lg: 'h-14 w-14 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} animate-spin rounded-full border-slate-200 border-t-primary-600`}
      />
    </div>
  );
};

// ─── Full-page Loader ──────────────────────────────────
export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center space-y-4">
      <Spinner size="lg" />
      <p className="text-slate-400 text-sm font-bold">Loading...</p>
    </div>
  </div>
);

export default {
  CardSkeleton,
  CardGridSkeleton,
  DetailSkeleton,
  ProfileSkeleton,
  Spinner,
  PageLoader,
};
