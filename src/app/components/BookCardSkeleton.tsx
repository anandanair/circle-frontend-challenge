// BookCardSkeleton.tsx
export function BookCardSkeleton() {
  return (
    <div className="rounded-xl shadow-md overflow-hidden bg-white h-full">
      {/* Banner skeleton */}
      <div className="h-24 bg-gray-200 animate-pulse"></div>

      {/* Content skeleton */}
      <div className="p-6">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded-md w-1/2 mb-6 animate-pulse"></div>

        {/* Author skeleton */}
        <div className="h-4 bg-gray-200 rounded-md w-1/3 mb-6 animate-pulse"></div>

        {/* ISBN skeleton */}
        <div className="h-4 bg-gray-200 rounded-md w-1/4 mb-8 animate-pulse"></div>

        {/* Stock skeleton */}
        <div className="h-4 bg-gray-200 rounded-md w-2/5 animate-pulse"></div>
      </div>
    </div>
  );
}
