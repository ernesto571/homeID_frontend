import { Twitter, Facebook, Github, Linkedin, Instagram } from "lucide-react"
import { exploreRentals, quickLinks } from "../constants"

export default function Footer (){

    return(
        <section>
            <div className="pt-[8rem] pb-[2rem] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-[85%] mx-auto gap-6">
                {/* first column */}
                <section className="flex flex-col justify-center items-center text-center">
                    <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1773312096/estate-logo_cmlseg.png" alt="logo" className="flex pb-2 justify-center items-center w-40 " />
                    <p className="py-3 text-gray-600">71–75 Shelton Street, Covent Garden, London WC2H 9JQ</p>
                    <a href="#" className="text-gray-600 font-bold ">support@homeID.com</a>
                    <p className="py-2 text-[#080e51] font-bold">+44 20 1234 5678</p>
                    <div className="flex gap-5 mt-2">
                        <Twitter className="text-[#ababab] fill-[#ababab]" />
                        <Facebook className="text-[#ababab] fill-[#ababab]"  />
                        <Github className="text-[#ababab] " />
                        <Linkedin className="text-[#ababab] fill-[#ababab]" />
                        <Instagram className="text-[#ababab]" />
                    </div>
                </section>

                {/* second column */}
                <section className="flex flex-col" >
                    <h1 className="flex justify-center text-center font-medium text-[1.5rem] text-[#080e51] pb-2" >Quick Links</h1>
                    {quickLinks.map((q) => (
                        <a className="text-gray-600 font-medium flex justify-center py-2 " href="#" key={q.id}>{q.title}</a>
                    ))}
                </section>

                {/* third column */}
                <section className="flex flex-col">
                    <h1 className="flex justify-center text-center font-medium text-[1.5rem] text-[#080e51] pb-2">Explore Rentals</h1>
                    {exploreRentals.map((r) => (
                        <a  className="text-gray-600 font-medium flex justify-center py-2 " href="#" key={r.id}>{r.title}</a>
                    ))}
                </section>

                {/* fourth column */}
                <section>
                    <h1 className="flex justify-center text-center font-medium text-[1.5rem] text-[#080e51] pb-2">Newsletter</h1>
                    <div>
                        <p className="text-gray-600 font-medium flex justify-center py-2 " >Subscribe to our newsletter</p>
                        <input type="text" placeholder="Your Email"  className="w-full pl-5 mt-3 bg-[#f8f8f8] py-3 focus:border-[1px] rounded-sm focus:border-[#e86822] focus:outline-none transition-colors "/>
                        <button  className="bg-[#e86822] mt-5 rounded-lg font-medium text-white py-2 w-full hover:cursor-pointer hover:bg-[#e86822]/90 ease-in-out duration-200">Subscribe</button>
                    </div>
                </section>
            </div>
        </section>
    )
}