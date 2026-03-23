import { Link } from "react-router-dom";
import { nonAuthNavLinks } from "../constants";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { useLandlordAuthStore } from "../store/landlord/LandlordAuthStore";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const profile = useLandlordAuthStore((s) => s.profile);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-30 transition-all duration-300
          ${scrolled ? "backdrop-blur shadow-lg bg-white" : "bg-transparent"}
        `}
      >
        <section className="flex justify-between w-[98%] md:w-[95%] mx-auto items-center py-3">
          {/* Logo */}
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1773312096/estate-logo_cmlseg.png"
              alt="logo"
              className="w-[7rem] md:w-40"
            />
          </Link>

          {/* Links — Bug 1 fix: !SignedIn → !isSignedIn */}
          {!isSignedIn ? (
            <span className="hidden lg:flex gap-9 justify-center text-[#080e51] font-300 font-primary tracking-tight">
              {nonAuthNavLinks.map((link) => {
                const isActive = location.hash === link.id;
                return (
                  <div key={link.id}>
                    <a href={link.id} className={`nav-link ${isActive ? "active" : ""}`}>
                      {link.title}
                    </a>
                  </div>
                );
              })}
            </span>
          ) : null}

          <div className="flex gap-2">
            {/* Bug 2 fix: removed invalid object literal wrapping <SignInButton /> */}
            {isSignedIn ? (
              profile?.role === "renter" ? (
                <UserButton />
              ) : (
                <UserButton />
              )
            ) : (
              <SignInButton mode="modal"/>
            )}

            {/* Hamburger */}
            {!isSignedIn ? (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden hover:bg-[#e86822] hover:text-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                aria-label="Toggle menu"
              >
                <Menu size={24} />
              </button>
            ) : null}
          </div>
        </section>
      </nav>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}