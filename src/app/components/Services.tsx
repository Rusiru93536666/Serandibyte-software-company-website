"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Rocket, ShoppingCart, Heart, GraduationCap, Wheat, Bus, Binoculars, Factory } from "lucide-react";

const services = [
  { title: "Startups", desc: "Fueling innovation and rapid growth.", icon: Rocket },
  { title: "E-Commerce & Retail", desc: "Smart platforms for seamless shopping.", icon: ShoppingCart },
  { title: "Healthcare", desc: "Digital solutions improving patient care.", icon: Heart },
  { title: "Education", desc: "Modern tools for smarter learning.", icon: GraduationCap },
  { title: "Agri Tech", desc: "Technology transforming farming efficiency.", icon: Wheat },
  { title: "Tourism", desc: "Enhancing travel with digital experiences.", icon: Binoculars },
  { title: "Transportation", desc: "Smarter logistics and mobility systems.", icon: Bus },
  { title: "Manufacturing", desc: "Automation driving production efficiency.", icon: Factory },
];

export default function Services() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="bg-black py-20 px-6">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-bold text-[#00E5FF] mb-6 tracking-tight">
          Our Focus <span className="text-[#00E5FF80]">Areas</span>
        </h2>
        <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
        <p className="text-xl text-[#00E5FF] max-w-3xl mx-auto leading-relaxed">
          We specialize in delivering cutting-edge solutions across diverse industries, 
          transforming businesses with innovative technology.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 rounded-[28px] border border-[#00E5FF]/20 backdrop-blur-xl bg-[#00E5FF]/5 shadow-[0_0_20px_rgba(0,229,255,0.25)] p-8">
        {services.map((service, i) => {
          const Icon = service.icon;

          // Grid position helpers
          const isFirstRow = i < 4;
          const isLastRow = i >= services.length - 4;
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
              className={`relative p-8 cursor-pointer group text-[#00E5FF] hover:text-white transition-all duration-500
                ${hovered === i ? "bg-gradient-to-bl from-none to-[#00E5FF80]" : "bg-none"}
                
                /* Mobile: always bottom border */
                border-b border-zinc-800
                last:border-b-0

                /* Desktop overrides */
                sm:border-r sm:border-zinc-800
                ${isFirstRow ? "sm:border-t-0" : ""}
                ${isFirstCol ? "sm:border-l-0" : ""}
                ${hideSecondRowBottom ? "sm:border-b-0" : ""}
                ${isLastCol ? "sm:border-r-0" : ""}
                ${isLastRow ? "sm:border-b-0" : ""}
              `}
            >
              <div className="mb-4">
                <Icon className="w-8 h-8 text-[#00E5FF]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
              <p className="text-sm">{service.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
