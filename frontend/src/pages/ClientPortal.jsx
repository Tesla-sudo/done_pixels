// src/pages/ClientPortal.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Camera,
  MessageSquare,
  Send,
  CheckCircle,
  XCircle,
  Star,
  Heart,
  Smile,
  Frown,
  Meh,
  Sparkles,
} from "lucide-react";

const WHATSAPP_NUMBER = "254717546693";

export default function ClientPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("booking");

  // Form
  const [shootType, setShootType] = useState("");
  const [shootDate, setShootDate] = useState("");
  const [description, setDescription] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [reaction, setReaction] = useState("");

  // UI
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const buildWhatsAppMessage = (type, data) => {
    if (type === "booking") {
      return `
*New Booking Request* 

*Client:* ${data.clientName}
*Email:* ${data.clientEmail}
*Shoot:* ${data.shootType}
*Date:* ${data.shootDate}
*Details:* ${data.description}
      `.trim();
    }
    return `
*Client Feedback* 

*Client:* ${data.clientName}
*Rating:* ${"★".repeat(data.rating)} (${data.rating}/5)
*Reaction:* ${data.reaction}
*Message:* ${data.message}
      `.trim();
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    const data = {
      clientName: user?.name || "Guest",
      clientEmail: user?.email || "N/A",
      shootType,
      shootDate,
      description,
    };
    try {
      const wa = encodeURIComponent(buildWhatsAppMessage("booking", data));
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${wa}`, "_blank");
      showToast("success", "WhatsApp opened — tap **Send** to confirm!");
      setShootType(""); setShootDate(""); setDescription("");
    } catch {
      showToast("error", "Failed to open WhatsApp.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    const data = {
      clientName: user?.name || "Guest",
      clientEmail: user?.email || "N/A",
      rating,
      reaction: reaction || "None",
      message: feedback,
    };
    try {
      const wa = encodeURIComponent(buildWhatsAppMessage("feedback", data));
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${wa}`, "_blank");
      showToast("success", "Feedback sent — thank you!");
      setFeedback(""); setRating(0); setReaction("");
    } catch {
      showToast("error", "Failed to open WhatsApp.");
    } finally {
      setIsLoading(false);
    }
  };

  const shootTypes = [
    { id: "wedding", label: "Wedding", icon: Heart },
    { id: "event", label: "Event", icon: Calendar },
    { id: "docu", label: "Documentary", icon: Camera },
    { id: "promo", label: "Promotional", icon: MessageSquare },
    { id: "other", label: "Other", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-orange-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 p-1">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 text-center">
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-4xl md:text-5xl font-black text-gray-900 mb-3"
            >
              Client <span className="text-yellow-500">Portal</span>
            </motion.h1>
            <p className="text-lg text-gray-700 font-medium">
              Welcome, <span className="font-bold text-yellow-600">{user?.name || "Explorer"}</span>
            </p>
            <p className="mt-2 text-sm text-gray-600">Book a shoot or share thoughts — all via WhatsApp</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mt-10 mb-8">
          {[
            { id: "booking", label: "Book Shoot", icon: Calendar },
            { id: "feedback", label: "Feedback", icon: MessageSquare },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setActiveTab(tab.id); setMessage(null); }}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-6 h-6" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Toast */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30 }}
              className={`fixed top-6 right-6 z-50 flex items-center gap-3 p-5 rounded-2xl shadow-2xl font-bold text-lg ${
                message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {message.type === "success" ? <CheckCircle /> : <XCircle />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==== BOOKING ==== */}
        <AnimatePresence mode="wait">
          {activeTab === "booking" && (
            <motion.div
              key="booking"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <Camera className="w-9 h-9 text-yellow-500" />
                Book Your Shoot
              </h3>

              <form onSubmit={handleBookingSubmit} className="space-y-8">
                {/* Shoot type cards */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Choose Shoot Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {shootTypes.map((t) => (
                      <motion.label
                        key={t.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex flex-col items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                          shootType === t.label
                            ? "border-yellow-500 bg-yellow-50 shadow-lg"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shootType"
                          value={t.label}
                          checked={shootType === t.label}
                          onChange={(e) => setShootType(e.target.value)}
                          className="sr-only"
                          required
                        />
                        <t.icon className="w-8 h-8 mb-2 text-yellow-600" />
                        <span className="font-bold text-gray-800">{t.label}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Date</label>
                  <input
                    type="date"
                    value={shootDate}
                    onChange={(e) => setShootDate(e.target.value)}
                    required
                    className="w-full px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 transition"
                  />
                </div>

                {/* Details */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Details</label>
                  <textarea
                    placeholder="Location, guest count, vibe, special requests..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                    className="w-full px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 resize-none transition"
                  />
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xl py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <Send className="w-6 h-6" />
                  )}
                  {isLoading ? "Opening WhatsApp..." : "Send Booking via WhatsApp"}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==== FEEDBACK ==== */}
        <AnimatePresence mode="wait">
          {activeTab === "feedback" && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <MessageSquare className="w-9 h-9 text-yellow-500" />
                Share Your Experience
              </h3>

              <form onSubmit={handleFeedbackSubmit} className="space-y-8">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Rate Your Experience</label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <motion.button
                        key={s}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => setRating(s)}
                        className="p-2"
                      >
                        <Star
                          className={`w-10 h-10 transition-all ${
                            s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Reaction */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">How do you feel?</label>
                  <div className="flex justify-center gap-6">
                    {[
                      { emoji: Frown, label: "Sad" },
                      { emoji: Meh, label: "Okay" },
                      { emoji: Smile, label: "Happy" },
                    ].map((r) => (
                      <motion.button
                        key={r.label}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => setReaction(r.label)}
                        className={`p-4 rounded-full transition-all ${
                          reaction === r.label ? "bg-yellow-100 ring-4 ring-yellow-400" : "bg-gray-100"
                        }`}
                      >
                        <r.emoji className="w-8 h-8" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Message</label>
                  <textarea
                    placeholder="What did you love? What can we improve?"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={5}
                    required
                    className="w-full px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 resize-none transition"
                  />
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading || rating === 0}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xl py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <Send className="w-6 h-6" />
                  )}
                  {isLoading ? "Sending..." : "Send Feedback via WhatsApp"}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}