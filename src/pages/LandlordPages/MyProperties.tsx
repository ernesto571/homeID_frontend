import { useEffect, useState } from "react"
import { UserButton } from "@clerk/clerk-react"
import Sidebar from "../../components/LandlordComponents/Sidebar"
import { useLandlordAuthStore } from "../../store/landlord/LandlordAuthStore"
import AddPropertyModal from "../../components/LandlordComponents/AddpropertyModal"
import { useLandlordPropertyStore } from "../../store/landlord/LandlordPrpertyStore"
import { Bell } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ITEMS_PER_PAGE = 8

export default function MyProperties() {
  const profile = useLandlordAuthStore((s) => s.profile)
  const [showModal, setShowModal] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [editingProperty, setEditingProperty] = useState<any | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { properties, fetchLandlordProperties, isLoading, deleteProperty } = useLandlordPropertyStore()
  const navigate = useNavigate()
  const unreadCount = 0 

  useEffect(() => {
    fetchLandlordProperties();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this property?")
    if (!confirmed) return
    setDeletingId(id)
    await deleteProperty(id)
    setDeletingId(null)
  }

  // ✅ Pagination logic
  const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE)
  const paginatedProperties = properties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    // ✅ overflow-hidden on outer so only inner sections scroll
    <section className="h-screen overflow-hidden">
      <div className="grid grid-cols-6 h-full">

        {/* ✅ Fixed Sidebar — sticky keeps it in place */}
        <section className="col-span-1 h-screen sticky top-0">
          <Sidebar />
        </section>

        {/* ✅ Main content scrolls independently */}
        <section className="col-span-5 bg-[#f8f8f8] h-screen overflow-y-auto flex flex-col">

          {/* ✅ Fixed Topbar — sticky at top of scroll container */}
          <div className="sticky top-0 z-10 flex border-b border-gray-200 py-2 bg-white">
            <span className="flex justify-between items-center w-[90%] mx-auto">
              <input type="text" className="hidden lg:flex border border-gray-200 rounded-md py-1 px-4 text-sm" placeholder="Search..." />
              <div className="flex gap-3 border-l border-gray-200 pl-3 items-center">
                
                {/* ✅ Bell icon */}
                <button
                  onClick={() => navigate("/dashboard/enquiries")}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <Bell size={18} className="text-gray-500" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <UserButton />
                <p className="text-gray-700 text-sm">{profile?.first_name} {profile?.last_name}</p>
              </div>
            </span>
          </div>
          
          <div className="flex lg:hidden mt-7  items-center gap-2 bg-[#94e5ec]/15 border border-[#94e5ec] text-[#32cddb] text-xs font-medium px-4 py-2.5 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            To add a property please use a laptop
          </div>
          {/* Content */}
          <div className="hidden lg:flex w-[90%] mx-auto mt-8 flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Properties</h1>
                <p className="text-sm text-gray-400 mt-1">All your listings, in one place</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#32cddb] text-white text-sm font-semibold rounded-xl shadow-md shadow-[#32cddb]/20 hover:bg-[#32cddb]/90 transition-all"
              >
                + Add Listing
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">

                {/* ✅ Fixed table head */}
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="border-b border-gray-100 text-left">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Listing Type</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date Added</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i} className="border-b border-gray-50 animate-pulse">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gray-100" />
                            <div className="space-y-2">
                              <div className="h-3 w-32 bg-gray-100 rounded" />
                              <div className="h-2 w-20 bg-gray-100 rounded" />
                            </div>
                          </div>
                        </td>
                        {[...Array(4)].map((_, j) => (
                          <td key={j} className="px-6 py-4">
                            <div className="h-3 w-20 bg-gray-100 rounded" />
                          </td>
                        ))}
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <div className="h-7 w-12 bg-gray-100 rounded-lg" />
                            <div className="h-7 w-14 bg-gray-100 rounded-lg" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : properties.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="flex flex-col items-center justify-center py-20 px-6">
                          <div className="w-20 h-20 rounded-2xl bg-[#94e5ec]/20 flex items-center justify-center mb-5">
                            <span className="text-4xl">🏠</span>
                          </div>
                          <h3 className="text-gray-700 font-semibold text-lg mb-1">No listings yet</h3>
                          <p className="text-gray-400 text-sm text-center max-w-xs mb-6">
                            You haven't added any properties yet. Start by listing your first property.
                          </p>
                          <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#32cddb] text-white text-sm font-semibold rounded-xl shadow-md shadow-[#32cddb]/20 hover:bg-[#32cddb]/90 transition-all"
                          >
                            + Add Your First Listing
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // ✅ Use paginatedProperties instead of properties
                    paginatedProperties.map((property) => (
                      <tr key={property.id} className="border-b border-gray-50 hover:bg-gray-50 transition-all">

                        {/* Property */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {property.images?.[0]?.url ? (
                              <img
                                src={property.images[0].url}
                                alt={property.title}
                                className="w-[5rem] rounded-lg object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-[#94e5ec]/20 flex items-center justify-center shrink-0">
                                <span className="text-xl">🏠</span>
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-800 truncate max-w-[180px]">{property.title}</p>
                              <p className="text-xs text-gray-400">{property.bedrooms} bed · {property.bathrooms} bath</p>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-6 py-4">
                          <p className="text-gray-700">{property.city}</p>
                          <p className="text-xs text-gray-400">{property.neighbourhood}</p>
                        </td>

                        {/* Listing Type */}
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${property.category === "rent"
                              ? "bg-[#94e5ec]/20 text-[#32cddb]"
                              : "bg-orange-100 text-orange-500"
                            }`}>
                            {property.category === "rent" ? "For Rent" : "For Sale"}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-800">
                            £{Number(property.price).toLocaleString()}
                          </p>
                          {property.category === "rent" && (
                            <p className="text-xs text-gray-400">/month</p>
                          )}
                        </td>

                        {/* Date Added */}
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(property.created_at).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingProperty(property)}
                              className="px-3 py-1.5 text-xs font-medium text-[#32cddb] border border-[#32cddb] rounded-lg hover:bg-[#32cddb] hover:text-white transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(property.id)}
                              disabled={deletingId === property.id}
                              className="px-3 py-1.5 text-xs font-medium text-red-400 border border-red-200 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                            >
                              {deletingId === property.id ? "..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ✅ Pagination */}
            {!isLoading && properties.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between py-4 mt-2">
                <p className="text-xs text-gray-400">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, properties.length)} of {properties.length} properties
                </p>
                <div className="flex items-center gap-1">
                  {/* Prev */}
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-all"
                  >
                    ← Prev
                  </button>

                  {/* Page numbers */}
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 text-xs font-medium rounded-lg transition-all
                        ${currentPage === i + 1
                          ? "bg-[#32cddb] text-white shadow-sm shadow-[#32cddb]/20"
                          : "text-gray-500 border border-gray-200 hover:bg-gray-100"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  {/* Next */}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-all"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

          </div>
        </section>
      </div>

      {/* Add Modal */}
      {showModal && (
        <AddPropertyModal onClose={() => {
          setShowModal(false)
          fetchLandlordProperties()
        }} />
      )}

      {/* Edit Modal */}
      {editingProperty && (
        <AddPropertyModal
          property={editingProperty}
          onClose={() => {
            setEditingProperty(null)
            fetchLandlordProperties()
          }}
        />
      )}
    </section>
  )
}