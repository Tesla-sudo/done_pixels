// src/pages/About.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Instagram, Mail, Phone } from "lucide-react";

// Import your real image
import profileImage from "../assets/done5.jpg";

export default function About() {
  return (
    <>
      {/* Hero Section - About */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="absolute inset-0">
          <img
            src={profileImage}
            alt="Evans Muholo — Done Pictures"
            className="w-full h-full object-cover opacity-80 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6 max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl mb-6">
            Hi, I'm <span className="text-yellow-400">Dan</span>
          </h1>
          <p className="text-xl md:text-2xl text-white drop-shadow-md font-light">
            Nature Videographer • Storyteller • Conservation Advocate
          </p>
        </motion.div>
      </section>

      {/* About Story */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              My Journey with Nature
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              I grew up in the heart of Kenya, surrounded by savannas, forests, and wildlife. From a young age, I was drawn to the raw emotion of the wild — the golden hour light, the silence before a storm, the quiet dignity of a lion at rest.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              With a camera in hand, I began documenting these moments not just to capture them, but to <strong>preserve their soul</strong>. Every frame is a love letter to nature.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Today, <span className="font-bold text-yellow-600">Done Pictures</span> is my way of sharing that wonder with the world — through cinematic films, framed portraits, and stories that inspire action.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-gray-900 mb-16"
          >
            What I Stand For
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Authenticity",
                desc: "No filters. No staging. Just real moments in real light.",
              },
              {
                title: "Conservation",
                desc: "10% of every project funds local wildlife protection.",
              },
              {
                title: "Craft",
                desc: "Pro gear, cinematic grading, sound design that moves.",
              },
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center px-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let’s Tell Your Story
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto font-medium">
            Whether it’s a wedding in the wild, a brand film, or a personal nature reel — I’m ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/254717546693?text=Hi%20Evans!%20I%E2%80%99d%20love%20to%20work%20with%20you."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-900 transition shadow-lg"
            >
              Message on WhatsApp
            </a>
            <a
              href="/portfolio"
              className="border-2 border-black px-8 py-3 rounded-full font-bold hover:bg-black hover:text-white transition"
            >
              View My Work
            </a>
          </div>
        </motion.div>
      </section>

      {/* Compact Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="mx-auto max-w-7xl px-6 text-center text-xs md:text-sm">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mb-2">
            <a href="tel:+254717546693" className="flex items-center gap-1 hover:text-yellow-400">
              <Phone className="w-3 h-3" />
              +254 707888778
            </a>
            <span className="hidden sm:inline text-gray-600">•</span>
            <a href="mailto:picturesbydone@gmail.com" className="flex items-center gap-1 hover:text-yellow-400">
              <Mail className="w-3 h-3" />
              picturesbydone@gmail.com
            </a>
            <span className="hidden sm:inline text-gray-600">•</span>
            <a href="https://www.instagram.com/done_pics?igsh=MXhncGtrbTdmc212aQ==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-yellow-400">
              <Instagram className="w-3 h-3" />
              @donepictures
            </a>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Done Pictures. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}