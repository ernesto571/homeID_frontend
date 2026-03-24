import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import gsap from "gsap";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useRenterAuthStore } from "../../store/renter/RenterAuthStore";
import { Loader } from "lucide-react";

gsap.registerPlugin(SplitText);

export default function Hero() {
  const container = useRef(null);
  const { openSignUp } = useClerk();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const { loading } = useRenterAuthStore();

  const handleRenterBrowse = () => {
    if (!isSignedIn) {
      openSignUp({ fallbackRedirectUrl: "/listings" });
    } else {
      navigate("/listings");
    }
  };

  const handleLandlordBrowse = () => {
    if (isSignedIn) {
      navigate("/dashboard");
    } else {
      openSignUp({ fallbackRedirectUrl: "/dashboard" });
    }
  };

  useGSAP(() => {
    if (loading) return;

    const tl = gsap.timeline({ delay: 0.3 });

    // Safety check: Only split if SplitText is actually loaded
    if (typeof SplitText !== "undefined") {
      const heroSplit = new SplitText(".hero-title", { type: "chars, words" });
      const subtitleSplit = new SplitText(".hero-subtitle", { type: "lines" });

      tl.from(heroSplit.chars, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "back.out",
        stagger: 0.02, // Faster stagger so buttons show sooner
      })
      .from(subtitleSplit.lines, {
        opacity: 0,
        y: 10,
        duration: 0.8,
        stagger: 0.1,
      }, "-=0.4");
      
      // Cleanup
      tl.eventCallback("onComplete", () => {
         // Optionally revert here if you want to clean up the DOM after animation
      });
    } else {
      // Fallback if SplitText isn't available (Free version of GSAP)
      tl.from(".hero-title, .hero-subtitle", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.2
      });
    }

    // This part runs regardless of SplitText
    tl.from(".hero-button", {
      opacity: 0,
      y: 15,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
      // Using clearProps ensures the buttons' CSS (like hover states) 
      // works perfectly after the animation finishes
      clearProps: "opacity, transform" 
    }, "-=0.3");

  }, { dependencies: [loading], scope: container });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="size-10 animate-spin text-[#e86822]" />
      </div>
    );
  }

  return (
    <section ref={container} className="flex relative overflow-hidden">
      <div className="relative h-[90vh] w-full">
        <img
          src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1773311389/bg-homepage_nqbhoc.jpg"
          alt="homepage-background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex flex-col absolute inset-0 mt-[9rem] ml-5 md:ml-[5rem] text-[#080e51] w-[90%] md:w-[70%] lg:w-[40%]">
        <h1 className="hero-title text-[#080e51] text-[2.2rem] md:text-[3rem] font-[700] font-sans">
          Find and List Properties with Ease
        </h1>
        <p className="hero-subtitle mt-8 font-sans md:text-[1.3rem] font-semibold tracking-wide md:leading-10">
          A simple marketplace where buyers discover homes and sellers connect
          with the right buyers.
        </p>
        <div className="mt-[3rem] flex gap-9">
          <button
            onClick={handleRenterBrowse}
            // REMOVED transition-all to prevent GSAP conflict
            className="hero-button bg-[#e86822] rounded-lg md:text-[1.2rem] font-medium text-white py-2 md:py-4 px-5 md:px-10 hover:bg-[#e86822]/90 transition-colors cursor-pointer"
          >
            Browse Properties
          </button>
          <button 
            onClick={handleLandlordBrowse} 
            // REMOVED transition-all to prevent GSAP conflict
            className="hero-button bg-white rounded-lg md:text-[1.2rem] font-medium text-[#e86822] py-2 md:py-4 px-5 md:px-10 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            List Your Property
          </button>
        </div>
      </div>
    </section>
  );
}