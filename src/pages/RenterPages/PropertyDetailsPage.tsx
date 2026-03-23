import { useParams } from "react-router-dom"
import { useListingsStore } from "../../store/renter/ListingsStore"
import { useEffect } from "react"
import Topbar from "../../components/RenterComponents/Topbar"
import { Clock, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import Footer from "../../components/Footer"
import EnquiryForm from "../../components/RenterComponents/EnquiryForm"

export default function PropertyDetailsPage(){
    const {id} = useParams()
    const {allListings, fetchListings} = useListingsStore()
    
    useEffect(()=> {
        fetchListings()
    }, [fetchListings])

    const property = allListings.find((p) => p.id === Number(id));
    const yearsAgo = 2026 - Number(property?.year_built)

    const info = [
        {icon:"https://res.cloudinary.com/dsljbxkfy/image/upload/v1774117754/house-svgrepo-com_co2wtt.svg", title:"ID", value:property?.id},
        {icon:"https://res.cloudinary.com/dsljbxkfy/image/upload/v1774081306/bedroom-hotel-svgrepo-com_wj7ymy.svg", title:"BEDROOMS", value:property?.bedrooms },
        {icon:"https://res.cloudinary.com/dsljbxkfy/image/upload/v1774117753/shower-head-svgrepo-com_1_qmedlu.svg", title:"BATHROOMS", value:property?.bathrooms },
        {icon:"https://res.cloudinary.com/dsljbxkfy/image/upload/v1774117753/garage-svgrepo-com_pdzhrw.svg", title:"GARAGES", value:property?.garages },
        {icon:"https://res.cloudinary.com/dsljbxkfy/image/upload/v1774081530/area-svgrepo-com_1_xgeqhg.svg", title:"SIZE", value:`${property?.size_sqft} SqFt` },
        {icon:"https://res.cloudinary.com/dsljbxkfy/image/upload/v1774117753/area-svgrepo-com_2_xieuke.svg", title:"LAND SIZE", value:`${property?.land_size_sqft} SqFt`  },
        {icon:"https://res.cloudinary.com/dsljbxkfy/image/upload/v1774119865/crane-tool-svgrepo-com_xsw1rl.svg", title:"YEAR BUILT", value:property?.year_built}
    ]

    const address = [
        {title:"Country", value:property?.country },
        {title:"City/Town", value:property?.city },
        {title:"Province/State", value:property?.state },
        {title:"Neighbourhood", value:property?.neighbourhood }
    ]

    const details = [
        {title:"Property ID", value:property?.id  },
        {title:"Price", value:`£${property?.price} / month`  },
        {title:"Property Status", value:"For Rent"  },
        {title:"Rooms", value:property?.rooms  },
        {title:"Bedrooms", value:property?.bedrooms   },
        {title:"Bathrooms", value:property?.bathrooms   },
        {title:"Garages", value:property?.garages   },
        {title:"Year Built", value:property?.year_built  },
        {title:"Size", value:`${property?.size_sqft} SqFt` },
        {title:"Land Size", value:`${property?.land_size_sqft} SqFt`  }
    ]

    const handleGoogleMaps = () => {
        const query = encodeURIComponent(
            `${property?.address}, ${property?.neighbourhood}, ${property?.city}, ${property?.country}`
        )
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank")
    }

    const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
        `${property?.address}, ${property?.neighbourhood}, ${property?.city}, ${property?.country}`
    )}&output=embed`
    
    if (!property) {
        return (
        <div className="min-h-screen grid place-items-center">
            Property not found
        </div>
        );
    }

    return(
        <section className="pt-[4rem]">
            <Topbar />

            <section className="w-[95%] md:w-[85%] mx-auto mt-[3rem]">
                <span className="flex gap-3 md:gap-5 items-center text-gray-500">
                    <p className="text-sm top-2 left-2 md:text-xs font-semibold bg-[#65b110] text-white py-2 px-2 md:px-4 rounded-md
                     tracking-wide">FOR RENT</p>
                    <p className="flex text-sm md:text-base gap-1 md:gap-2 items-center text-center"><Clock className="text-gray-400" /> {yearsAgo} years ago</p>
                    <span className="flex gap-1 md:gap-2 text-sm md:text-base items-center text-center">
                        <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1774109067/eye-svgrepo-com_klicjn.svg" alt="eye icon" className="flex w-[25px] justify-center" />
                        <p >2435 views</p>
                    </span>
                </span>
                <h2 className="my-2 text-[1.8rem] md:text-[2rem] font-medium text-[#181e65]">{property.title}</h2>
                <span className="flex items-center gap-2 text-gray-500">
                    <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1774111081/location-pin-svgrepo-com_2_nnikf2.svg" className="w-[20px] md:w-[25px]" alt="pin" />
                    <p className="md:text-[1.1rem] tracking-wide">{property.address}, {property.neighbourhood}</p>
                </span>
                {/* pic */}
                <div className="grid grid-cols-2 md:grid-cols-4 mt-10 gap-3 h-[500px]">
                    {/* Main big image */}
                    <img  src={property.images[0].url}  className="col-span-2 rounded-md w-full h-full hover:brightness-75 transition-transform ease-in-out  object-cover"  alt="pic-1" />
                    {/* Middle column */}
                    <div className="flex flex-col col-span-1 gap-3 h-full">
                        <img src={property.images[1].url} alt="pic-2"  className="w-full flex-1 hover:brightness-75 transition-transform ease-in-out  object-cover rounded-md"/>
                        <img src={property.images[2].url} alt="pic-3" className="w-full flex-1 hover:brightness-75 transition-transform ease-in-out  object-cover rounded-md"/>
                    </div>

                    {/* Right column */}
                    <div className="flex flex-col col-span-1 gap-3 h-full">
                        <img src={property.images[3].url} alt="pic-4" className="w-full flex-1 hover:brightness-75 transition-transform ease-in-out  object-cover rounded-md"/>
                        <img src={property.images[4].url} alt="pic-5" className="w-full flex-1 hover:brightness-75 transition-transform ease-in-out  object-cover rounded-md"/>
                    </div>
                </div>
            </section>

            <section className="mt-14 pb-10 bg-[#f2f2f2]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-6 lg:gap-x-12 w-[90%] md:w-[85%] mx-auto pt-14">
                    {/* left section */}
                    <section className="flex flex-col col-span-2 gap-y-3">
                        {/* description */}
                        <div className=" bg-white rounded-sm">
                            <div className="w-[84%] md:max-w-[92%] mx-auto py-6">
                                <h4 className="text-[1.5rem] font-medium tracking-wide text-[#101549]">Description</h4>
                                <p className="pt-3 text-[0.9rem] md:text-base text-gray-600">{property.description}</p>
                            </div>
                        </div>

                        {/* overview */}
                        <div className=" bg-white rounded-sm">
                            <div className="w-[84%] md:max-w-[92%] mx-auto py-6">
                                <h4 className="text-[1.5rem] font-medium tracking-wide text-[#101549]">Overview</h4>
                                <div className="pt-3 text-gray-600 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {info.map((i) => (
                                        <div key={i.title} className="flex items-center gap-x-3 gap-y-5">
                                            <span className="bg-white rounded-md shadow-md p-3">
                                                <img src={i.icon} alt="icon" className="w-[35px]" />
                                            </span>
                                            <div>
                                                <p className="text-sm">{i.title}</p>
                                                <p className="font-bold text-[#101549] pt-2">{i.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className=" bg-white rounded-sm">
                            <div className="w-[84%] md:max-w-[92%] mx-auto py-6">
                                <span className="flex flex-col md:flex-row justify-between">
                                    <h4 className="text-[1.5rem] font-medium tracking-wide text-[#101549]">Address</h4>
                                    <button className="bg-[#e86822] rounded-lg font-medium text-white py-3 px-6 mt-3 md:mt-5 hover:cursor-pointer hover:bg-[#e86822]/90 ease-in-out duration-200" onClick={handleGoogleMaps}>
                                        <span className="flex gap-2">
                                            <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1774127700/map-location-pin-svgrepo-com_zx5pxd.svg" alt="icon" className="w-[25px]" />
                                            <p>Open On Google Maps</p>
                                        </span>
                                    </button>
                                </span>
                                <span className="flex gap-7 mt-5 text-[0.9rem]">
                                    <strong className="text-[#101549]">Address</strong>
                                    <p className="text-gray-600">{property.address}</p>
                                </span>
                                <div className="pt-4 text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 text-[0.9rem]">
                                    {address.map((a) => (
                                        <div key={a.title} className="flex gap-7">
                                            <strong className="text-[#101549]">{a.title}</strong>
                                            <p className="text-gray-600">{a.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className=" bg-white rounded-sm">
                            <div className="w-[84%] md:max-w-[92%] mx-auto py-6">
                                <h4 className="text-[1.5rem] font-medium tracking-wide text-[#101549]">Details</h4>
                                <div className="pt-5 text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {details.map((d) => (
                                        <div key={d.title} className="w-[70%]">
                                            <span className="flex justify-between text-[0.9rem]">
                                                <strong className=" text-[#101549]">{d.title}</strong>
                                                <p className="text-gray-600">{d.value}</p>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className=" bg-white rounded-sm">
                            <div className="w-[84%] md:max-w-[92%] mx-auto py-6">
                                <h4 className="text-[1.5rem] font-medium tracking-wide text-[#101549]">Features</h4>
                                <div className="pt-5 text-gray-600 grid grid-cols-2 md:grid-cols-3 gap-5">
                                    {property.amenities.map((a) => (
                                        <div key={a} className="flex gap-2 items-center">
                                            <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1774130055/check-svgrepo-com_yrcg01.svg" alt="icon" className="w-[22px]" />
                                            <p>{a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* location */}
                        <div className=" bg-white rounded-sm">
                            <div className="max-w-[92%] mx-auto py-6">
                                <h4 className="text-[1.5rem] font-medium tracking-wide text-[#101549]">Location</h4>
                                <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm mt-6">
                                    <iframe
                                        src={mapSrc}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    <section className=" lg:col-span-1 lg:sticky top-6 h-fit" >
                        {/* profile */}
                        <div className=" bg-white rounded-sm w-full">
                            <div className=" flex flex-col justify-center items-center py-8">
                                <img src={property?.landlord_profile_pic} alt="Prof pic" className="w-[160px] rounded-full flex justify-center" />

                                <span className="my-3 flex flex-col gap-2 justify-center text-center text-gray-600">
                                    <p className="text-[1.3rem] font-medium tracking-wide text-[#101549]">{property?.landlord_first_name} {property?.landlord_last_name}</p>
                                    <p>Sales Executive</p>
                                    <span className="flex ">
                                        <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1774172485/star-svgrepo-com_1_ao3bib.svg" alt="star icon" className="w-[20px]"/>
                                        <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1774172485/star-svgrepo-com_1_ao3bib.svg" alt="star icon" className="w-[20px]"/>
                                        <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1774172485/star-svgrepo-com_1_ao3bib.svg" alt="star icon" className="w-[20px]"/>
                                        <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1774172485/star-svgrepo-com_1_ao3bib.svg" alt="star icon" className="w-[20px]"/>
                                        <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1774172485/star-svgrepo-com_1_ao3bib.svg" alt="star icon" className="w-[20px]"/>
                                        <p>(10 reviews)</p>
                                    </span>
                                    <p className="font-medium">{property?.landlord_email}</p>
                                    <p className="font-semibold text-[#101549]">+234 802 741 5876</p>
                                </span>

                                {/* social links */}
                                <span className="w-[80%] gap-5 py-3 mt-2 border-t border-b border-gray-200 mx-auto flex justify-center items-center">
                                    <button className="rounded-full p-2 border border-gray-200 bg-white hover:bg-[#e86822] hover:border-none transition-all group">
                                        <Facebook className="w-[20px] h-[20px] text-[#696969] fill-[#696969] group-hover:fill-white group-hover:text-white transition-all" />
                                    </button>                                    
                                    <button className="rounded-full p-2 border border-gray-200 bg-white hover:bg-[#e86822] hover:border-none transition-all group">
                                        <Twitter className="w-[20px] h-[20px] text-[#696969] fill-[#696969] group-hover:fill-white group-hover:text-white transition-all" />
                                    </button> 
                                    <button className="rounded-full p-2 border border-gray-200 bg-white hover:bg-[#e86822] hover:border-none transition-all group">
                                        <Linkedin className="w-[20px] h-[20px] text-[#696969] fill-[#696969] group-hover:fill-white group-hover:text-white transition-all" />
                                    </button> 
                                    <button className="rounded-full p-2 border border-gray-200 bg-white hover:bg-[#e86822] hover:border-none transition-all group">
                                        <Instagram className="w-[20px] h-[20px] text-[#696969]  group-hover:text-white transition-all" />
                                    </button> 
                                </span>

                            </div>
                            <div className="w-[90%] md:w-[80%] mx-auto pb-8">
                             <EnquiryForm property={property}/>
                            </div>
                        </div>

                        
                    </section>
                </div>
                
            </section>
            <Footer />
        </section>
    )
}