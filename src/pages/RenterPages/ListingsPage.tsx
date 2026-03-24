import { useListingsStore } from "../../store/renter/ListingsStore";
import { useEffect } from "react";
import ListingsPageSkeleton from "../../components/RenterComponents/ListingsPageSkeleton";
import { Link, useNavigate } from "react-router-dom";
import Topbar from "../../components/RenterComponents/Topbar";
import Footer from "../../components/Footer";

export default function ListingsPage() {
  const { allListings, isLoading, fetchListings } = useListingsStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return (
    <section className="mt-[3.8rem] min-h-screen">
      {/* Topbar stays mounted outside the loading condition to prevent re-mounting loops */}
      <Topbar />
      
      <div className="w-[85%] md:w-[90%] lg:w-[85%] mx-auto mt-9">
        {isLoading ? (
          <ListingsPageSkeleton />
        ) : allListings.length === 0 ? (
          <div className="text-center h-[80vh] mt-20">
            <h3 className="text-2xl font-semibold text-gray-700">No listings found</h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {allListings.map((l) => (
              <div key={l.id} className="group">
                <span className="relative block w-full overflow-hidden rounded-md">
                  <p className="absolute top-2 left-2 text-xs font-semibold bg-[#65b110] text-white py-2 px-3 rounded-sm z-10 tracking-wide">
                    FOR RENT
                  </p>
                  <img
                    src={l.images?.[0]?.url || "https://via.placeholder.com/300"}
                    alt={l.title}
                    className="w-full h-[300px] rounded-md object-cover hover:cursor-pointer group-hover:scale-105 group-hover:brightness-90 transition-all duration-300 ease-in-out"
                    onClick={() => {
                      navigate(`/listings/${l.id}`);
                    }}
                  />
                </span>

                <div className="flex flex-col mt-3 gap-y-1 border-b-2 border-gray-300 pb-2">
                  <Link
                    to={`/listings/${l.id}`}
                    className="text-[#080e51] lg:text-[1.1rem] font-medium hover:underline truncate"
                  >
                    {l.title}
                  </Link>
                  <p className="text-gray-600 text-sm lg:text-base">
                    {l.address}, {l.state}
                  </p>
                  <p className="text-[#080e51] md:text-[1.1rem] font-bold">
                    £{Number(l.price).toLocaleString()} / month
                  </p>
                </div>

                <div className="flex justify-between w-[90%] mt-3">
                  <span className="flex gap-2 items-center">
                    <img
                      src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1774081306/bedroom-hotel-svgrepo-com_wj7ymy.svg"
                      alt="icon"
                      className="w-[18px] lg:w-[22px]"
                    />
                    <p className="text-sm lg:text-base text-gray-700">{l.bedrooms} br</p>
                  </span>

                  <span className="flex gap-2 items-center">
                    <img
                      src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1774117753/shower-head-svgrepo-com_1_qmedlu.svg"
                      alt="icon"
                      className="w-[18px] lg:w-[22px]"
                    />
                    <p className="text-sm lg:text-base text-gray-700">{l.bathrooms} ba</p>
                  </span>

                  <span className="flex gap-2 items-center">
                    <img
                      src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1774081530/area-svgrepo-com_1_xgeqhg.svg"
                      alt="icon"
                      className="w-[18px] lg:w-[22px]"
                    />
                    <p className="text-sm lg:text-base text-gray-700">{l.land_size_sqft} SqFt</p>
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
      <Footer />
    </section>
  );
}