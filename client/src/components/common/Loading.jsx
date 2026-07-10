// Spinner
export const Spinner = ({ size = 'md', color = 'primary' }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12', xl: 'h-16 w-16' };
  const colors = { primary: 'border-primary-600', white: 'border-white', gray: 'border-gray-400' };

  return (
    <div
      className={`${sizes[size]} border-2 border-transparent ${colors[color]} border-t-2 rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
};

// Full page loader
export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Spinner size="xl" />
      <p className="mt-4 text-gray-500 font-medium">Loading...</p>
    </div>
  </div>
);

// Skeleton line
export const SkeletonLine = ({ className = '' }) => (
  <div className={`skeleton h-4 ${className}`} />
);

// Card skeleton
export const CardSkeleton = () => (
  <div className="card p-0 overflow-hidden">
    <div className="skeleton h-48 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <SkeletonLine className="w-3/4" />
      <SkeletonLine className="w-1/2" />
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-5/6" />
    </div>
  </div>
);

// Grid of card skeletons
export const CardGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

// Table skeleton
export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: cols }).map((_, j) => (
          <SkeletonLine key={j} className="flex-1" />
        ))}
      </div>
    ))}
  </div>
);

// Inline loader (for buttons etc)
export const InlineLoader = () => (
  <span className="inline-flex items-center gap-2">
    <Spinner size="sm" />
    Loading...
  </span>
);

export default Spinner;
