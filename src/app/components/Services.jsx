'use client'

import React from 'react'

// ---------------------------------------------------------------------
// SERVICES SECTION
// `items` = rows from the `services` table (GET /api/content/services),
// fully managed via the admin Services page (create/edit/delete/reorder).
// `intro` = heading/description copy from page_content('home').servicesIntro
// "Learn More" opens a modal owned by the parent page.
// ---------------------------------------------------------------------
export default function Services({ items = [], intro = {}, onLearnMore }) {
  const { heading = 'What you need to', highlight = 'Grow Online', description = '' } = intro;

  return (
    <section
      id="services"
      className="flex flex-col items-center justify-center py-16 px-4 pl-[12vw]"
    >
      <h2 className="text-3xl sm:text-7xl text-center">
        {heading} <span className="text-[#FFFFFF80]">{highlight}</span>
      </h2>

      <p className="text-base sm:text-lg mt-4 max-w-2xl text-center text-[#FFFFFF]">
        {description}
      </p>

      <div className="mt-10">
        {items.length === 0 ? (
          <p className="text-white/40 text-sm">No services published yet.</p>
        ) : (
          <div className="flex gap-6 will-change-transform select-none grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((s) => (
              <article
                key={s.id}
                className="group relative w-full h-[320px] overflow-hidden rounded-[24px] border border-white/10 bg-[#171717] p-[1px] transition-all duration-500 hover:-translate-y-2 hover:border-white/20"
              >
                {/* Top glow */}
                <div className="absolute inset-x-8 top-0 h-[120px] bg-white/10 blur-3xl opacity-40 group-hover:opacity-70 transition" />

                {/* Card */}
                <div className="relative flex h-full flex-col rounded-[23px] bg-gradient-to-b from-[#222] via-[#1b1b1b] to-[#111] p-6">
                  {/* Icon / image */}
                  <div className="mt-8 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur">
                    <img
                      src={s.image || '/test.png'}
                      alt=""
                      className="h-10 w-10 object-contain opacity-90"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="mt-8 text-2xl font-semibold tracking-wide text-white">
                    {s.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-7 text-white/45 line-clamp-3">
                    {s.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-8">
                    <button
                      onClick={() => onLearnMore(s)}
                      className="text-sm text-white/70 transition hover:text-white"
                    >
                      Learn More →
                    </button>

                    <a href="#contact">
                      <button className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60 transition hover:border-white/30 hover:text-white">
                        Get Started
                      </button>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
