export default function ListingsPageSkeleton() {
    return (
      <div className="min-h-screen bg-[#f8f8f8]">
        
        {/* Hero Search Skeleton */}
        <div className="w-full bg-white border-b border-gray-100 py-8 px-6">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
            <div className="h-6 w-64 bg-gray-200 rounded-full animate-pulse" />
            <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
  
        <div className="flex max-w-[1400px] mx-auto px-6 py-8 gap-6">
  
          {/* Filter Panel Skeleton */}
          <aside className="w-64 shrink-0">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-6">
  
              {/* Filter heading */}
              <div className="h-5 w-24 bg-gray-200 rounded-full animate-pulse" />
  
              {/* Price Range */}
              <div className="flex flex-col gap-2">
                <div className="h-3 w-20 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-2 w-full bg-gray-200 rounded-full animate-pulse" />
                <div className="flex justify-between">
                  <div className="h-3 w-10 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-3 w-10 bg-gray-200 rounded-full animate-pulse" />
                </div>
              </div>
  
              {/* Bedrooms */}
              <div className="flex flex-col gap-2">
                <div className="h-3 w-20 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-8 w-10 bg-gray-200 rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
  
              {/* Bathrooms */}
              <div className="flex flex-col gap-2">
                <div className="h-3 w-20 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-8 w-10 bg-gray-200 rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
  
              {/* Category */}
              <div className="flex flex-col gap-2">
                <div className="h-3 w-20 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
  
              {/* Amenities */}
              <div className="flex flex-col gap-2">
                <div className="h-3 w-20 bg-gray-200 rounded-full animate-pulse" />
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
  
              {/* Clear button */}
              <div className="h-9 w-full bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </aside>
  
          {/* Results Area Skeleton */}
          <div className="flex-1 flex flex-col gap-5">
  
            {/* Results bar */}
            <div className="flex justify-between items-center">
              <div className="h-4 w-40 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-9 w-36 bg-gray-200 rounded-lg animate-pulse" />
            </div>
  
            {/* Property Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Image skeleton with glow */}
                  <div className="relative w-full h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-[shimmer_1.5s_infinite]" 
                       style={{
                         backgroundSize: "200% 100%",
                         animation: `shimmer 1.5s infinite`,
                         animationDelay: `${i * 80}ms`
                       }}
                  >
                    {/* Glow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[slide_1.5s_infinite]"
                         style={{ animationDelay: `${i * 80}ms` }}
                    />
                  </div>
  
                  {/* Card content */}
                  <div className="p-4 flex flex-col gap-3">
                    {/* Badge + price */}
                    <div className="flex justify-between items-center">
                      <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                      <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                    </div>
                    {/* Title */}
                    <div className="h-4 w-full bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                    <div className="h-4 w-3/4 bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                    {/* Beds baths */}
                    <div className="flex gap-3 pt-1">
                      <div className="h-3 w-12 bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                      <div className="h-3 w-12 bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                      <div className="h-3 w-12 bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                    </div>
                    {/* Location */}
                    <div className="h-3 w-28 bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                    {/* Button */}
                    <div className="h-9 w-full bg-gray-200 rounded-xl animate-pulse mt-1" style={{ animationDelay: `${i * 80}ms` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Shimmer keyframe */}
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes slide {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    )
  }