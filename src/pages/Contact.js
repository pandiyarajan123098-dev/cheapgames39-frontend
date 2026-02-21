import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Instagram, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

const API = process.env.REACT_APP_BACKEND_URL || "https://cheapgames39-backend-1.onrender.com";

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

      toast.success("Message sent successfully! We'll contact you soon.");
      setFormData({ name: "", email: "", message: "" });

    } catch (err) {
      console.error("Contact error:", err);
      toast.error("Failed to send message. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* ================= PAGE TITLE ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold uppercase mb-4">
            Get In <span className="text-[#B50000]">Touch</span>
          </h1>
          <p className="text-lg text-gray-400">
            Have questions? We're here to help you 24/7.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ================= CONTACT FORM ================= */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-6">
                Send Us a Message
              </h2>

              <div className="space-y-6">

                {/* Name */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-[#B50000] focus:ring-1 focus:ring-[#B50000] outline-none transition"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-[#B50000] focus:ring-1 focus:ring-[#B50000] outline-none transition"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-[#B50000] focus:ring-1 focus:ring-[#B50000] outline-none transition"
                    placeholder="Tell us how we can help..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-[#B50000] hover:bg-red-700 py-4 rounded-full font-bold transition-all disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>

          {/* ================= CONTACT INFO ================= */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-8">
                Contact Information
              </h2>

              <div className="space-y-6">

                <div className="flex items-start gap-4">
                  <div className="bg-[#B50000] p-3 rounded-full">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">WhatsApp</h3>
                    <a
                      href="https://wa.me/919659868303"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#B50000] transition"
                    >
                      +91 96598 68303
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#B50000] p-3 rounded-full">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Instagram</h3>
                    <a
                      href="https://instagram.com/cheapgames39_official"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#B50000] transition"
                    >
                      @cheapgames39
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#B50000] p-3 rounded-full">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a
                      href="mailto:spptcheapgames39@gmail.com"
                      className="text-gray-400 hover:text-[#B50000] transition"
                    >
                      spptcheapgames39@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#B50000] p-3 rounded-full">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-gray-400">
                      Tamil Nadu, India
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* ================= BUSINESS HOURS ================= */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6">
                Business Hours
              </h3>

              <div className="space-y-4 text-gray-400">

                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-white font-semibold">
                    6:00 AM – 11:00 PM
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Saturday - Sunday</span>
                  <span className="text-white font-semibold">
                    5:00 AM – 12:00 AM
                  </span>
                </div>

              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;