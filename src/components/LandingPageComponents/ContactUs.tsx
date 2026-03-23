import ContactForm from "./ContactForm";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactUs(){

    useGSAP(() => {
        gsap.from("#contact-us", {
        opacity: 0,
        yPercent: 20,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
            trigger: "#contact-us",
            start: "top 70%",
        },
        });
    }, []);

    return (
        <section id="contact-us">
            <div className="grid grid-cols-1 lg:grid-cols-5 w-[96%] md:w-[85%] gap-y-8 mx-auto pt-[6rem] ">
                {/* left side */}
                <section className=" col-span-2 lg:w-[80%]">
                    <h3 className="text-[1.5rem] font-medium text-[#080e51] tracking-wide">4.9/5.0</h3>
                    <div className="my-2 flex gap-2">
                        <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1773344351/star-svgrepo-com_gupazs.svg" alt="star" className="h-[22px]"/>
                        <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1773344351/star-svgrepo-com_gupazs.svg" alt="star" className="h-[22px]"/>
                        <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1773344351/star-svgrepo-com_gupazs.svg" alt="star" className="h-[22px]"/>
                        <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1773344351/star-svgrepo-com_gupazs.svg" alt="star" className="h-[22px]"/>
                        <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1773344351/star-svgrepo-com_gupazs.svg" alt="star" className="h-[22px]"/>
                    </div>

                    <p className="text-gray-500 text-[1.1rem] ">by 700+ customers for 3200+ clients</p>

                    <h1 className="text-[2rem] md:text-[3rem] font-medium text-[#080e51] pt-6 leading-[3.5rem]">We’d love to hear from you</h1>
                </section>
                {/* right side */}
                <section className="col-span-3 ">
                    <div className="flex flex-col md:flex-row justify-between w-[85%] gap-y-6">
                        <span className="flex gap-3 text-[#080e51] items-center">
                            <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1773347069/phone-call-phone-svgrepo-com_2_zzix2n.svg" alt="phone" className="h-[50px] flex justify-center items-center"/>
                            <div>
                                <p className="text-[1.1rem] ">Hotline!</p>
                                <p className="text-[1.3rem] font-medium">+234 802 7415 876</p>

                            </div>
                        </span>

                        <span className="flex gap-3 text-[#080e51] items-center">
                            <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1773347050/mail-svgrepo-com_ocryol.svg" alt="phone"  className="h-[50px] flex justify-center items-center"/>
                            <div>
                                <p className="text-[1.1rem]">Email</p>
                                <p className="text-[1.3rem] font-medium ">homeId@gmail.come</p>
                            </div>
                        </span>
                    </div>

                    <ContactForm />
                </section>
            </div>
        </section>
    )
}