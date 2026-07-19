'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [brand, setBrand] = useState<any>({});

  useEffect(() => {
    const loadBrand = async () => {
      try {
        const response = await fetch('/api/content/home');
        const data = await response.json();
        if (data.success) {
          setBrand(data.data || {});
        }
      } catch {
        setBrand({});
      }
    };

    loadBrand();
  }, []);

  return (
    <nav className="navbar">
      <div className="container mx-auto px-4">
        <div className="navbar-content flex justify-between items-center py-4">
          <Link href="/" className="logo text-2xl font-bold text-[#00E5FF]">
            {brand.hero?.title || 'SerandiByte'}
          </Link>
          
          <div className="hidden md:flex nav-links gap-8">
            <Link href="/" className="text-gray-300 hover:text-[#00E5FF] transition-colors">Home</Link>
            <Link href="/about" className="text-gray-300 hover:text-[#00E5FF] transition-colors">About</Link>
            <Link href="/services" className="text-gray-300 hover:text-[#00E5FF] transition-colors">Services</Link>
            <Link href="/contact" className="text-gray-300 hover:text-[#00E5FF] transition-colors">Contact</Link>
          </div>
          
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-4">
            <Link href="/" className="text-gray-300 hover:text-[#00E5FF] transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/about" className="text-gray-300 hover:text-[#00E5FF] transition-colors" onClick={() => setIsOpen(false)}>About</Link>
            <Link href="/services" className="text-gray-300 hover:text-[#00E5FF] transition-colors" onClick={() => setIsOpen(false)}>Services</Link>
            <Link href="/contact" className="text-gray-300 hover:text-[#00E5FF] transition-colors" onClick={() => setIsOpen(false)}>Contact</Link>
          </div>
        )}
      </div>
    </nav>
  );
}