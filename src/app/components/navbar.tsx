"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  // Smooth scroll handler
  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement
      if (target.tagName === "A" && target.hash) {
        const el = document.querySelector(target.hash)
        if (el) {
          e.preventDefault()
          el.scrollIntoView({ behavior: "smooth" })
          setIsMenuOpen(false)
        }
      }
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  // Esc key to close menu
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false)
    }
    window.addEventListener("keydown", onEsc)
    return () => window.removeEventListener("keydown", onEsc)
  }, [])

  return (
    <>
      {/* Desktop Navbar - UNCHANGED */}
      <nav className="hidden lg:flex h-[100vh] lg:w-[10vw] bg-[#00E5FF]/5 backdrop-blur border-r border-gray-700 flex-col items-center py-8 fixed z-50">
        {/* Logo */}
        <div className="flex items-center justify-center gap-1 mb-8 pt-4">
          <a href="#home">
            <Image
              src="/S.png"
              alt="S"
              width={50}
              height={50}
              className="w-auto h-8 lg:h-10 hover:scale-110 transition-transform duration-300"
            />
          </a>
          <a href="#home">
            <Image
              src="/B.png"
              alt="B"
              width={55}
              height={55}
              className="w-auto h-8 lg:h-10 hover:scale-110 transition-transform duration-300"
            />
          </a>
        </div>

        {/* Navigation Menu */}
        <ul className="flex flex-col gap-8 text-white font-mono text-base lg:text-md items-center flex-1 justify-center">
          <li>
            <a href="#home" className="hover:text-[#00E5FF] transition-colors hover:scale-105">
              Home
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-[#00E5FF] transition-colors hover:scale-105">
              About
            </a>
          </li>
          <li>
            <a href="#services" className="hover:text-[#00E5FF] transition-colors hover:scale-105">
              Services
            </a>
          </li>
          <li>
            <a href="#projects" className="hover:text-[#00E5FF] transition-colors hover:scale-105">
              Category
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-[#00E5FF] transition-colors hover:scale-105">
              Contact
            </a>
          </li>
        </ul>
      </nav>

      {/* Modern Mobile Navbar */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50">
        {/* Glassmorphism Top Bar */}
        <div className="bg-black/20 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
          <div className="flex items-center justify-between px-6 py-5">
            {/* Enhanced Mobile Logo */}
            <div className="flex items-center gap-1 group">
              <div className="relative">
                <div className="absolute inset-0 bg-[#00E5FF]/20 rounded-full blur-lg group-hover:bg-[#00E5FF]/40 transition-all duration-300"></div>
                <Image 
                  src="/S.png" 
                  alt="S" 
                  width={32} 
                  height={32} 
                  className="relative w-auto h-7 group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-[#00E5FF]/20 rounded-full blur-lg group-hover:bg-[#00E5FF]/40 transition-all duration-300"></div>
                <Image 
                  src="/B.png" 
                  alt="B" 
                  width={36} 
                  height={36} 
                  className="relative w-auto h-7 group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
            </div>

            {/* Modern Hamburger Menu */}
            <button
              type="button"
              onClick={toggleMenu}
              className="relative w-12 h-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
              aria-label="Toggle menu"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00E5FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center justify-center space-y-1">
                <span
                  className={`block h-0.5 w-5 bg-white transition-all duration-500 ease-out ${
                    isMenuOpen ? "rotate-45 translate-y-1.5 bg-[#00E5FF]" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-white transition-all duration-300 ease-out ${
                    isMenuOpen ? "opacity-0 scale-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-white transition-all duration-500 ease-out ${
                    isMenuOpen ? "-rotate-45 -translate-y-1.5 bg-[#00E5FF]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Overlay */}
        <div
          className={`fixed inset-0 transition-all duration-500 ease-out z-40
          ${isMenuOpen 
            ? "opacity-100 visible pointer-events-auto bg-black/80 backdrop-blur-md" 
            : "opacity-0 invisible pointer-events-none bg-black/0"
          }`}
          onClick={closeMenu}
        />

        {/* Ultra-Modern Slide-out Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50
          bg-gradient-to-br from-black/95 via-black/90 to-black/95
          backdrop-blur-3xl border-l border-white/10 shadow-2xl
          transform transition-all duration-700 ease-out
          ${isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
        >
          {/* Animated Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/5 via-transparent to-[#00E5FF]/5"></div>
            <div className="relative flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-1 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#00E5FF]/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <Image 
                    src="/S.png" 
                    alt="S" 
                    width={28} 
                    height={28} 
                    className="relative w-auto h-7 group-hover:scale-110 transition-transform duration-300" 
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-[#00E5FF]/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <Image 
                    src="/B.png" 
                    alt="B" 
                    width={32} 
                    height={32} 
                    className="relative w-auto h-7 group-hover:scale-110 transition-transform duration-300" 
                  />
                </div>
                <div className="ml-2">
                  <span className="text-white/80 text-sm font-mono tracking-wider">Studio</span>
                </div>
              </div>

              {/* Modern Close Button */}
              <button
                type="button"
                onClick={closeMenu}
                className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#00E5FF]/50 transition-all duration-300 group"
                aria-label="Close menu"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#00E5FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg
                  className="relative w-5 h-5 text-white/70 group-hover:text-[#00E5FF] transition-colors duration-300 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Sophisticated Navigation Menu */}
          <div className="py-4">
            <ul className="space-y-1 px-4">
              {[
                { label: "Home", href: "#home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
                { label: "About", href: "#about", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                { label: "Services", href: "#services", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
                { label: "Category", href: "#projects", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
                { label: "Contact", href: "#contact", icon: "M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
              ].map(({ label, href, icon }, index) => (
                <li
                  key={label}
                  className={`transform transition-all duration-500 ease-out ${
                    isMenuOpen 
                      ? "translate-x-0 opacity-100" 
                      : "translate-x-8 opacity-0"
                  }`}
                  style={{ transitionDelay: isMenuOpen ? `${index * 100}ms` : '0ms' }}
                >
                  <a
                    href={href}
                    onClick={closeMenu}
                    className="group relative flex items-center gap-4 px-4 py-4 rounded-2xl 
                             hover:bg-gradient-to-r hover:from-[#00E5FF]/10 hover:to-transparent
                             border border-transparent hover:border-[#00E5FF]/20
                             transition-all duration-300 overflow-hidden"
                  >
                    {/* Background glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                    
                    {/* Icon */}
                    <div className="relative z-10 w-6 h-6 text-white/60 group-hover:text-[#00E5FF] transition-colors duration-300">
                      <svg
                        className="w-full h-full"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                      </svg>
                    </div>
                    
                    {/* Label */}
                    <span className="relative z-10 text-white/80 font-mono text-base tracking-wide group-hover:text-white transition-colors duration-300">
                      {label}
                    </span>
                    
                    {/* Arrow indicator */}
                    <div className="relative z-10 ml-auto opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      <svg className="w-4 h-4 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-gradient-to-t from-black/50 to-transparent">
            <div className="text-center space-y-3">
              <div className="flex justify-center space-x-4">
                <div className="w-2 h-2 rounded-full bg-[#00E5FF]/60 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-[#00E5FF]/40 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-2 h-2 rounded-full bg-[#00E5FF]/20 animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
              <div className="text-white/40 text-xs font-mono tracking-widest">
                © 2024 SB STUDIO
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Content Spacer */}
      <div className="lg:hidden h-20" />
    </>
  )
}