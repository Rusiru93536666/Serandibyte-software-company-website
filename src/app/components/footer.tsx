import React from 'react'
import { Instagram, Facebook, Phone, Mail } from 'lucide-react'

function Footer() {
  return (
    <div className="w-full">
      <footer className="bg-black text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">SerandiByte</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Innovative technology solutions for the modern world. 
                Building tomorrow s digital experiences today.
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Get in Touch</h4>
              <div className="space-y-3">
                <a 
                  href="tel:+1234567890" 
                  className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <Phone size={18} />
                  <span className="text-sm">+94 (77) 584-1916</span>
                </a>
                <a 
                  href="mailto:hello@serandibyte.com" 
                  className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-200">
                  <Mail size={18} />
                  <span className="text-sm">serandibyte.com</span>
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Follow Us</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://instagram.com/serandibyte" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  aria-label="Follow us on Instagram"
                >
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300">
                    <Instagram size={20} className="text-white" />
                  </div>
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61577339051986" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  aria-label="Follow us on Facebook"
                >
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300">
                    <Facebook size={20} className="text-white" />
                  </div>
                </a>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Stay updated with our latest news and updates
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-400">
                © 2025 SerandiByte. All rights reserved.
              </p>
              <div className="flex space-x-6 text-xs text-gray-400">
                <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer