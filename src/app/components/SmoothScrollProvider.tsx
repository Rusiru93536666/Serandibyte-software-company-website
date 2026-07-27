"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SmoothScrollProvider() {
  const smoother = useRef<ScrollSmoother | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Prevent duplicate initialization
    if (ScrollSmoother.get()) return;

    smoother.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",

      smooth: 1.5, // smoothness amount
      effects: true,
      normalizeScroll: true,
    });


    // Smooth anchor scrolling
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const link = target.closest(
        "a[href^='#']"
      ) as HTMLAnchorElement | null;


      if (!link) return;


      const href = link.getAttribute("href");

      if (!href || href === "#") return;


      const section = document.querySelector(href);

      if (!section) return;


      event.preventDefault();


      smoother.current?.scrollTo(section, true, "top 80px");
    };


    document.addEventListener("click", handleAnchorClick);


    return () => {
      document.removeEventListener("click", handleAnchorClick);

      smoother.current?.kill();
      smoother.current = null;
    };

  }, []);


  return null;
}