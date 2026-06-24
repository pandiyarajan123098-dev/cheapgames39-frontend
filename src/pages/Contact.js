import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Instagram,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { FaWhatsapp } from "react-icons/fa";

const API =
  process.env.REACT_APP_BACKEND_URL ||
  "https://cheapgames39-backend-1.onrender.com";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold uppercase mb-4">
            Get In <span className="text-[#B50000]">Touch</span>
          </h1>

          <p className="text-lg text-gray-400">
           Need help? Our support team is always ready to assist you.
          </p>
        </motion.div>

        {/* Trust Stats */}
        <div className="grid grid-cols-3 gap-4 mb-14">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-5 text-center">
            <h3 className="text-2xl font-bold">500+</h3>
            <p className="text-gray-400 text-sm">Orders Completed</p>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-2xl p-5 text-center">
 <h3 className="text-2xl font-bold flex items-center justify-center gap-1">
  4.9 <span className="text-[#FFA500]">★</span>
</h3>
            <p className="text-gray-400 text-sm">Customer Rating</p>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-2xl p-5 text-center">
            <h3 className="text-2xl font-bold">24/7</h3>
            <p className="text-gray-400 text-sm">Support</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left Side */}
          <div className="space-y-8">

            {/* Quick Support */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6">Quick Support</h2>

              <div className="space-y-4">

                <a
                  href="https://wa.me/916379490178"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-green-600 hover:bg-green-700 rounded-xl px-5 py-4 font-semibold"
                >
                  <FaWhatsapp size={22} />
                  Chat on WhatsApp
                </a>

                <a
                  href="https://instagram.com/cheapgames39.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#B50000] hover:bg-red-700 rounded-xl px-5 py-4 font-semibold"
                >
                  <Instagram size={20} />
                  DM on Instagram
                </a>

              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-8">
                Contact Information
              </h2>

              <div className="space-y-6">

                <div className="flex items-center gap-4">
                  <Phone className="text-[#B50000]" />
                  <span>+91 63794 90178</span>
                </div>

                <div className="flex items-center gap-4">
                  <Mail className="text-[#B50000]" />
                  <span>cg39support@gmail.com</span>
                </div>

                <div className="flex items-center gap-4">
                  <MapPin className="text-[#B50000]" />
                  <span>Serving Gamers Across India</span>
                </div>

              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
  <Clock className="w-5 h-5 text-[#B50000]" />
  Business Hours
</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>6 AM - 11 PM</span>
                </div>

                <div className="flex justify-between">
                  <span>Saturday - Sunday</span>
                  <span>5 AM - 12 AM</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side */}
          <div className="space-y-8">

            {/* Contact Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-[#111] border border-white/10 rounded-3xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Send Message</h2>

              <div className="space-y-5">

                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3"
                />

                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3"
                />

                <textarea
                  rows={5}
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3"
                />

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-[#B50000] hover:bg-red-700 py-4 rounded-full font-bold"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>

            {/* FAQ */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6">FAQ</h2>

              <div className="space-y-5 text-gray-400">

                <div>
                  <p className="text-white font-semibold">
                    How fast is delivery?
                  </p>
                  <p>Usually within 5–30 minutes.</p>
                </div>

                <div>
                  <p className="text-white font-semibold">
                    Is it safe?
                  </p>
                  <p>Yes. Secure checkout and trusted delivery.</p>
                </div>

                <div>
                  <p className="text-white font-semibold">
                    Payment methods?
                  </p>
                  <p>UPI, GPay, PhonePe, Paytm.</p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;