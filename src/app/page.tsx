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
  const servicesRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])
  const aboutCardsRef = useRef<Array<HTMLDivElement | null>>([])
  const modernImgRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLImageElement>(null)
  const ring2Ref = useRef<HTMLImageElement>(null)
  const layer1Ref = useRef<HTMLImageElement>(null)
  const layer2Ref = useRef<HTMLImageElement>(null)
  const layer3Ref = useRef<HTMLImageElement>(null)
  
  // Refs for service detail sections
  const uiUxRef = useRef<HTMLDivElement>(null)
  const webDevRef = useRef<HTMLDivElement>(null)
  const softwareDevRef = useRef<HTMLDivElement>(null)
  
  const [service, setService] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);}

  // Smooth scroll function
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

  useEffect(() => {
    // Register plugin here (client only)
    gsap.registerPlugin(ScrollTrigger)

    if (servicesRef.current && cardRefs.current.length) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: servicesRef.current,
          start: 'top 120%',
          end: 'bottom 99%',
          scrub: true,
          // markers: true,
        },
      })

      tl.from(servicesRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.5,
      })
      tl.from(
        cardRefs.current,
        {
          opacity: 0,
          y: 500,
          x:100,
          stagger: 0.2,
          duration: 0.5,
        },
        '-=0.3'
      )
    }

    // Animate about section cards
    if (aboutCardsRef.current.length) {
      gsap.from(aboutCardsRef.current, {
        opacity: 0,
        x: 80,
        stagger: 0.3,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: aboutCardsRef.current[0]?.parentElement,
          start: 'top 80%',
          end: 'bottom 60%',
          toggleActions: 'play none none reverse',
        },
      })

      // GSAP hover animation for about cards
      aboutCardsRef.current.forEach(card => {
        if (!card) return

        let mouseMoveHandler: ((e: MouseEvent) => void) | null = null

        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.07,
            boxShadow: '0 8px 32px 0 rgba(3, 184, 255, 0.3)',
            duration: 0.3,
            ease: 'power2.out',
          })

          mouseMoveHandler = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect()
            const x = e.clientX - (rect.left + rect.width / 2)
            const y = e.clientY - (rect.top + rect.height / 2)
            gsap.to(card, {
              x: x * 0.15,
              y: y * 0.15,
              duration: 0.3,
              ease: 'power2.out',
            })
          }
          card.addEventListener('mousemove', mouseMoveHandler)
        })

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            boxShadow: '0 4px 16px 0 rgba(0,0,0,0.2)',
            x: 0,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          })
          if (mouseMoveHandler) {
            card.removeEventListener('mousemove', mouseMoveHandler)
            mouseMoveHandler = null
          }
        })
      })
    }

    // Animate "modern image" left with scroll
    if (modernImgRef.current) {
      gsap.fromTo(
        modernImgRef.current,
        { x: 80, opacity: 0 },
        {
          x: -80,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: modernImgRef.current,
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: true,
          },
        }
      )
    }

    // Animate black ring in contact section
    if (ringRef.current) {
      gsap.fromTo(
        ringRef.current,
        { scale: 0.7, x:800, y:300, rotate: 20 },
        {
          scale: 1.3,
          x:150,
          y: 300,
          duration: 1.2,
          ease: 'power2.inout',
          yoyo: true,
          scrollTrigger: {
            trigger: ringRef.current,
            start: 'top 100%',
            end: 'bottom 80%',
            scrub: true,
            // markers: true,
          },
        }
      )
    }

     // Animate black ring 02 in contact section
    if (ring2Ref.current) {
      gsap.fromTo(
        ring2Ref.current,
        { scale: 0.7, x:-900, y:-500, rotate: 20 },
        {
          scale: 1,
          x: -250,
          y: -100,
          duration: 1.2,
          ease: 'power2.inout',
          scrollTrigger: {
            trigger: ring2Ref.current,
            start: 'top 90%',
            end: 'bottom 40%',
            scrub: true,
            // markers: true,
          },
        }
      )
    }

              //  Layer1 animation
    if (layer1Ref.current) {
            gsap.timeline({
              scrollTrigger: {
                trigger: layer1Ref.current,
                start: 'top 100%',
                end: 'bottom 10%',
                scrub: true,
                // markers: true,
              }
            })
            // Stop 1
            .fromTo(layer1Ref.current,
              { scale: 0.1, x: 0, y: -180, opacity: 0 },
              { scale: 1.1, x: 0, y: -180, opacity: 0.5, duration: 1.2, ease: 'power2.inOut' }
            )
    }

    //  Layer2 animation
    if (layer2Ref.current) {
            gsap.timeline({
              scrollTrigger: {
                trigger: layer2Ref.current,
                start: 'top 100%',
                end: 'bottom 50%',
                scrub: true,
                // markers: true,
              }
            })
            // Stop 1
            .fromTo(layer2Ref.current,
              { scale: 0.1, x: 0, y: 0, opacity: 0 },
              { scale: 1, x: 0, y: 0, opacity: 0.5, duration: 1.2, ease: 'power2.inOut' }
            )
    }

    //  Layer3 animation
    if (layer3Ref.current) {
            gsap.timeline({
              scrollTrigger: {
                trigger: layer3Ref.current,
                start: 'top 100%',
                end: 'bottom 50%',
                scrub: true,
                // markers: true,
              }
            })
            // Stop 1
            .fromTo(layer3Ref.current,
              { scale: 0.1, x: 0, y: 0, opacity: 0 },
              { scale: 1.1, x: 0, y: 0, opacity: 0.5, duration: 1.2, ease: 'power2.inOut' }
            )
    }

    
  }, [])

  return (
    <main className="flex flex-col lg:flex-row min-h-screen w-full bg-black">

       {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* NAVBAR */}
      <aside className="fixed z-50 top-0 left-0 h-screen w-0 lg:w-[10vw]">
        <Navbar />
      </aside>

      
      
      {/* Subtle vignette + grid backdrop */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,229,255,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(0,229,255,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,229,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* MAIN CONTENT */}
      <section className="flex-1 flex flex-col ml-0 w-full bg-gradient-to-r from-[#000000] via-black to-[#000000]">
        {/* Hero section */}
        <div id="home" className="flex flex-col md:flex-row items-center justify-center min-h-[80vh] px-4 py-8 gap-8 mt-20  pl-[12vw] text-[#00E5FF]">
          {/* Left: Text */}
          <div className="flex-1 flex flex-col items-center md:items-start">
            
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/5 px-3 py-1 text-xs tracking-wider uppercase mb-4">
              <span className="h-2 w-2 rounded-full bg-[#00E5FF] animate-pulse" />
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
               <button className="group relative px-12 py-4 border-2 border-[#00E5FF] font-medium tracking-wider uppercase text-sm hover:bg-[#00E5FF] hover:text-black transition-all duration-300 overflow-hidden">
            <span className="relative z-10">Free Consultant</span>
            <div className="absolute inset-0 bg-[#00E5FF] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          </button>
            </div>
          </div>
          {/* Right: Image */}
            <div className="relative">
                <img
                  src="/circule.gif "
                  alt="Holographic Motion"
                  loading="eager"
                  className= "w-full rounded-[28px] border border-[#00E5FF]/20 backdrop-blur-xl bg-[#00E5FF]/5 shadow-[0_0_80px_rgba(0,229,255,0.25)]"
                />
              </div>
        </div>

        {/* MARQUEE */}
        <section id="marquee" className="relative overflow-hidden py-6">
          <div  className="whitespace-nowrap will-change-transform">
            <p className="inline-block text-[14vw] sm:text-[10vw] font-black opacity-5 tracking-tight">
              SERANDIBYTE • SERANDIBYTE • SERANDIBYTE • SERANDIBYTE •
            </p>
          </div>
        </section>

        {/* About section */}
        <section
      id="about"
      className="flex flex-col items-center justify-center py-16 px-4 text-[#00E5FF] pl-[12vw]">
      <h2 className="text-3xl sm:text-5xl lg:text-7xl text-center">Why You <span className="text-[#00E5FF80]">Choose Us</span></h2>
      <p className="text-base sm:text-lg mt-6 max-w-3xl text-center">
        Our goal is to create applications that deliver a modern, professional, and memorable brand experience.
        We combine innovative design, advanced technology, and strategic thinking to craft solutions that add 
        value, build trust, and strengthen your brand. By aligning with your business goals and customer needs, 
        we believe this approach drives satisfaction, engagement, and long-term success.
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-18 w-full min-w-sm max-w-6xl">
        {[
          {
            title: 'Business Growth',
            desc: `We don't believe in one-size-fits-all. Whether you need a member dashboard, an e-commerce
              store, a real-time booking system, or a data-driven admin panel, we build it from the
              ground up to fit your workflow and goals`,
            icon: Layers,
          },
          {
            title: 'User Centred Design',
            desc: `We focus heavily on clean, modern UI/UX that not only looks great but also enhances user
              interaction. Our designers use the latest trends to ensure your web app stands out and
              offers an intuitive user experience`,
            icon: ChartNoAxesCombined,
          },
          {
            title: 'Speed and Performance',
            desc: `Slow websites lose users. That's why we optimize every pixel and process — ensuring your
              application loads quickly and runs smoothly. We use tools like Next.js for server-side
              rendering and lazy loading to maximize performance`,
            icon: Rocket,
          },
        ].map((card, i) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              ref={(el) => {
                aboutCardsRef.current[i] = el
              }}
              className="backdrop-blur-lg p-6 rounded-3xl border border-[#00E5FF]/20 bg-[#00E5FF]/5 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(0,229,255,0.12)]group flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-center">{card.title}</h3>
                <p className="mt-6 text-sm text-center">{card.desc}</p>
              </div>

              {/* Icon at bottom */}
              <div className="flex justify-center mt-8">
                <Icon className="w-10 h-10 text-[#00E5FF] group-hover:text-white transition-colors" />
              </div>
            </div>
          )
        })}
      </div>
        </section>

        {/* Services section */}
        <section id="services" className="flex flex-col items-center justify-center py-16 px-4 text-[#00E5FF] pl-[12vw]">
          <h2 className="text-3xl sm:text-7xl text-center">Our <span className="text-[#00E5FF80]">Services</span></h2>
          <p className="text-base sm:text-lg mt-4 max-w-2xl text-center">
            We provide a complete range of digital solutions to help your business thrive in the modern world.
             From concept to launch, we work closely with you to deliver results that combine creativity,
              functionality, and performance.
          </p>

          <div className="mt-10 ">
            <div
              className="flex gap-6 will-change-transform select-none cursor-grab active:cursor-grabbing grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3"
            >
              <div className="contents" />
              {[
                {
                  title: 'UI / UX Design',
                  desc: 'Futuristic interfaces, micro‑interactions, and clarity. Design systems that scale.',
                  bg: '/software-development.jpg',
                  onClick: () => scrollToSection(uiUxRef)
                },
                {
                  title: 'Web Development',
                  desc: 'Next.js, edge‑ready, SEO‑aware. Fast by default—beautiful by design.',
                  bg: '/software-development.jpg',
                  onClick: () => scrollToSection(webDevRef)
                },
                {
                  title: 'Software Dev',
                  desc: 'Custom platforms: web, mobile, and cloud. Reliable. Observable. Maintainable.',
                  bg: '/software-development.jpg',
                  onClick: () => scrollToSection(softwareDevRef, 170)
                },
              ].map((s, i) => (
                <article
                  key={i}
                  className="group relative min-w-[82vw] sm:min-w-[54vw] lg:min-w-[28vw] h-[68vh] rounded-3xl overflow-hidden border border-[#00E5FF]/20 bg-[#00E5FF]/5 backdrop-blur-xl shadow-[0_0_60px_rgba(0,229,255,0.12)]"
                >
                  <div className="absolute inset-0 z-0 opacity-30">
                    <img src={s.bg} alt="bg" loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/0 via-black/60 to-black" />
                  <div className="relative z-20 flex h-full flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold drop-shadow-[0_0_30px_rgba(0,229,255,0.35)]">{s.title}</h3>
                    <p className="mt-2 text-sm text-[#00E5FF]/85">{s.desc}</p>
                    <button 
                      className="cursor-pointer mt-6 self-start rounded-xl border border-[#00E5FF]/60 px-5 py-2 text-sm font-semibold hover:bg-[#00E5FF]/10 transition"
                      onClick={s.onClick}
                    >
                      Learn more
                    </button>
                  </div>
                  {/* Hover neon sweep */}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_180px_at_var(--x,50%)_var(--y,50%),rgba(0,229,255,0.15),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </article>
              ))}
            </div>
          </div>

          {/* Service Details Sections */}
          <div className="flex flex-col gap-16 mt-36 w-full">

            {/* UI/UX Design */}
              <div ref={uiUxRef} className=" sticky top-20 flex flex-col lg:flex-row items-center gap-8 mt-40  rounded-[28px] border border-[#00E5FF]/20 backdrop-blur-xl bg-[#00E5FF]/5 shadow-[0_0_20px_rgba(0,229,255,0.25)] p-8">
              <div className="flex-1 mt-20">
                <h3 className="lg:text-7xl md:text-5xl sm:text-2xl text-white">UI / UX Design</h3>
                <p className="text-base sm:text-sm md:text-md lg:text-xl text-gray-300 mt-4">
                  We design modern, futuristic UI/UX experiences that captivate users and strengthen your brand.
                   By blending sleek aesthetics with intuitive functionality, we create immersive, engaging, and 
                   emotionally resonant interfaces. From micro-interactions and advanced visual styles to accessible,
                    consistent design, our approach ensures every touchpoint is memorable, user-friendly, and 
                    aligned with your brand identity—driving satisfaction, loyalty, and long-term growth
                </p>
              </div>
              <div className="flex-1 flex justify-center mt-20">
                <img src="/design.png" alt="UI/UX" ref={layer1Ref} className="absolute w-full max-w-xs hidden md:block" />
              </div>
            </div>

            
            {/* Web Development */}
            <div ref={webDevRef} className="relative sticky top-30 flex flex-col-reverse lg:flex-row items-center  mt-40 rounded-[28px] border border-[#00E5FF]/20 backdrop-blur-xl bg-[#00E5FF]/5 shadow-[0_0_20px_rgba(0,229,255,0.25)] p-8">
              <div className="flex-1 flex justify-center">
                <img src="/webdesign.png" alt="Web Dev" ref={layer2Ref} className="w-full max-w-md  opacity-50 hidden md:block" />
              </div>
              <div className="flex-1 mt-20">
                <h3 className="lg:text-7xl md:text-5xl sm:text-2xl text-white">Web Development</h3>
                <p className="text-base sm:text-sm md:text-md lg:text-xl text-gray-300 mt-4">
                  we craft fast, high-performance websites that combine exceptional UI/UX design 
                  with full functionality. Every site we build is optimized for speed, usability, 
                  and seamless interaction—ensuring your visitors stay engaged and satisfied.
                   We design with precision to deliver visually stunning interfaces that work 
                   flawlessly across devices. Our websites are also SEO-friendly from the ground 
                   up, helping your business rank higher and reach the right audience with ease
                </p>
              </div>
            </div>



            {/* Software Dev */}
            <div ref={softwareDevRef} className="relative  flex flex-col lg:flex-row items-center gap-8 pl-[5vw] mt-20 rounded-[28px] border border-[#00E5FF]/20 backdrop-blur-xl bg-[#00E5FF]/5 shadow-[0_0_20px_rgba(0,229,255,0.25)] p-8">
              <div className="flex-1 mt-20">
                <h3 className="lg:text-7xl md:text-5xl sm:text-2xl text-white">Software Development</h3>
                <p className="text-base sm:text-sm md:text-md lg:text-xl text-gray-300 mt-4">
                  We provide custom software solutions designed to meet your unique business needs. 
                  From web and mobile applications to cloud-based systems, our team builds scalable, 
                  reliable, and high-performing software that streamlines operations and enhances user 
                  experiences. We follow best practices in development, testing, and maintenance to 
                  ensure every application we deliver adds value, improves efficiency, and supports 
                  long-term business growth
                </p>
              </div>
              <div className="flex-1 flex justify-center">
                <img src="/software.png" alt="Software Dev" ref={layer3Ref} className="w-full max-w-md opacity-50 hidden md:block" />
              </div>
            </div>
          </div>
        </section>

        {/* Projects section */}
        <section id="projects" className="flex flex-col items-center justify-center py-16 px-4 pl-[12vw]">
          <Services />
        </section>

        {/* Contact section */}
          <section id="contact" className="flex flex-col items-center justify-center py-16 px-4 min-h-[80vh] pl-[12vw]">
          <h2 className="text-3xl sm:text-4xl text-white mb-6 font-bold text-center">Contact Us</h2>

          {/* Animated rings */}
          <div className="flex-1 flex justify-center">
            <img ref={ringRef} src="/ring.png" alt="black 3D ring" className="absolute w-full max-w-md rounded-lg" />
          </div>
          <div className="flex-1 flex justify-center">
            <img ref={ring2Ref} src="/ring.png" alt="black 3D ring" className="absolute w-full max-w-md rounded-lg" />
          </div>

          <div className="w-full max-w-lg mx-auto rounded-[28px] border border-[#00E5FF]/20 backdrop-blur-xl bg-[#00E5FF]/5 shadow-[0_0_20px_rgba(0,229,255,0.25)] p-8 flex flex-col items-center">
            
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

            <button
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-white/80 to-white/60 text-black font-bold shadow hover:from-white hover:to-gray-200 transition mt-2"
              onClick={async () => {
                if (!service || !email || !message) {
                  showAlert("error", "Please fill all required fields");
                  return;
                }
                try {
                  const res = await fetch("/api/contact", {
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

        

        
        <div className="pl-[10vw] mt-30"><Footer /></div>
      </section>
    </main>
  )
}

