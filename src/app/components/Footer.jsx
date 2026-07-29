import React from "react";
import { Instagram, Facebook, Phone, Mail } from "lucide-react";

function Footer() {
  return (
    <footer className="w-full bg-black text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Footer Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              SerandiByte
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed">
              Innovative technology solutions for modern businesses.
              Building powerful digital experiences that help brands grow.
            </p>
          </div>


          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">
              Get in Touch
            </h4>

            <div className="space-y-3">

              <a
                href="tel:+94766124847"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition duration-300"
              >
                <Phone size={18} />
                <span className="text-sm">
                  +94 (76) 612 4847
                </span>
              </a>


              <a
                href="mailto:hello@serandibyte.com"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition duration-300"
              >
                <Mail size={18} />
                <span className="text-sm">
                  hello@serandibyte.com
                </span>
              </a>

            </div>
          </div>


          {/* Social Media */}
          <div className="space-y-4">

            <h4 className="text-lg font-semibold">
              Follow Us
            </h4>


            <div className="flex gap-4">

              {/* Instagram */}
              <a
  href="https://www.instagram.com/serandibyte/"
  target="_blank"
  rel="noopener noreferrer"
  className="relative z-10 cursor-pointer group"
>
  <div
    className="
      w-11 h-11
      bg-gray-800
      rounded-full
      flex
      items-center
      justify-center
      transition-all
      duration-300
      group-hover:bg-gradient-to-r
      group-hover:from-purple-500
      group-hover:to-pink-500
      group-hover:scale-110
    "
  >
    <Instagram size={21} />
                </div>
              </a>


              {/* Facebook */}
              <a
  href="https://www.facebook.com/SerandiByte.Technology"
  target="_blank"
  rel="noopener noreferrer"
  className="relative z-10 cursor-pointer group"
>
  <div
    className="
      w-11 h-11
      bg-gray-800
      rounded-full
      flex
      items-center
      justify-center
      transition-all
      duration-300
      group-hover:bg-blue-600
      group-hover:scale-110
    "
  >
    <Facebook size={21} />
                </div>
              </a>

            </div>


            <p className="text-xs text-gray-400">
              Stay connected with our latest updates.
            </p>

          </div>

        </div>


        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6">

          <div className="
            flex 
            flex-col 
            md:flex-row 
            justify-between 
            items-center 
            gap-4
          ">

            <p className="text-sm text-gray-400">
              © 2026 SerandiByte. All rights reserved.
            </p>


            <div className="flex gap-6 text-xs text-gray-400">

              <a
                href="#"
                className="hover:text-white transition duration-300"
              >
                Privacy Policy
              </a>


              <a
                href="#"
                className="hover:text-white transition duration-300"
              >
                Terms of Service
              </a>

            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;