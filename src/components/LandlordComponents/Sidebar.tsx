import { NavLink } from "react-router-dom"
import { useClerk } from "@clerk/clerk-react"
import { useLandlordAuthStore } from "../../store/landlord/LandlordAuthStore"

const sidebarLinks = [
  { id: 1, to: "/dashboard", label: "My Properties", end: true,
    icon: "https://res.cloudinary.com/dsljbxkfy/image/upload/v1773791438/property-svgrepo-com_1_f0lzpv.svg" },
  { id: 2, to: "/dashboard/enquiries", label: "Enquiries",
    icon: "https://res.cloudinary.com/dsljbxkfy/image/upload/v1773791187/dashboard-1-svgrepo-com_1_kwx5k3.svg" },
]

export default function Sidebar() {
  const { signOut } = useClerk()
  const profile = useLandlordAuthStore((s) => s.profile)

  return (
    <aside className="flex flex-col h-screen bg-white text-gray-800 px-1 md:px-4 py-6 border-r border-gray-100 shadow-sm">
      {/* Logo */}
      <div className="mb-8">
        <img
          src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1773790273/logo-1-2x_mvbdqi.png"
          alt="logo"
          className="md:w-[60%]"
        />
      </div>

      {/* Profile Card */}
      <div className="mx-2 mb-6 px-2 md:px-0 py-1 md:py-3 rounded-xl border border-[#94e5ec] bg-[#94e5ec]/10">
        <div className="flex items-center gap-3">
          <img src={profile?.profile_pic} alt="profile_pic" className="w-[60px] md:w-[30px] rounded-full justify-center flex items-center" />
          <div className="overflow-hidden hidden lg:flex flex-col">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {profile?.first_name} {profile?.last_name}
            </p>
            <p className="text-xs text-gray-400 truncate">{profile?.email}</p>
          </div>
        </div>
      </div>

      <p className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-gray-400">
        Manage
      </p>

      {/* Nav Links */}
      <nav className="flex flex-col gap-1 flex-1">
        {sidebarLinks.map(({ id, to, icon, label, end }) => (
          <NavLink
            key={id}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative group flex items-center gap-3 px-4 py-3 md:py-2 rounded-lg mt-5 font-medium transition-all duration-200
              ${isActive
                ? "bg-[#32cddb]/90 text-white"
                : "text-gray-700 hover:text-gray-800 hover:bg-[#94e5ec]/20"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={icon}
                  alt={label}
                  className={`w-[18px] transition-all ${isActive ? "brightness-[10]" : ""}`}
                />
                <span className="hidden lg:flex">{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                )}

                {/* ✅ Tooltip — only shows on small screens where label is hidden */}
                <span className="lg:hidden absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
                  <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="border-t border-[#94e5ec]/40 mx-2 mb-4" />

      {/* Sign Out */}
      <div className="relative group">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-[#32cddb] hover:bg-[#94e5ec]/20 transition-all duration-200 w-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          <p className="hidden md:flex">Sign Out</p>
        </button>

        {/* ✅ Tooltip for sign out — only on small screens */}
        <span className="lg:hidden absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
          <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45" />
          Sign Out
        </span>
      </div>

    </aside>
  )
}