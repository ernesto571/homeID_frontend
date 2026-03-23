import { useEnquiryStore } from "../../store/EnquiryStore"

interface Props {
  property: any
}

export default function EnquiryForm({ property }: Props) {
  const { formData, setFormData, sendEnquiry, resetFormData, isLoading } = useEnquiryStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // ✅ prevent page reload

    const ok = await sendEnquiry({
      ...formData,
      property_id: property.id, // ✅ link to correct property
    })

    if (ok) {
      resetFormData()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
      <input
        type="text"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        className="w-full pl-5 bg-[#f8f8f8] py-3 focus:border rounded-md focus:border-[#e86822] focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder="Full Name *"
        required
      />
      <input
        type="text"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleChange}
        className="w-full pl-5 bg-[#f8f8f8] py-3 focus:border rounded-md focus:border-[#e86822] focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder="Phone Number *"
        required
      />
      <input
        type="email"
        name="email_address"  
        value={formData.email_address}
        onChange={handleChange}
        className="w-full pl-5 bg-[#f8f8f8] py-3 focus:border rounded-md focus:border-[#e86822] focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder="Email Address *"
        required
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        rows={4}
        className="w-full pl-5 py-3 focus:border bg-[#f8f8f8] rounded-sm focus:border-[#e86822] focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder={`Hello, I'm interested in ${property.title} ...`}
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className="flex text-center items-center text-[1.1rem] justify-center w-full py-3 font-bold rounded-md bg-[#e86822] text-white hover:bg-[#e86822]/90 ease-in-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Sending..." : "Send Message"}
      </button>
    </form>
  )
}