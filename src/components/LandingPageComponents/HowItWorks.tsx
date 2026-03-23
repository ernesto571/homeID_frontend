import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(ref.current, {
      opacity: 0,
      yPercent: 20,
      duration: 1,
      ease: "expo.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 80%",
      },
    });
  }, { scope: ref });

  return (
    <section ref={ref} id="how-it-works" className="bg-[#f8f8f8]">
      <div className="flex flex-col-reverse gap-y-11 lg:grid lg:grid-cols-2 py-[5rem] md:py-[6rem] w-[96%] md:w-[90%] mx-auto">
        {/* cards */}
        <section className="flex flex-col gap-y-4">
          {/* card 1 */}
          <div className="bg-white rounded-lg">
            <div className="flex gap-5 md:gap-11 py-4 w-full md:w-[90%] mx-auto">
              <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1773330911/house-search-svgrepo-com_eueexr.svg" alt="house search" className="flex w-[100px] justify-center" />
              <span>
                <h1 className="text-[1.5rem] pt-2 font-medium text-gray-800">Find a rental home</h1>
                <p className="pt-3 text-[0.9rem] text-gray-500">Browse available rental properties and discover places that match your budget, location, and lifestyle.</p>
                <button className="bg-[#e86822] rounded-lg font-medium text-white py-3 px-6 mt-5 hover:cursor-pointer hover:bg-[#e86822]/90 ease-in-out duration-200">Browse Properties</button>
              </span>
            </div>
          </div>

          {/* card 2 */}
          <div className="bg-white rounded-lg">
            <div className="flex gap-5 md:gap-11 py-4 w-full md:w-[90%] mx-auto">
              <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1773330893/house-sold-sign-svgrepo-com_s8j4ll.svg" alt="house sold" className="flex w-[100px] justify-center" />
              <span>
                <h1 className="text-[1.5rem] pt-2 font-medium text-gray-800">List Your Property</h1>
                <p className="pt-3 text-[0.9rem] text-gray-500">Property owners can easily create listings, upload photos, and reach potential tenants.</p>
                <button className="bg-[#e86822] rounded-lg font-medium text-white py-3 px-6 mt-5 hover:cursor-pointer hover:bg-[#e86822]/90 ease-in-out duration-200">List Your Property</button>
              </span>
            </div>
          </div>

          {/* card 3 */}
          <div className="bg-white rounded-lg">
            <div className="flex gap-5 md:gap-11 py-4 w-full md:w-[90%] mx-auto">
              <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1773330725/chat-bubble-with-happy-face-on-mobile-phone-screen-svgrepo-com_qqgp56.svg" alt="contact" className="flex w-[100px] justify-center" />
              <span>
                <h1 className="text-[1.5rem] pt-2 font-medium text-gray-800">Connect With Landlords</h1>
                <p className="pt-3 text-[0.9rem] text-gray-500">Contact property owners directly to ask questions or arrange a viewing.</p>
              </span>
            </div>
          </div>
        </section>

        {/* right side */}
        <section>
          <div className="flex flex-col lg:ml-[8rem] lg:mt-[20%]">
            <h1 className="text-[2rem] md:text-[2.7rem] text-gray-800 font-medium">A Smarter Way to Find Rental Homes</h1>
            <p className="mt-4 text-[1.1rem] md:text-[1.3rem] text-gray-600">Our platform connects renters with property owners in one simple marketplace. Browse rental listings, view property details, and contact landlords easily.</p>
          </div>
        </section>
      </div>
    </section>
  );
}