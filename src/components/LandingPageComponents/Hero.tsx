import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import gsap from "gsap";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const { openSignUp } = useClerk();
  const { isSignedIn } = useUser();
  const navigate = useNavigate()
  
  const handleRenterBrowse = () => {
    if (!isSignedIn) {
      openSignUp({ fallbackRedirectUrl: "/listings" }); // ✅ not signed in — show modal
      // ✅ already signed in — go directly
    } else {
      navigate("/listings"); // ✅ already signed in — go directly
      
    }
  };

  const handleLandlordBrowse = () => {
    if (isSignedIn) {
      navigate("/dashboard"); // ✅ already signed in — go directly
    } else {
      openSignUp({ fallbackRedirectUrl: "/dashboard" }); // ✅ not signed in — show modal
    }
  };

  useGSAP(() => {
    const heroSplit = new SplitText("#hero-title", { type: "chars, words" });
    const subtitleSplit = new SplitText("#hero-subtitle", { type: "lines" });

    gsap.from(heroSplit.chars, {
      opacity: 0,
      yPercent: 50,
      duration: 0.8,
      delay: 1,
      ease: "expo.out",
      stagger: 0.06,
    });

    gsap.from(subtitleSplit.lines, {
      opacity: 0,
      duration: 1,
      ease: "expo.out",
      stagger: 0.06,
      delay: 3,
    });

    gsap.from("#hero-button", {
      opacity: 0,
      duration: 0.5,
      ease: "expo.out",
      delay: 1.7,
    });
  });

  return (
    <section className="flex relative">
      <img
        src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1773311389/bg-homepage_nqbhoc.jpg"
        alt="homepage-background"
        className="relative h-[90vh] md:h-[90vh] lg:h-[100%]"
      />
      <div className="flex flex-col absolute inset-0 mt-[9rem] ml-5 md:ml-[5rem] text-[#080e51] w-[90%] md:w-[70%] lg:w-[40%]">
        <h1
          id="hero-title"
          className="text-[#080e51] text-[2.2rem] md:text-[3rem] font-[700] font-sans"
        >
          Find and List Properties with Ease
        </h1>
        <p
          id="hero-subtitle"
          className="mt-8 font-sans md:text-[1.3rem] font-semibold tracking-wide md:leading-10"
        >
          A simple marketplace where buyers discover homes and sellers connect
          with the right buyers.
        </p>
        <div id="hero-button" className="mt-[3rem] flex gap-9">
          <button
            aria-label="Browse Properties"
            onClick={handleRenterBrowse}
            className="bg-[#e86822] rounded-lg md:text-[1.2rem] font-medium text-white py-2 md:py-4 px-5 md:px-10"
          >
            Browse Properties
          </button>
          <button onClick={handleLandlordBrowse} className="bg-white rounded-lg md:text-[1.2rem] font-medium text-[#e86822] py-2 md:py-4 px-5 md:px-10">
            List Your Property
          </button>
        </div>
      </div>
    </section>
  );
}