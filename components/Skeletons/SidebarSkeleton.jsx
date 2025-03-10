export default function SidebarSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="h-6 bg-gray-700 rounded w-1/2 mb-6"></div>
      
      {/* Control group skeletons */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="mb-6">
          <div className="h-5 bg-gray-700 rounded w-1/3 mb-3"></div>
          <div className="h-10 bg-gray-700 rounded mb-2"></div>
          <div className="h-10 bg-gray-700 rounded mb-2"></div>
          {i % 2 === 0 && <div className="h-10 bg-gray-700 rounded mb-2"></div>}
        </div>
      ))}
      
      {/* Button skeletons */}
      <div className="flex flex-wrap gap-2 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 bg-gray-700 rounded w-24"></div>
        ))}
      </div>
    </div>
  );
}
