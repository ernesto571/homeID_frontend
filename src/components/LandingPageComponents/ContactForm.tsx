import { useState, useEffect } from "react";
import { Clock, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import emailjs from "@emailjs/browser";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownEndTime, setCooldownEndTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Load cooldown from localStorage on mount
  useEffect(() => {
    const storedEndTime = localStorage.getItem("contactFormCooldown");
    if (storedEndTime) {
      const endTime = parseInt(storedEndTime);
      const now = Date.now();
      if (endTime > now) {
        setCooldownEndTime(endTime);
      } else {
        localStorage.removeItem("contactFormCooldown");
      }
    }
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (!cooldownEndTime) {
      setTimeRemaining(0);
      return;
    }
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, cooldownEndTime - now);
      if (remaining === 0) {
        setCooldownEndTime(null);
        localStorage.removeItem("contactFormCooldown");
        setTimeRemaining(0);
      } else {
        setTimeRemaining(remaining);
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [cooldownEndTime]);

  // Format time remaining
  const formatTimeRemaining = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cooldownEndTime && Date.now() < cooldownEndTime) {
      toast.error("Please wait before sending another message");
      return;
    }

    if (!formData.first_name || !formData.last_name || !formData.phone || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const messageContent = `
          First Name: ${formData.first_name}
          Last Name: ${formData.last_name}
          Phone: ${formData.phone}
          Email: ${formData.email}
          💬 Message from homeID:
          ${formData.message}
      `;

      // ✅ properly awaited — success logic only runs after email is sent
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          first_name: formData.first_name,
          email: formData.email,
          message: messageContent,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      // Set cooldown
      const cooldownDuration = 60 * 1000;
      const endTime = Date.now() + cooldownDuration;
      setCooldownEndTime(endTime);
      localStorage.setItem("contactFormCooldown", endTime.toString());

      // Clear form
      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        message: "",
      });

      toast.success("Message sent successfully! We'll get back to you soon.");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || (cooldownEndTime !== null && Date.now() < cooldownEndTime);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-10">
      {/* First & Last Name */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          disabled={isDisabled}
          className="w-full pl-5 bg-[#f8f8f8] py-3 border-[1px] rounded-sm focus:border-[#e86822] focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="First Name"
          required
        />
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          disabled={isDisabled}
          className="w-full pl-5 bg-[#f8f8f8] py-3 border-[1px] rounded-sm focus:border-[#e86822] focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Last Name"
          required
        />
      </div>

      {/* Email & Phone */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isDisabled}
          className="w-full pl-5 bg-[#f8f8f8] py-3 border-[1px] rounded-sm focus:border-[#e86822] focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Your Email"
          required
        />
        {/* ✅ fixed: type="tel" not type="phone" */}
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={isDisabled}
          className="w-full pl-5 bg-[#f8f8f8] py-3 border-[1px] rounded-sm focus:border-[#e86822] focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Your Phone"
          required
        />
      </div>

      {/* Message */}
      <div>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          disabled={isDisabled}
          rows={5}
          className="w-full pl-5 py-3 border-[1px] bg-[#f8f8f8] rounded-sm focus:border-[#e86822] focus:outline-none transition-colors resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Tell us how we can help you..."
          required
        />
      </div>

      {/* Cooldown Timer */}
      {cooldownEndTime && timeRemaining > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Clock className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="font-semibold text-yellow-900">Please wait before sending another message</p>
              <p className="text-sm text-yellow-700">
                Time remaining: <span className="font-mono font-bold">{formatTimeRemaining(timeRemaining)}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isDisabled}
        className="max-w-[70%] md:w-[30%] bg-[#e86822] hover:bg-[#e86822]/90 text-white font-bold py-4 px-6 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#e5bca6] disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </>
        ) : cooldownEndTime && timeRemaining > 0 ? (
          <>
            <Clock size={20} />
            Wait {formatTimeRemaining(timeRemaining)}
          </>
        ) : (
          <>
            <Send size={20} />
            Send Message
          </>
        )}
      </button>

      <p className="text-sm text-gray-500 text-center">
        * All fields are required. We typically respond within 24 hours.
      </p>
    </form>
  );
}