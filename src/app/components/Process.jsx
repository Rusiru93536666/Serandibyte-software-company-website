'use client'

import React from 'react'

// `data` = page_content('home').process from GET /api/content/home
export default function Process({ data = {} }) {
  const {
    heading = 'How We Take You From',
    highlight = 'Idea to Impact',
    description = '',
    steps = [],
  } = data;

  return (
    <section className="flex flex-col gap-16 pl-[12vw] p-[2vw]">
      <div className="text-center flex flex-col mt-20 items-center">
        <h2 className="text-3xl sm:text-7xl text-center">
          {heading}{" "}
          <span className="text-[#FFFFFF80]">
            {highlight}
          </span>
        </h2>

        <p className="text-base sm:text-lg mt-4 max-w-2xl text-center text-[#FFFFFF]">
          {description}
        </p>
      </div>

      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        // Sticky offset scales with index so cards stack visually. Tailwind
        // can't JIT-compile a dynamic `top-${i}` class, so this is applied
        // as an inline style instead (purely presentational, not DB-stored).
        const stickyOffsetRem = Math.min(2.5 + i * 1.25, 10);
        const height = i === 0 ? 'h-[40vh]' : 'h-[60vh]';

        return (
          <div
            key={step.number || i}
            style={isLast ? undefined : { top: `${stickyOffsetRem}rem` }}
            className={`${
              isLast ? "relative" : "sticky"
            } flex flex-col lg:flex-row items-center gap-8 ${
              i > 0 ? "mt-40" : ""
            } rounded-[28px] border border-[#FFFFFF]/20 backdrop-blur-sm bg-gradient-to-b from-[#121212] via-[#161616] to-[#121212] p-8`}
          >
            <div className="flex-1 flex flex-col text-center mt-20 max-w-[30vw]">
              <h1 className="lg:text-[180px] md:text-5xl sm:text-2xl text-white font-bold">
                {step.number}
              </h1>

              <h4 className="lg:text-7xl md:text-5xl sm:text-2xl text-white">
                {step.title}
              </h4>
            </div>

            <div
              className={`bg-white max-w-[1px] ${height} flex-1 justify-center text-white`}
            />

            <div className="flex-1 mt-20">
              <h5 className="lg:text-3xl md:text-2xl sm:text-xl font-bold text-white">
                {step.subtitle}
              </h5>

              <p className="text-base sm:text-sm md:text-md lg:text-xl text-gray-300 mt-4">
                {step.body}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
