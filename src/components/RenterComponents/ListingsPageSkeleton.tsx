export default function ListingsPageSkeleton() {
  return (
    <section className="mt-[3.8rem] min-h-screen">
      {/* Topbar Skeleton */}
      <div className="w-full bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-4xl mx-auto flex gap-3 items-center">
          <div className="h-10 flex-1 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="w-[85%] md:w-[90%] lg:w-[85%] mx-auto mt-9">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="group">
              {/* Image skeleton */}
              <div className="relative w-full h-[300px] rounded-md overflow-hidden bg-gray-200">
                {/* FOR RENT badge skeleton */}
                <div className="absolute top-2 left-2 h-7 w-20 bg-gray-300 rounded-sm animate-pulse" />
                {/* Shimmer sweep */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  style={{
                    animation: `slide 1.5s infinite`,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              </div>

              {/* Card content */}
              <div className="flex flex-col mt-3 gap-y-2 border-b-2 border-gray-200 pb-2">
                {/* Title */}
                <div className="h-4 w-full bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                {/* Address */}
                <div className="h-3 w-3/4 bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                {/* Price */}
                <div className="h-4 w-1/2 bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              </div>

              {/* Icons row */}
              <div className="flex justify-between w-[90%] mt-3">
                {[...Array(3)].map((_, j) => (
                  <span key={j} className="flex gap-2 items-center">
                    <div className="w-[22px] h-[22px] bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-10 bg-gray-200 rounded-full animate-pulse" />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
}