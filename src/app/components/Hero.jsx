'use client'

import React from 'react'

// `data` comes from page_content('home').hero — see backend/db/seed_content.sql
// Falls back to sensible defaults only if the DB hasn't been seeded yet,
// so the page never renders blank while content loads.
export default function Hero({ data }) {
  const hero = {
    badge: 'SerandiByte Portfolio',
    title: 'Welcome to\nSerandiByte',
    description: '',
    ctaText: 'Free Consultant',
    ...data,
  };

  const titleLines = (hero.title || '').split('\n');

  return (
    <div
      id="home"
      className="
        relative flex flex-col md:flex-row items-center justify-center 
        min-h-[80vh] px-4 py-8 gap-8 h-screen pl-[12vw]
        text-[#FFFFFF]
        bg-cover bg-center bg-no-repeat
      "
      style={{
        backgroundImage: "url('/hero_bg.png')",
      }}
    >
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center md:items-start">
        {/* Small pill badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#FFFFFF]/40 bg-[#FFFFFF]/5 px-3 py-1 text-xs tracking-wider uppercase mb-4">
          <span className="h-2 w-2 rounded-full bg-[#FFFFFF] animate-pulse" />
          {hero.badge}
        </div>

        <h2 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-center md:text-left">
          {titleLines.map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < titleLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </h2>

        <p className="text-base sm:text-lg mt-4 max-w-2xl text-center md:text-left">
          {hero.description}
        </p>

        <div className="w-full sm:w-auto mt-8 flex justify-center md:justify-start">
          <a href="#contact">
            <button className="group relative px-12 py-4 border-2 border-[#FFFFFF] font-medium tracking-wider uppercase text-sm hover:bg-[#FFFFFF] hover:text-black transition-all duration-300 overflow-hidden">
              <span className="relative z-10">{hero.ctaText}</span>
              <div className="absolute inset-0 bg-[#FFFFFF] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            </button>
          </a>
        </div>
      </div>
    </div>
  )
}
