'use client'

import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Area from './components/Area'
import Alert from './components/Alert'
import Hero from './components/Hero'
import Services from './components/Services'
import Process from './components/Process'
import Contact from './components/Contact'

export default function Page() {
  // Holds the currently displayed alert (success/error banner) or null
  const [alert, setAlert] = useState(null);

  // Displays an alert message for 3 seconds, then automatically clears it.
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  }

  // Currently selected service card (null = modal closed).
  const [selectedCard, setSelectedCard] = useState(null);
  const openModal = (card) => setSelectedCard(card);
  const closeModal = () => setSelectedCard(null);

  // ---- Data fetched from the backend (replaces all hardcoded content) ----
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    fetch(`${apiUrl}/api/content/home`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load site content');
        return res.json();
      })
      .then((data) => setHomeData(data))
      .catch((err) => {
        console.error('Error loading home content:', err);
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#151515] text-white">
        Loading...
      </main>
    );
  }

  const content = homeData?.content || {};
  const services = homeData?.services || [];
  const settings = homeData?.settings || {};

  return (
    <main className="flex flex-col lg:flex-row min-h-screen w-full bg-[#151515]">
      {/* Alert banner — only rendered when alert state is set */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {loadError && (
        <Alert
          type="error"
          message="Some content couldn't be loaded from the server."
          onClose={() => setLoadError(false)}
        />
      )}

      {/* LEARN MORE MODAL — content comes from the selected service row */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={closeModal}
        >
          <div
            className="relative w-[90vw] lg:w-[70vw] max-h-[85vh] overflow-y-auto rounded-[28px] border border-white/20 bg-gradient-to-b from-[#222] via-[#1b1b1b] to-[#111] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              aria-label="Close"
              className="absolute top-5 right-5 text-white/60 hover:text-white transition text-xl leading-none"
            >
              ✕
            </button>

            {/* title */}
            <h3 className="text-3xl font-semibold tracking-wide text-white mb-4">
              {selectedCard.title}
            </h3>

            {/* Sub title / short description */}
            {selectedCard.description && (
              <h4 className="text-base leading-7 text-white/60 mb-8 font-bold">
                {selectedCard.description}
              </h4>
            )}

            {/* description / details */}
            {selectedCard.details && (
              <p className="text-base leading-7 text-white/60 mb-8">
                {selectedCard.details}
              </p>
            )}

            <div className="flex gap-3">
              <a href="#contact" onClick={closeModal} className="flex-1">
                <button className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-white/80 to-white/60 text-black font-bold shadow hover:from-white hover:to-gray-200 transition">
                  Get Started
                </button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR — fixed to the left edge, full height, hidden width on mobile */}
      <aside className="fixed z-50 top-0 left-0 h-screen w-0 lg:w-[10vw]">
        <Navbar />
      </aside>

      {/* MAIN CONTENT */}
      <section className="flex-1 flex flex-col ml-0 w-full bg-[#151515]">
        {/* ============================= HERO SECTION ============================= */}
        <Hero data={content.hero} />

        {/* ============================= MARQUEE ============================= */}
        <section id="marquee" className="relative overflow-hidden py-6 bg-gradient-to-b from-black to-[#151515]">
          <div className="whitespace-nowrap will-change-transform">
            <p className="inline-block text-[14vw] sm:text-[10vw] font-[#ffffff] font-bold opacity-5 tracking-tight">
              {Array(4).fill(content.marquee?.text || 'SERANDIBYTE').join(' • ')} •
            </p>
          </div>
        </section>

        {/* ============================= SERVICES SECTION ============================= */}
        <Services items={services} intro={content.servicesIntro} onLearnMore={openModal} />

        {/* ============================= PROCESS SECTION ============================= */}
        <Process data={content.process} />

        {/* ============================= FOCUS AREA SECTION ============================= */}
        <section id="projects" className="flex flex-col items-center justify-center py-16 px-4 pl-[12vw]">
          <Area data={content.focusArea} />
        </section>

        {/* ============================= CONTACT SECTION ============================= */}
        <Contact data={content.contact} settings={settings} showAlert={showAlert} />

        {/* ============================= FOOTER ============================= */}
        <div className="w-full"><Footer settings={settings} /></div>
      </section>
    </main>
  )
}
