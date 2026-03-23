import { useEffect, useState } from "react"
import { useLandlordPropertyStore } from "../../store/landlord/LandlordPrpertyStore"
import toast from "react-hot-toast"

const AMENITIES = [
  "Swimming Pool", "Gym", "Parking", "WiFi", "Security",
  "Generator", "Garden", "Balcony", "Elevator", "Air Conditioning",
  "Furnished", "CCTV", "Borehole", "Solar Power", "Laundry"
]

const STEPS = ["Details", "Address", "Amenities", "Images"]

interface ImageItem {
  id: number
  url: string
}

interface Props {
  onClose: () => void
  property?: any
}

export default function AddPropertyModal({ onClose, property }: Props) {
  const [step, setStep] = useState(1)
  const [propertyId, setPropertyId] = useState<number | null>(null)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<ImageItem[]>([]) // ✅ correct type
  const [deletingImageUrl, setDeletingImageUrl] = useState<string | null>(null)

  const { createProperty, updateProperty, addPropertyAddress, addPropertyAmenities, addPropertyImages, deletePropertyImage, isLoading, formData, setFormData, resetFormData } = useLandlordPropertyStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ [e.target.name]: e.target.value })
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const handleDeleteExistingImage = async (img: ImageItem) => {
    setDeletingImageUrl(img.url)
    const ok = await deletePropertyImage(img.id, img.url)
    if (ok) {
      setExistingImages(prev => prev.filter(i => i.url !== img.url))
    }
    setDeletingImageUrl(null)
  }

  const handleStep1 = async () => {
    if (property) {
      const ok = await updateProperty(property.id, formData)
      if (!ok) return
      setPropertyId(property.id)
      setStep(2)
    } else {
      const id = await createProperty(formData)
      if (!id) return
      setPropertyId(id)
      setStep(2)
    }
  }

  const handleStep2 = async () => {
    const id = property ? property.id : propertyId
    if (!id) return
    const ok = await addPropertyAddress(id, formData)
    if (!ok) return
    setStep(3)
  }

  const handleStep3 = async () => {
    const id = property ? property.id : propertyId
    if (!id) return
    const ok = await addPropertyAmenities(id, selectedAmenities)
    if (!ok) return
    setStep(4)
  }

  const handleStep4 = async () => {
    const id = property ? property.id : propertyId
    if (!id) return
    if (images.length > 0) {
      const ok = await addPropertyImages(id, images)
      if (!ok) return
    }
    toast.success(property ? "Property updated!" : "Property listed successfully!")
    resetFormData()
    onClose()
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#32cddb]/40 focus:border-[#32cddb] transition-all"
  const labelClass = "text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block"

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        description: property.description,
        price: property.price,
        category: property.category,
        numOfBedrooms: property.bedrooms,
        numOfBathrooms: property.bathrooms,
        numOfGarages: property.garages,
        size_sqft: property.size_sqft,
        land_size_sqft: property.land_size_sqft,
        year_built: property.year_built,
        numOfRooms: property.rooms,
        address: property.address,
        neighbourhood: property.neighbourhood,
        city: property.city,
        state: property.state,
        country: property.country,
      })
      setSelectedAmenities(property.amenities || [])
      // ✅ correctly seed existing images as { id, url }[]
      setExistingImages(
        property.images?.filter((img: any) => img && img.url) || []
      )
    }
  }, [property])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              {property ? "Edit Listing" : "Add New Listing"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-light">✕</button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            {STEPS.map((label, i) => {
              const stepNum = i + 1
              const isActive = step === stepNum
              const isDone = step > stepNum
              return (
                <div key={label} className="flex items-center gap-2 flex-1">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
                      ${isDone ? "bg-[#32cddb] text-white" : isActive ? "bg-[#32cddb] text-white ring-4 ring-[#32cddb]/20" : "bg-gray-100 text-gray-400"}`}>
                      {isDone ? "✓" : stepNum}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${isActive ? "text-[#32cddb]" : isDone ? "text-gray-500" : "text-gray-300"}`}>
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 rounded-full ${isDone ? "bg-[#32cddb]" : "bg-gray-100"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">

          {/* Step 1 - Details */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Title</label>
                <input name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder ="e.g. Modern 3 Bedroom Apartment" />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea name="description" value={formData.description} required onChange={handleChange} className={`${inputClass} resize-none h-20`} placeholder="Describe the property..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Price (£)</label>
                  <input name="price" type="number" value={formData.price} onChange={handleChange} className={inputClass} placeholder="0" required/>
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                    <option value="rent">Rent</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Bedrooms</label>
                  <input name="numOfBedrooms" type="number" required value={formData.numOfBedrooms} onChange={handleChange} className={inputClass} placeholder="0" />
                </div>
                <div>
                  <label className={labelClass}>Bathrooms</label>
                  <input name="numOfBathrooms" type="number" required value={formData.numOfBathrooms} onChange={handleChange} className={inputClass} placeholder="0" />
                </div>
                <div>
                  <label className={labelClass}>Garages</label>
                  <input name="numOfGarages" type="number" required value={formData.numOfGarages} onChange={handleChange} className={inputClass} placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Rooms</label>
                  <input name="numOfRooms" type="number" required value={formData.numOfRooms} onChange={handleChange} className={inputClass} placeholder="0" />
                </div>
                <div>
                  <label className={labelClass}>Size (sqft)</label>
                  <input name="size_sqft" type="number" required value={formData.size_sqft} onChange={handleChange} className={inputClass} placeholder="0" />
                </div>
                <div>
                  <label className={labelClass}>Land Size (sqft)</label>
                  <input name="land_size_sqft" type="number"  required value={formData.land_size_sqft} onChange={handleChange} className={inputClass} placeholder="0" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Year Built</label>
                <input name="year_built" type="number" value={formData.year_built} required onChange={handleChange} className={inputClass} placeholder="e.g. 2020" />
              </div>
            </div>
          )}

          {/* Step 2 - Address */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Street Address</label>
                <input name="address" value={formData.address} onChange={handleChange} required className={inputClass} placeholder="e.g. 14 Baker Street" />
              </div>
              <div>
                <label className={labelClass}>Neighbourhood</label>
                <input name="neighbourhood" value={formData.neighbourhood} required onChange={handleChange} className={inputClass} placeholder="e.g. Marylebone" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>City</label>
                  <input name="city" value={formData.city} required onChange={handleChange} className={inputClass} placeholder="e.g. London" />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input name="state" value={formData.state} required onChange={handleChange} className={inputClass} placeholder="e.g. Greater London" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input name="country" value={formData.country} required onChange={handleChange} className={inputClass} placeholder="e.g. United Kingdom" />
              </div>
            </div>
          )}

          {/* Step 3 - Amenities */}
          {step === 3 && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Select all amenities available at this property</p>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((amenity) => {
                  const selected = selectedAmenities.includes(amenity)
                  return (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
                        ${selected
                          ? "bg-[#32cddb] text-white border-[#32cddb] shadow-sm shadow-[#32cddb]/30"
                          : "bg-white text-gray-500 border-gray-200 hover:border-[#32cddb] hover:text-[#32cddb]"
                        }`}
                    >
                      {amenity}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 4 - Images */}
          {step === 4 && (
            <div className="flex flex-col gap-4">

              {/* Upload Area */}
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#94e5ec] rounded-xl cursor-pointer bg-[#94e5ec]/5 hover:bg-[#94e5ec]/10 transition-all">
                <span className="text-2xl mb-1">📁</span>
                <span className="text-sm font-medium text-gray-500">Click to upload images</span>
                <span className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP — up to 10 files</span>
                <input type="file" multiple accept="image/*" required onChange={handleImageChange} className="hidden" />
              </label>

              {/* New image count + clear */}
              {images.length > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">{images.length} new image{images.length > 1 ? "s" : ""} selected</p>
                  <button
                    onClick={() => { setImages([]); setPreviews([]) }}
                    className="text-xs text-red-400 hover:text-red-600 transition-all"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* New image previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((src, i) => (
                    <div key={i} className="relative group">
                      <img src={src} alt={`preview-${i}`} className="w-full h-24 object-cover rounded-lg" />
                      <button
                        onClick={() => {
                          setImages(prev => prev.filter((_, idx) => idx !== i))
                          setPreviews(prev => prev.filter((_, idx) => idx !== i))
                        }}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                      >
                        ✕
                      </button>
                      <span className="absolute bottom-1 left-1 bg-black/40 text-white text-[10px] px-1.5 py-0.5 rounded-md">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                  {/* Add more */}
                  <label className="w-full h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#32cddb] hover:bg-[#94e5ec]/5 transition-all">
                    <span className="text-gray-300 text-xl">+</span>
                    <span className="text-gray-300 text-[10px] mt-0.5">Add more</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files || [])
                        setImages(prev => [...prev, ...newFiles])
                        setPreviews(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))])
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Existing images when editing */}
              {existingImages.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Current images ({existingImages.length})</p>
                  <div className="grid grid-cols-3 gap-2">
                    {existingImages.map((img, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={img.url}
                          alt={`existing-${i}`}
                          className={`w-full h-24 object-cover rounded-lg transition-all
                            ${deletingImageUrl === img.url ? "opacity-40" : "opacity-90"}`}
                        />
                        <button
                          onClick={() => handleDeleteExistingImage(img)}
                          disabled={deletingImageUrl === img.url}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center disabled:opacity-50"
                        >
                          {deletingImageUrl === img.url ? "..." : "✕"}
                        </button>
                        <span className="absolute bottom-1 left-1 bg-black/40 text-white text-[10px] px-1.5 py-0.5 rounded-md">
                          {i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-300 mt-2">Upload new images to add more</p>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-5 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all"
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>
          <button
            onClick={step === 1 ? handleStep1 : step === 2 ? handleStep2 : step === 3 ? handleStep3 : handleStep4}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg text-sm font-semibold bg-[#32cddb] text-white hover:bg-[#32cddb]/90 shadow-md shadow-[#32cddb]/20 transition-all disabled:opacity-50"
          >
            {isLoading ? "Saving..." : step === 4 ? (property ? "Save Changes" : "Publish Listing") : "Next →"}
          </button>
        </div>
      </div>
    </div>
  )
}