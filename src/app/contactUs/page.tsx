'use client';

import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  FaUser,
  FaEnvelope,
  FaComment,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface Message {
  type: "success" | "error" | "";
  text: string;
}

interface ContactInfo {
  icon: JSX.Element;
  title: string;
  details: string;
  description: string;
  color: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

const ContactUs = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({ type: "", text: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      setIsSubmitting(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Thank you! Your message has been sent successfully. We will get back to you soon.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setMessage({
          type: "error",
          text: "Failed to send the message. Please try again later.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo: ContactInfo[] = [
    {
      icon: <FaPhone className="text-2xl" />,
      title: "Phone",
      details: "+1 (555) 123-4567",
      description: "Mon to Fri 9am to 6pm",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FaEnvelope className="text-2xl" />,
      title: "Email",
      details: "support@cryptowealth.com",
      description: "Send us your query anytime!",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl" />,
      title: "Address",
      details: "123 Crypto Street, Digital City",
      description: "DC 10001, United States",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <FaClock className="text-2xl" />,
      title: "Working Hours",
      details: "24/7 Customer Support",
      description: "We're here to help you anytime",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const faqItems: FAQItem[] = [
    {
      question: "How quickly do you respond to inquiries?",
      answer:
        "We typically respond within 1-2 hours during business hours and within 24 hours maximum.",
    },
    {
      question: "Do you provide 24/7 customer support?",
      answer:
        "Yes, we have round-the-clock customer support for all our premium members.",
    },
    {
      question: "What information should I include in my message?",
      answer:
        "Please include your account details, specific issue, and any relevant transaction IDs for faster resolution.",
    },
    {
      question: "Can I contact you for investment advice?",
      answer:
        "While we provide platform support, for personalized investment advice we recommend consulting with our financial experts.",
    },
  ];

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
              {message.text && (
                <div
                  className={`p-4 rounded-xl border backdrop-blur-sm ${
                    message.type === "success"
                      ? "bg-green-500/20 border-green-400/30 text-green-400"
                      : "bg-red-500/20 border-red-400/30 text-red-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {message.type === "success" ? <FaCheck /> : <FaTimes />}
                    {message.text}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 disabled:from-gray-500 disabled:to-gray-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-2xl flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
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