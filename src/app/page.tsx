'use client'

import React, { useEffect, useRef, useState } from 'react'
import Navbar from './components/navbar'
import Footer from './components/footer'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Services from './components/Services'
import { Rocket, ChartNoAxesCombined, Layers, } from "lucide-react";
import Alert from './components/Alert'
import { NextPage } from 'next'

export default function Page() {

  // Which service type the user selected in the contact form
  // ("Website" | "Software" | "Design" | null).
  const [service, setService] = useState<string | null>(null);

  // Controlled inputs for the contact form fields.
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  // Holds the currently displayed alert (success/error banner) or null
  // when no alert should be shown.
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Displays an alert message for 3 seconds, then automatically clears it.
  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  }

  // ---------------------------------------------------------------------
  // "Learn More" popup / modal state + refs
  // ---------------------------------------------------------------------
  type ServiceCard = { title: string; desc: string; bg: string };

  // Currently selected service card (null = modal closed).
  const [selectedCard, setSelectedCard] = useState<ServiceCard | null>(null);

  // Refs used for the GSAP open/close transition.
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Opens the modal for a given card.
  const openModal = (card: ServiceCard) => {
    setSelectedCard(card);
  };

  // Animates the modal out, then clears the state once the animation completes.
  const closeModal = () => {
    if (modalRef.current && overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      });
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.85,
        y: 30,
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => setSelectedCard(null),
      });
    } else {
      setSelectedCard(null);
    }
  };

  // Plays the "open" transition whenever a new card is selected.
  useEffect(() => {
    if (selectedCard && modalRef.current && overlayRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.85, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power3.out' }
      );
    }
  }, [selectedCard]);

  // ---------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------

  // Smoothly scrolls the window to the given ref's element, optionally
  // offset by a number of pixels (e.g. to account for a sticky navbar).
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>, offset: number = 0) => {
    if (ref.current) {
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // ---------------------------------------------------------------------
  // ANIMATIONS (GSAP + ScrollTrigger) — runs once on mount
  // ---------------------------------------------------------------------
  useEffect(() => {
    // Register the ScrollTrigger plugin with GSAP.
    // Must happen client-side only (hence 'use client' + useEffect).
    gsap.registerPlugin(ScrollTrigger)

  }, []) // Empty dependency array: run once after initial mount.

  // ---------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------
  return (
    <main className="flex flex-col lg:flex-row min-h-screen w-full bg-[#151515]">

      {/* Alert banner — only rendered when `alert` state is set */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* LEARN MORE MODAL — GSAP-animated popup for the selected service card */}
      {selectedCard && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-lg rounded-[28px] border border-white/20 bg-gradient-to-b from-[#222] via-[#1b1b1b] to-[#111] p-8 shadow-2xl"
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

            {/* icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur mb-6">
              <img
                src={selectedCard.bg}
                alt=""
                className="h-10 w-10 object-contain opacity-90"
              />
            </div>

            {/* title */}
            <h3 className="text-3xl font-semibold tracking-wide text-white mb-4">
              {selectedCard.title}
            </h3>

            {/* description */}
            <p className="text-base leading-7 text-white/60 mb-8">
              {selectedCard.desc}
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-3 rounded-lg border border-white/20 text-white/80 font-medium transition hover:border-white/40 hover:text-white"
              >
                Close
              </button>
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
        
        {/* Subtle vignette + grid backdrop — purely decorative background layer,
          fixed behind all content, ignores pointer events */}
      <div className="pointer-events-none fixed inset-0 z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(253, 253, 253),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(252, 252, 252, 0.12),transparent_55%)] z-10" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(250, 250, 250)_1px,transparent_1px),linear-gradient(to_bottom,rgba(253, 255, 255, 0.06)_1px,transparent_1px)] bg-[size:32px_32px] z-10" />
      </div>

        {/* ============================= HERO SECTION ============================= */}
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
              <span className="h-2 w-2 rounded-full bg-[#FFFFFF] animate-pulse"  />
              SerandiByte Portfolio
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-center md:text-left">
              Welcome to <br />SerandiByte
            </h2>

            <p className="text-base sm:text-lg mt-4 max-w-2xl text-center md:text-left">
              SerandiByte is a cutting-edge platform designed to streamline your digital experience.
              Our mission is to provide top-notch services that enhance productivity and foster innovation.
            </p>

            <div className="w-full sm:w-auto mt-8 flex justify-center md:justify-start">
              <a href="#contact">
                <button className="group relative px-12 py-4 border-2 border-[#FFFFFF] font-medium tracking-wider uppercase text-sm hover:bg-[#FFFFFF] hover:text-black transition-all duration-300 overflow-hidden">
                  <span className="relative z-10">Free Consultant</span>
                  <div className="absolute inset-0 bg-[#FFFFFF] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </button>
              </a>
            </div>
          </div>

        </div>

        {/* ============================= MARQUEE ============================= */}
        {/* Decorative oversized repeated brand text, low opacity, non-interactive */}
        <section id="marquee" className="relative overflow-hidden py-6 bg-gradient-to-b from-black to-[#151515]">
          <div className="whitespace-nowrap will-change-transform">
            <p className="inline-block text-[14vw] sm:text-[10vw] font-[#ffffff] font-bold opacity-5 tracking-tight">
              SERANDIBYTE • SERANDIBYTE • SERANDIBYTE • SERANDIBYTE •
            </p>
          </div>
        </section>


        {/* ============================= SERVICES SECTION ============================= */}
        <section id="services" className="flex flex-col items-center justify-center py-16 px-4 pl-[12vw]">
          <h2 className="text-3xl sm:text-7xl text-center ">What you need to <span className="text-[#FFFFFF80]"> Grow Online</span></h2>
          <p className="text-base sm:text-lg mt-4 max-w-2xl text-center text-[#FFFFFF]">
            We provide a complete range of digital solutions to help your business thrive in the modern world.
            From concept to launch, we work closely with you to deliver results that combine creativity,
            functionality, and performance.
          </p>

          {/* Horizontal row of service preview cards */}
          <div className="mt-10 ">
            <div
              className="flex gap-6 will-change-transform select-none cursor-grab active:cursor-grabbing grid grid-cols-1 sm-grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              <div className="contents" />
              {[
                {
                  title: 'UI / UX Design',
                  desc: 'Futuristic interfaces, micro‑interactions, and clarity. Design systems that scale.',
                  bg: '/test.png',
                },
                {
                  title: 'Web Development',
                  desc: 'Next.js, edge‑ready, SEO‑aware. Fast by default—beautiful by design.',
                  bg: '/test.png',
                  // onClick: () => scrollToSection(webDevRef)
                },
                {
                  title: 'Software Dev',
                  desc: 'Custom platforms: web, mobile, and cloud. Reliable. Observable. Maintainable.',
                  bg: '/test.png',
                },
                {
                  title: 'UI / UX Design',
                  desc: 'Futuristic interfaces, micro‑interactions, and clarity. Design systems that scale.',
                  bg: '/test.png',
                },
                {
                  title: 'Web Development',
                  desc: 'Next.js, edge‑ready, SEO‑aware. Fast by default—beautiful by design.',
                  bg: '/test.png',
                },
                {
                  title: 'Software Dev',
                  desc: 'Custom platforms: web, mobile, and cloud. Reliable. Observable. Maintainable.',
                  bg: '/test.png',
                },
              ].map((s, i) => (
                <article
                key={i}
                className="
                  group
                  relative
                  w-full
                  h-[320px]
                  overflow-hidden
                  rounded-[24px]
                  border border-white/10
                  bg-[#171717]
                  p-[1px]
                  transition-all
                  duration-500
                  hover:-translate-y-2
                  hover:border-white/20
                "
              >
                {/* top glow */}
                <div className="absolute inset-x-8 top-0 h-[120px] bg-white/10 blur-3xl opacity-40 group-hover:opacity-70 transition" />

                {/* card */}
                <div
                  className="
                    relative
                    flex
                    h-full
                    flex-col
                    rounded-[23px]
                    bg-gradient-to-b
                    from-[#222]
                    via-[#1b1b1b]
                    to-[#111]
                    p-6
                  "
                >


                  {/* icon */}
                  <div className="mt-8 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur">
                    <img
                      src={s.bg}
                      alt=""
                      className="h-10 w-10 object-contain opacity-90"
                    />
                  </div>

                  {/* title */}
                  <h3 className="mt-8 text-2xl font-semibold tracking-wide text-white">
                    {s.title}
                  </h3>

                  {/* description */}
                  <p className="mt-3 text-sm leading-7 text-white/45">
                    {s.desc}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-8">
                    <button
                      onClick={() => openModal(s)}
                      className="text-sm text-white/70 transition hover:text-white"
                    >
                      Learn More →
                    </button>

                    <button className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60 transition hover:border-white/30 hover:text-white">
                      Get Started
                    </button>
                  </div>
                </div>
              </article>
              ))}
            </div>
          </div>

          
        </section>


        {/* ============================= PROCESS SECTION ============================= */}
          <section className="flex flex-col gap-16 pl-[12vw] p-[2vw]">

            <div className="text-center flex flex-col mt-20 items-center">
              <h2 className="text-3xl sm:text-7xl text-center ">How We Take You From  <span className="text-[#FFFFFF80]">Idea to <br></br> Impact</span></h2>
            <p className="text-base sm:text-lg mt-4 max-w-2xl text-center text-[#FFFFFF]">
              We provide a complete range of digital solutions to help your business thrive in the modern world.
              From concept to launch, we work closely with you to deliver results that combine creativity,
              functionality, and performance.
            </p>
            </div>

            {/* step 01 */}
            <div  className=" sticky top-10 flex flex-col lg:flex-row items-center gap-8 rounded-[28px] border border-[#FFFFFF]/20 backdrop-blur-sm bg-gradient-to-b from-[#121212] via-[#161616] to-[#121212] p-8">
              {/* <div className="flex-1 flex justify-center mt-20">
                <img src="/design.png" alt="UI/UX" className="absolute w-full max-w-xs hidden md:block" />
              </div> */}

              <div className="flex-1 flex flex-col text-center mt-20 max-w-[30vw]">
                <h1 className="lg:text-[180px] md:text-5xl sm:text-2xl text-white font-bold">01</h1>
                <h4 className="lg:text-7xl md:text-5xl sm:text-2xl text-white">Discovery & Consultation</h4>
              </div>

              <div className="bg-white max-w-[1px] h-[40vh] flex-1 justify-center text-white"/>

              <div className="flex-1 mt-20">
                <h5 className="lg:text-3xl md:text-2xl sm:text-xl font-bold text-white">Understanding your business goals, audience, and requirements</h5>
                <p className="text-base sm:text-sm md:text-md lg:text-xl text-gray-300 mt-4">
                  Every successful project begins with understanding your business. We take the time to learn 
                  about your company, target audience, objectives, and the challenges you face. Through detailed 
                  discussions and research, we identify opportunities that will help your business stand out and
                   achieve long-term success. This foundation allows us to create solutions that are aligned 
                   with your vision and business goals.
                </p>
              </div>
            </div>

            {/* step 02 */}
            <div  className=" sticky top-15 flex flex-col lg:flex-row items-center gap-8 mt-40 rounded-[28px] border border-[#FFFFFF]/20 backdrop-blur-sm bg-gradient-to-b from-[#121212] via-[#161616] to-[#121212] p-8">
              {/* <div className="flex-1 flex justify-center mt-20">
                <img src="/design.png" alt="UI/UX" className="absolute w-full max-w-xs hidden md:block" />
              </div> */}

              <div className="flex-1 flex flex-col text-center mt-20 max-w-[30vw]">
                <h1 className="lg:text-[180px] md:text-5xl sm:text-2xl text-white font-bold">02</h1>
                <h4 className="lg:text-7xl md:text-5xl sm:text-2xl text-white">Strategy & Planning</h4>
              </div>

              <div className="bg-white max-w-[1px] h-[60vh] flex-1 justify-center text-white"/>

              <div className="flex-1 mt-20">
                <h5 className="lg:text-3xl md:text-2xl sm:text-xl font-bold text-white">Creating a clear roadmap for successful project execution</h5>
                <p className="text-base sm:text-sm md:text-md lg:text-xl text-gray-300 mt-4">
                  Once we understand your requirements, we develop a clear strategy and project roadmap.
                   We carefully plan the features, technologies, design approach, and timeline to ensure 
                   every stage of the project is organized and efficient. Our strategic planning minimizes
                    risks, maximizes productivity, and ensures your investment delivers measurable business 
                    value.
                </p>
              </div>
            </div>

            {/* step 03 */}
            <div  className=" sticky top-20 flex flex-col lg:flex-row items-center gap-8 mt-40 rounded-[28px] border border-[#FFFFFF]/20 backdrop-blur-sm bg-gradient-to-b from-[#121212] via-[#161616] to-[#121212] p-8">
              {/* <div className="flex-1 flex justify-center mt-20">
                <img src="/design.png" alt="UI/UX" className="absolute w-full max-w-xs hidden md:block" />
              </div> */}

              <div className="flex-1 flex flex-col text-center mt-20 max-w-[30vw]">
                <h1 className="lg:text-[180px] md:text-5xl sm:text-2xl text-white font-bold">03</h1>
                <h4 className="lg:text-7xl md:text-5xl sm:text-2xl text-white">Design & Branding</h4>
              </div>

              <div className="bg-white max-w-[1px] h-[60vh] flex-1 justify-center text-white"/>

              <div className="flex-1 mt-20">
                <h5 className="lg:text-3xl md:text-2xl sm:text-xl font-bold text-white">Building modern designs that strengthen your brand identity</h5>
                <p className="text-base sm:text-sm md:text-md lg:text-xl text-gray-300 mt-4">
                  Great design creates lasting impressions. Our creative team designs intuitive user experiences,
                   modern interfaces, and compelling brand visuals that strengthen your business identity. From 
                   UI/UX design and graphic design to social media creatives and brand assets, we ensure every
                    visual element reflects professionalism and builds customer trust.
                </p>
              </div>
            </div>

            {/* step 04 */}
            <div  className=" sticky top-25 flex flex-col lg:flex-row items-center gap-8 mt-40 rounded-[28px] border border-[#FFFFFF]/20 backdrop-blur-sm bg-gradient-to-b from-[#121212] via-[#161616] to-[#121212] p-8">
              {/* <div className="flex-1 flex justify-center mt-20">
                <img src="/design.png" alt="UI/UX" className="absolute w-full max-w-xs hidden md:block" />
              </div> */}

              <div className="flex-1 flex flex-col text-center mt-20 max-w-[30vw]">
                <h1 className="lg:text-[180px] md:text-5xl sm:text-2xl text-white font-bold">04</h1>
                <h4 className="lg:text-7xl md:text-5xl sm:text-2xl text-white">Development</h4>
              </div>

              <div className="bg-white max-w-[1px] h-[60vh] flex-1 justify-center text-white"/>

              <div className="flex-1 mt-20">
                <h5 className="lg:text-3xl md:text-2xl sm:text-xl font-bold text-white">Creating powerful digital solutions with modern technology</h5>
                <p className="text-base sm:text-sm md:text-md lg:text-xl text-gray-300 mt-4">
                  Using modern technologies and industry best practices, we transform ideas into powerful
                   digital solutions. Whether it's a responsive website, mobile application, POS system,
                    or custom business software, our development team focuses on performance, security,
                     scalability, and user experience. Every solution is built to support your business 
                      growth and future expansion.
                </p>
              </div>
            </div>

            {/* step 05 */}
            <div  className=" sticky top-30 flex flex-col lg:flex-row items-center gap-8 mt-40 rounded-[28px] border border-[#FFFFFF]/20 backdrop-blur-sm bg-gradient-to-b from-[#121212] via-[#161616] to-[#121212] p-8">
              {/* <div className="flex-1 flex justify-center mt-20">
                <img src="/design.png" alt="UI/UX" className="absolute w-full max-w-xs hidden md:block" />
              </div> */}

              <div className="flex-1 flex flex-col text-center mt-20 max-w-[30vw]">
                <h1 className="lg:text-[180px] md:text-5xl sm:text-2xl text-white font-bold">05</h1>
                <h4 className="lg:text-7xl md:text-5xl sm:text-2xl text-white">Content Creation</h4>
              </div>

              <div className="bg-white max-w-[1px] h-[60vh] flex-1 justify-center text-white"/>

              <div className="flex-1 mt-20">
                <h5 className="lg:text-3xl md:text-2xl sm:text-xl font-bold text-white">Producing content that promotes and grows your brand</h5>
                <p className="text-base sm:text-sm md:text-md lg:text-xl text-gray-300 mt-4">
                  Building a great product is only part of the journey. To help your business reach more
                   customers, we create engaging promotional videos, eye-catching social media posts, and 
                   impactful digital marketing content. Our goal is to increase your brand visibility, 
                   strengthen customer engagement, and drive meaningful business growth across digital 
                   platforms.
                </p>
              </div>
            </div>

            {/* step 06 */}
            <div  className=" sticky top-35 flex flex-col lg:flex-row items-center gap-8 mt-40 rounded-[28px] border border-[#FFFFFF]/20 backdrop-blur-sm bg-gradient-to-b from-[#121212] via-[#161616] to-[#121212] p-8">
              {/* <div className="flex-1 flex justify-center mt-20">
                <img src="/design.png" alt="UI/UX" className="absolute w-full max-w-xs hidden md:block" />
              </div> */}

              <div className="flex-1 flex flex-col text-center mt-20 max-w-[30vw]">
                <h1 className="lg:text-[180px] md:text-5xl sm:text-2xl text-white font-bold">06</h1>
                <h4 className="lg:text-7xl md:text-5xl sm:text-2xl text-white">Testing & Quality Assurance</h4>
              </div>

              <div className="bg-white max-w-[1px] h-[60vh] flex-1 justify-center text-white"/>

              <div className="flex-1 mt-20">
                <h5 className="lg:text-3xl md:text-2xl sm:text-xl font-bold text-white">Ensuring quality, performance, and reliability</h5>
                <p className="text-base sm:text-sm md:text-md lg:text-xl text-gray-300 mt-4">
                  Before launching your project, we conduct comprehensive testing to ensure everything works
                   flawlessly. We verify functionality, performance, security, compatibility, and usability 
                   across different devices and platforms. By identifying and resolving issues early, we
                    deliver reliable solutions that provide a seamless experience for your customers.
                </p>
              </div>
            </div>

            {/* step 07 */}
            <div  className=" sticky top-40 flex flex-col lg:flex-row items-center gap-8 mt-40 rounded-[28px] border border-[#FFFFFF]/20 backdrop-blur-sm bg-gradient-to-b from-[#121212] via-[#161616] to-[#121212] p-8">
              {/* <div className="flex-1 flex justify-center mt-20">
                <img src="/design.png" alt="UI/UX" className="absolute w-full max-w-xs hidden md:block" />
              </div> */}

              <div className="flex-1 flex flex-col text-center mt-20 max-w-[30vw]">
                <h1 className="lg:text-[180px] md:text-5xl sm:text-2xl text-white font-bold">07</h1>
                <h4 className="lg:text-7xl md:text-5xl sm:text-2xl text-white">Launch & Deployment</h4>
              </div>

              <div className="bg-white max-w-[1px] h-[60vh] flex-1 justify-center text-white"/>

              <div className="flex-1 mt-20">
                <h5 className="lg:text-3xl md:text-2xl sm:text-xl font-bold text-white">Delivering your solution smoothly to the market</h5>
                <p className="text-base sm:text-sm md:text-md lg:text-xl text-gray-300 mt-4">
                  When your solution is fully tested and approved, we handle the deployment process with
                   precision. Whether launching a website, publishing a mobile app, or implementing a POS 
                   system, we ensure a smooth transition from development to production. Our team monitors
                    the launch to guarantee everything performs as expected from day one.
                </p>
              </div>
            </div>

            {/* step 08 */}
            <div  className="relative flex flex-col lg:flex-row items-center gap-8 mt-40 rounded-[28px] border border-[#FFFFFF]/20 backdrop-blur-sm bg-gradient-to-b from-[#121212] via-[#161616] to-[#121212] p-8">
              {/* <div className="flex-1 flex justify-center mt-20">
                <img src="/design.png" alt="UI/UX" className="absolute w-full max-w-xs hidden md:block" />
              </div> */}

              <div className="flex-1 flex flex-col text-center mt-20 max-w-[30vw]">
                <h1 className="lg:text-[180px] md:text-5xl sm:text-2xl text-white font-bold">08</h1>
                <h4 className="lg:text-7xl md:text-5xl sm:text-2xl text-white">Growth, Support</h4>
              </div>

              <div className="bg-white max-w-[1px] h-[60vh] flex-1 justify-center text-white"/>

              <div className="flex-1 mt-20">
                <h5 className="lg:text-3xl md:text-2xl sm:text-xl font-bold text-white">Providing continuous improvements and long-term support</h5>
                <p className="text-base sm:text-sm md:text-md lg:text-xl text-gray-300 mt-4">
                  Our relationship with clients continues long after launch. We provide ongoing maintenance, 
                  technical support, feature enhancements, and performance optimization to keep your digital 
                  solutions running at their best. As your business evolves, we help you adapt with new 
                  technologies, marketing strategies, and continuous improvements that drive sustainable 
                  growth and strengthen your brand.
                </p>
              </div>
            </div>

          </section>

        {/* ============================= FOCUS AREA SECTION ============================= */}
        <section id="projects" className="flex flex-col items-center justify-center py-16 px-4 pl-[12vw]">
          <Services />
        </section>

        {/* ============================= CONTACT SECTION ============================= */}
        <section id="contact" className="flex flex-col items-center justify-center py-16 px-4 min-h-[80vh] pl-[12vw]">
          <h2 className="text-3xl sm:text-4xl text-white mb-6 font-bold text-center">Contact Us</h2>

          {/* Contact / consultation request form */}
          <div className="w-full max-w-lg mx-auto rounded-[28px] border border-[#FFFFFF]/20 backdrop-blur-xl bg-[#FFFFFF]/5 shadow-[0_0_20px_rgba(0,229,255,0.25)] p-8 flex flex-col items-center">

            {/* Service type selector — toggles the `service` state */}
            <label className="text-gray-200 mt-2 mb-1 w-full text-left">I need a</label>
            <div className="flex gap-3 mb-6 w-full">
              {['Website', 'Software', 'Design'].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`flex-1 px-4 py-2 rounded-lg border font-semibold transition backdrop-blur
                    ${service === s ? 'bg-white text-black' : 'bg-white/10 text-white'}`}
                  onClick={() => setService(s)}
                >{s}</button>
              ))}
            </div>


            <label className="text-gray-200 mt-2 mb-1 w-full text-left">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-white/60 backdrop-blur"
            />

            <label className="text-gray-200 mt-2 mb-1 w-full text-left">Mobile Number</label>
            <input
              type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="xxx xxx xxxx"
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-white/60 backdrop-blur"
            />

            <label className="text-gray-200 mt-2 mb-1 w-full text-left">Company Name</label>
            <input
              type="text" value={company} onChange={(e) => setCompany(e.target.value)}
              placeholder="Company Name"
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-white/60 backdrop-blur"
            />

            <label className="text-gray-200 mt-2 mb-1  w-full text-left">Leave a message</label>
            <textarea
              value={message} onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help you?" rows={4}
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 mb-6 focus:outline-none focus:ring-2 focus:ring-white/60 resize-none backdrop-blur"
            />

            {/* Submit handler:
                1. Validates required fields (service, email, message).
                2. POSTs the form payload to `${API_URL}/api/contact`.
                3. Shows a success/error alert based on the response.
                4. Resets the form fields on completion. */}
            <button
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-white/80 to-white/60 text-black font-bold shadow hover:from-white hover:to-gray-200 transition mt-2"
              onClick={async () => {
                if (!service || !email || !message) {
                  showAlert("error", "Please fill all required fields");
                  return;
                }
                try {
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                  const res = await fetch(`${apiUrl}/api/contact`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ service, email, phone, company, message }),
                  });
                  const data = await res.json();
                  showAlert(res.ok ? "success" : "error", data.message);

                  // Clear form
                  setService(null);
                  setEmail("");
                  setPhone("");
                  setCompany("");
                  setMessage("");
                } catch (error) {
                  console.error("Error submitting form:", error);
                  showAlert("error", "Failed to send message. Please try again later.");
                }
              }}
            >
              Get Free Consultant
            </button>
          </div>
        </section>

        {/* ============================= FOOTER ============================= */}
        <div className="pl-[10vw] mt-30"><Footer /></div>
      </section>
    </main>
  )
}