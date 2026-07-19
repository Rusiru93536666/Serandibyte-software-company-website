'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [contact, setContact] = useState<any>({});

  useEffect(() => {
    const loadContact = async () => {
      try {
        const response = await fetch('/api/content/contact');
        const data = await response.json();
        if (data.success) {
          setContact(data.data || {});
        }
      } catch {
        setContact({});
      }
    };

    loadContact();
  }, []);

  return (
    <footer className="bg-black/50 backdrop-blur border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-[#00E5FF] mb-4">SerandiByte</h3>
            <p className="text-gray-400 text-sm">
              Innovative technology solutions for the modern world.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-[#00E5FF] transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-[#00E5FF] transition-colors">About</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-[#00E5FF] transition-colors">Services</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-[#00E5FF] transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>{contact.info?.phone || '+94 (77) 584-1916'}</li>
              <li>{contact.info?.email || 'hello@serandibyte.com'}</li>
              <li>{contact.info?.address || 'Colombo, Sri Lanka'}</li>
            </ul>
          </div>
          
      
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
          <p>© 2025 SerandiByte. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}