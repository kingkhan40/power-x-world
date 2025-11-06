'use client';

import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  FaUser,
  FaEnvelope,
  FaComment,
  FaClock,
  FaPaperPlane,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from '@/context/AuthContext'; // ✅ Import AuthContext

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactUs = () => {
  const { sendContactMessage, contactLoading, contactMessage } = useAuth(); // ✅ Use AuthContext
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await sendContactMessage(formData);
      // ✅ Clear form only on success
      if (contactMessage.type === "success") {
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      // Error handled in context
    }
  };

  return (
    <div
      className="min-h-screen py-8 px-4 relative"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/5a/18/4c/5a184cc5e5e5307c967be8d1dff6d65c.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-4">
          <h1 className="lg:text-3xl text-2xl mb-4">
            📞
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Contact Us
            </span>
          </h1>
          <p className="text-blue-100 lg:text-xl text-sm tracking-wider max-w-3xl mx-auto">
            Get in touch with our support team. We're here to help you with any
            questions about your investments, rewards, or platform features.
          </p>
        </div>

        <div className="lg:p-6 p-4 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
          {/* Rotating Border Animation */}
          <div
            className="absolute -inset-2 rounded-2xl animate-spin opacity-70"
            style={{
              background:
                "conic-gradient(from 0deg, #ec4899, #10b981, #3b82f6, #8b5cf6, #f59e0b, #ec4899)",
              animationDuration: "9000ms",
              zIndex: 0,
            }}
          ></div>
          <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 z-1"></div>

          {/* Animated Gradient Circles */}
          <div
            className="absolute -top-8 -left-8 w-24 h-24 rounded-full z-10"
            style={{
              background: "linear-gradient(45deg, #ec4899, #10b981, #ec4899)",
              filter: "blur(12px)",
              opacity: "0.6",
            }}
          ></div>

          <div
            className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full z-10"
            style={{
              background:
                "linear-gradient(135deg, #3b82f6, #8b5cf6, #3b82f6)",
              filter: "blur(10px)",
              opacity: "0.4",
            }}
          ></div>

          <div className="relative z-20">
            <h2 className="lg:text-2xl text-xl font-bold text-white mb-4 flex items-center gap-3">
              <FaPaperPlane className="text-blue-400" />
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-3">
                <label className="text-white font-semibold flex items-center gap-2">
                  <FaUser className="text-blue-400" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-white/20 rounded-xl text-white placeholder-gray-400 pr-12 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <label className="text-white font-semibold flex items-center gap-2">
                  <FaEnvelope className="text-purple-400" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-white/20 rounded-xl text-white placeholder-gray-400 pr-12 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              {/* Message Field */}
              <div className="space-y-3">
                <label className="text-white font-semibold flex items-center gap-2">
                  <FaComment className="text-green-400" />
                  Your Message
                </label>
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full p-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 backdrop-blur-sm resize-none"
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>
              </div>

              {/* Message Display */}
              {contactMessage.text && (
                <div
                  className={`p-4 rounded-xl border backdrop-blur-sm ${
                    contactMessage.type === "success"
                      ? "bg-green-500/20 border-green-400/30 text-green-400"
                      : "bg-red-500/20 border-red-400/30 text-red-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {contactMessage.type === "success" ? <FaCheck /> : <FaTimes />}
                    {contactMessage.text}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={contactLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 disabled:from-gray-500 disabled:to-gray-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-2xl flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {contactLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending Message...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="animate-pulse" />
                    Send Message
                  </>
                )}
              </button>
            </form>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl border border-yellow-400/30">
              <div className="flex items-center gap-3">
                <FaClock className="text-yellow-400 text-lg" />
                <div>
                  <div className="text-yellow-200 text-sm font-semibold">
                    Response Time
                  </div>
                  <div className="text-white text-sm">
                    We typically respond within 1-2 hours during business
                    hours
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;