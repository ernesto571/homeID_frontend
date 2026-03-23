import { useEffect, useState } from "react"
import { UserButton } from "@clerk/clerk-react"
import Sidebar from "../../components/LandlordComponents/Sidebar"
import { useLandlordAuthStore } from "../../store/landlord/LandlordAuthStore"
import { Bell, Mail, Phone, MessageSquare, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useEnquiryStore } from "../../store/EnquiryStore"

export default function Enquiries() {
  const profile = useLandlordAuthStore((s) => s.profile)
  const { enquiries, fetchLandlordEnquiries, markAsRead, markAsReplied, isLoading } = useEnquiryStore()
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null)
  const [replyText, setReplyText] = useState("")
  const [showDetail, setShowDetail] = useState(false) // ✅ mobile view toggle
  const navigate = useNavigate()

  useEffect(() => {
    fetchLandlordEnquiries()
  }, [])

  const unreadCount = enquiries.filter(e => e.status === "unread").length

  const handleOpen = async (enquiry: any) => {
    setSelectedEnquiry(enquiry)
    setShowDetail(true) // ✅ show detail on mobile
    if (enquiry.status === "unread") {
      await markAsRead(enquiry.id)
    }
  }

  const handleBack = () => {
    setShowDetail(false)
    setSelectedEnquiry(null)
  }

  const handleReply = async () => {
    if (!selectedEnquiry || !replyText.trim()) return
    window.location.href = `mailto:${selectedEnquiry.email_address}?subject=Re: Enquiry for ${selectedEnquiry.property_title}&body=${encodeURIComponent(replyText)}`
    await markAsReplied(selectedEnquiry.id)
    setReplyText("")
  }

  const statusColor = (status: string) => {
    if (status === "unread") return "bg-red-100 text-red-500"
    if (status === "read") return "bg-yellow-100 text-yellow-600"
    return "bg-green-100 text-green-600"
  }

  return (
    <section className="h-screen overflow-hidden">
      <div className="flex h-full">

        {/* Sidebar — hidden on mobile */}
        <section className="block w-[70px] lg:w-[16.67%] h-screen sticky top-0 shrink-0">
          <Sidebar />
        </section>

        <section className="flex-1 bg-[#f8f8f8] h-screen overflow-y-auto flex flex-col">

          {/* Topbar */}
          <div className="sticky top-0 z-10 flex border-b border-gray-200 py-2 bg-white">
            <span className="flex justify-between items-center w-[95%] md:w-[90%] mx-auto">
              <input type="text" className="border border-gray-200 rounded-md py-1 px-3 text-sm w-32 md:w-auto" placeholder="Search..." />
              <div className="flex gap-2 md:gap-3 border-l border-gray-200 pl-3 items-center">
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
                <p className="text-gray-700 text-sm hidden sm:block">{profile?.first_name} {profile?.last_name}</p>
              </div>
            </span>
          </div>

          {/* Content */}
          <div className="w-[95%] md:w-[90%] mx-auto mt-6 md:mt-8 flex-1">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Enquiries</h1>
                <p className="text-sm text-gray-400 mt-1">
                  {unreadCount > 0 ? `${unreadCount} unread enquir${unreadCount === 1 ? "y" : "ies"}` : "All caught up!"}
                </p>
              </div>
            </div>

            {/* ✅ Mobile: show list OR detail, not both */}
            {/* ✅ Desktop: show both side by side */}
            <div className="h-[78vh] md:h-[75vh]">

              {/* MOBILE — List View */}
              <div className={`h-full md:hidden ${showDetail ? "hidden" : "block"}`}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto h-full">
                  {isLoading ? (
                    [...Array(4)].map((_, i) => (
                      <div key={i} className="p-4 border-b border-gray-50 animate-pulse">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-24 bg-gray-100 rounded-full" />
                            <div className="h-2 w-32 bg-gray-100 rounded-full" />
                            <div className="h-2 w-20 bg-gray-100 rounded-full" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : enquiries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-12 px-4">
                      <div className="w-16 h-16 rounded-2xl bg-[#94e5ec]/20 flex items-center justify-center mb-4">
                        <MessageSquare size={28} className="text-[#32cddb]" />
                      </div>
                      <p className="text-gray-600 font-semibold text-sm">No enquiries yet</p>
                      <p className="text-gray-400 text-xs text-center mt-1">Enquiries from renters will appear here</p>
                    </div>
                  ) : (
                    enquiries.map((enquiry) => (
                      <div
                        key={enquiry.id}
                        onClick={() => handleOpen(enquiry)}
                        className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50
                          ${enquiry.status === "unread" ? "bg-blue-50/50" : ""}`}
                      >
                        <div className="flex gap-3 items-start">
                          <div className="w-10 h-10 rounded-full bg-[#32cddb] flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {enquiry.full_name?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className={`text-sm font-semibold truncate ${enquiry.status === "unread" ? "text-gray-900" : "text-gray-600"}`}>
                                {enquiry.full_name}
                              </p>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-1 ${statusColor(enquiry.status)}`}>
                                {enquiry.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 truncate mt-0.5">{enquiry.message}</p>
                            <p className="text-[10px] text-gray-300 mt-1">
                              {new Date(enquiry.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* MOBILE — Detail View */}
              <div className={`h-full md:hidden ${showDetail ? "block" : "hidden"}`}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-full">
                  {/* ✅ Back button on mobile */}
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 text-sm text-gray-500 hover:text-gray-800 transition-all"
                  >
                    <ArrowLeft size={16} />
                    Back to enquiries
                  </button>
                  {selectedEnquiry && (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800">{selectedEnquiry.full_name}</h3>
                            <p className="text-xs text-[#32cddb] mt-0.5">{selectedEnquiry.property_title}</p>
                          </div>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(selectedEnquiry.status)}`}>
                            {selectedEnquiry.status}
                          </span>
                        </div>
                      </div>
                      <div className="px-4 py-3 border-b border-gray-50 flex flex-col gap-2">
                        <span className="flex items-center gap-2 text-xs text-gray-500">
                          <Mail size={13} className="text-[#32cddb]" />
                          {selectedEnquiry.email_address}
                        </span>
                        <span className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone size={13} className="text-[#32cddb]" />
                          {selectedEnquiry.phone_number}
                        </span>
                      </div>
                      <div className="px-4 py-4 flex-1 overflow-y-auto">
                        <p className="text-xs text-gray-400 mb-2">Message</p>
                        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
                          {selectedEnquiry.message}
                        </div>
                        <p className="text-xs text-gray-300 mt-3">
                          Received {new Date(selectedEnquiry.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <div className="px-4 py-4 border-t border-gray-100">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={3}
                          placeholder="Type your reply..."
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#32cddb]/40 focus:border-[#32cddb] resize-none transition-all"
                        />
                        <button
                          onClick={handleReply}
                          disabled={!replyText.trim()}
                          className="mt-2 w-full py-2.5 bg-[#32cddb] text-white text-sm font-semibold rounded-xl hover:bg-[#32cddb]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#32cddb]/20"
                        >
                          Send Reply via Email
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* DESKTOP — Side by side */}
              <div className="hidden md:grid grid-cols-3 gap-4 h-full">

                {/* List */}
                <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto">
                  {isLoading ? (
                    [...Array(4)].map((_, i) => (
                      <div key={i} className="p-4 border-b border-gray-50 animate-pulse">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-24 bg-gray-100 rounded-full" />
                            <div className="h-2 w-32 bg-gray-100 rounded-full" />
                            <div className="h-2 w-20 bg-gray-100 rounded-full" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : enquiries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-12 px-4">
                      <div className="w-16 h-16 rounded-2xl bg-[#94e5ec]/20 flex items-center justify-center mb-4">
                        <MessageSquare size={28} className="text-[#32cddb]" />
                      </div>
                      <p className="text-gray-600 font-semibold text-sm">No enquiries yet</p>
                      <p className="text-gray-400 text-xs text-center mt-1">Enquiries from renters will appear here</p>
                    </div>
                  ) : (
                    enquiries.map((enquiry) => (
                      <div
                        key={enquiry.id}
                        onClick={() => handleOpen(enquiry)}
                        className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50
                          ${selectedEnquiry?.id === enquiry.id ? "bg-[#94e5ec]/10 border-l-2 border-l-[#32cddb]" : ""}
                          ${enquiry.status === "unread" ? "bg-blue-50/50" : ""}`}
                      >
                        <div className="flex gap-3 items-start">
                          <div className="w-10 h-10 rounded-full bg-[#32cddb] flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {enquiry.full_name?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className={`text-sm font-semibold truncate ${enquiry.status === "unread" ? "text-gray-900" : "text-gray-600"}`}>
                                {enquiry.full_name}
                              </p>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-1 ${statusColor(enquiry.status)}`}>
                                {enquiry.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 truncate mt-0.5">{enquiry.message}</p>
                            <p className="text-[10px] text-gray-300 mt-1">
                              {new Date(enquiry.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Detail */}
                <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                  {!selectedEnquiry ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-16 h-16 rounded-2xl bg-[#94e5ec]/20 flex items-center justify-center mb-4">
                        <MessageSquare size={28} className="text-[#32cddb]" />
                      </div>
                      <p className="text-gray-500 text-sm">Select an enquiry to view details</p>
                    </div>
                  ) : (
                    <>
                      <div className="px-6 py-4 border-b border-gray-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800">{selectedEnquiry.full_name}</h3>
                            <p className="text-xs text-[#32cddb] mt-0.5">{selectedEnquiry.property_title}</p>
                          </div>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(selectedEnquiry.status)}`}>
                            {selectedEnquiry.status}
                          </span>
                        </div>
                      </div>
                      <div className="px-6 py-3 border-b border-gray-50 flex gap-6">
                        <span className="flex items-center gap-2 text-xs text-gray-500">
                          <Mail size={13} className="text-[#32cddb]" />
                          {selectedEnquiry.email_address}
                        </span>
                        <span className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone size={13} className="text-[#32cddb]" />
                          {selectedEnquiry.phone_number}
                        </span>
                      </div>
                      <div className="px-6 py-4 flex-1 overflow-y-auto">
                        <p className="text-xs text-gray-400 mb-2">Message</p>
                        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
                          {selectedEnquiry.message}
                        </div>
                        <p className="text-xs text-gray-300 mt-3">
                          Received {new Date(selectedEnquiry.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <div className="px-6 py-4 border-t border-gray-100">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={3}
                          placeholder="Type your reply..."
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#32cddb]/40 focus:border-[#32cddb] resize-none transition-all"
                        />
                        <button
                          onClick={handleReply}
                          disabled={!replyText.trim()}
                          className="mt-2 w-full py-2.5 bg-[#32cddb] text-white text-sm font-semibold rounded-xl hover:bg-[#32cddb]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#32cddb]/20"
                        >
                          Send Reply via Email
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </section>
  )
}