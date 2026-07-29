"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Rocket, ShoppingCart, Heart, GraduationCap, Wheat, Bus, Binoculars, Factory,
} from "lucide-react";

// Icon names are stored as plain strings in the DB (page_content.focusArea.items[].icon)
// so admins can pick any lucide-react icon name without redeploying code.
const ICON_MAP = {
  Rocket, ShoppingCart, Heart, GraduationCap, Wheat, Bus, Binoculars, Factory,
};

// `data` = page_content('home').focusArea from GET /api/content/home
export default function Area({ data = {} }) {
  const [hovered, setHovered] = useState(null);
  const { heading = 'Our Focus', highlight = 'Areas', description = '', items = [] } = data;

  return (
    <section className=" py-20 px-6">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-bold text-[#FFFFFF] mb-6 tracking-tight">
          {heading} <span className="text-[#FFFFFF80]">{highlight}</span>
        </h2>
        <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
        <p className="text-xl text-[#FFFFFF] max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-white/40 text-sm">No focus areas published yet.</p>
      ) : (
        <div className="max-w-8xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 rounded-[28px] border border-[#FFFFFF]/20 backdrop-blur-xl bg-[#FFFFFF]/5 p-8">
          {items.map((service, i) => {
            const Icon = ICON_MAP[service.icon] || Rocket;

            // Grid position helpers
            const isFirstRow = i < 4;
            const isLastRow = i >= items.length - 4;
            const isFirstCol = i % 4 === 0;
            const isLastCol = (i + 1) % 4 === 0;
            const hideSecondRowBottom = i >= 4 && i < 8;

            return (
              <motion.div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                viewport={{ once: true }}
                className={`relative p-8 cursor-pointer group text-[#FFFFFF] hover:text-white transition-all duration-500
                  ${hovered === i ? "bg-gradient-to-bl from-none to-[#FFFFFF80]" : "bg-none"}
                  border-b border-zinc-800
                  last:border-b-0
                  sm:border-r sm:border-zinc-800
                  ${isFirstRow ? "sm:border-t-0" : ""}
                  ${isFirstCol ? "sm:border-l-0" : ""}
                  ${hideSecondRowBottom ? "sm:border-b-0" : ""}
                  ${isLastCol ? "sm:border-r-0" : ""}
                  ${isLastRow ? "sm:border-b-0" : ""}
                `}
              >
                <div className="mb-4">
                  <Icon className="w-8 h-8 text-[#FFFFFF]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-sm">{service.desc}</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
