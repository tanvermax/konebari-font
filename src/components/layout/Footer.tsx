import { Link } from "react-router";
import { Flower2, Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-8 border-t border-stone-800">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-stone-800/80">
          
          {/* Brand Info (Spans 2 columns on Large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 text-stone-100 font-serif text-xl tracking-tight">
              <Flower2 className="h-5 w-5 text-rose-400" />
              <span>Glow & Elegance</span>
            </Link>

            <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
              Your trusted destination for 100% authentic skincare, beauty, and personal care essentials. Pure, dermatologist-approved radiance everyday.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="#" 
                aria-label="Facebook"
                className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="#" 
                aria-label="Instagram"
                className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="#" 
                aria-label="Youtube"
                className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-stone-100 text-xs font-semibold uppercase tracking-wider">Shop & Categories</h4>
            <ul className="space-y-2 text-xs sm:text-sm font-light">
              <li><Link to="/shop?category=skincare" className="hover:text-rose-400 transition-colors">Skincare Care</Link></li>
              <li><Link to="/shop?category=makeup" className="hover:text-rose-400 transition-colors">Makeup Collections</Link></li>
              <li><Link to="/shop?category=hair-care" className="hover:text-rose-400 transition-colors">Hair Care Solutions</Link></li>
              <li><Link to="/shop?category=fragrance" className="hover:text-rose-400 transition-colors">Fragrances & Perfumes</Link></li>
              <li><Link to="/shop?sort=new" className="hover:text-rose-400 transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-stone-100 text-xs font-semibold uppercase tracking-wider">Help & Information</h4>
            <ul className="space-y-2 text-xs sm:text-sm font-light">
              <li><Link to="/about" className="hover:text-rose-400 transition-colors">About Our Story</Link></li>
              <li><Link to="/faq" className="hover:text-rose-400 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/shipping" className="hover:text-rose-400 transition-colors">Shipping & Delivery Info</Link></li>
              <li><Link to="/returns" className="hover:text-rose-400 transition-colors">Return Policy</Link></li>
              <li><Link to="/privacy" className="hover:text-rose-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-stone-100 text-xs font-semibold uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-light text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-rose-400 shrink-0" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-rose-400 shrink-0" />
                <span>support@glowelegance.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Footer: Copyright & Payments */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-stone-400">
          <p>© {new Date().getFullYear()} Glow & Elegance. All rights reserved.</p>
          
          <div className="flex items-center gap-2 text-[11px]">
            <span className="bg-stone-800 px-2.5 py-1 rounded border border-stone-700/60">bKash</span>
            <span className="bg-stone-800 px-2.5 py-1 rounded border border-stone-700/60">Nagad</span>
            <span className="bg-stone-800 px-2.5 py-1 rounded border border-stone-700/60">Cash on Delivery</span>
          </div>
        </div>

      </div>
    </footer>
  );
} 