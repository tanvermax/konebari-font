// components/layout/HomeLayout/Footer/Footer.tsx

import { Link } from "react-router";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, ShieldCheck } from "lucide-react";
import Logo from "@/assets/icons/logo";

// Image Imports
import bikas from "@/assets/icons/BKash-Logo.wine.png";
import nagad from "@/assets/icons/Nagad-Logo.wine.png";
import visa from "@/assets/icons/Visa_Inc.-Logo.wine.png";
import rocket from "@/assets/icons/rocket-color-logo-mobile-banking-icon-free-png.webp";
import americanexp from "@/assets/icons/American-Express-Color.png";
import mastercard from "@/assets/icons/Mastercard-Logo.wine.png";
import cod from "@/assets/icons/pngtree-cash-on-delivery-pin-point-png-image_3342464.jpg";

// ✅ Reusable Payment Method Data List
const paymentMethods = [
  { name: "bKash", logo: bikas },
  { name: "Nagad", logo: nagad },
  { name: "Rocket", logo: rocket },
  { name: "Visa", logo: visa },
  { name: "Mastercard", logo: mastercard },
  { name: "American Express", logo: americanexp },
  { name: "Cash on Delivery", logo: cod },
];

// ✅ Reusable Payment Card Component
interface PaymentCardProps {
  name: string;
  logo: string;
}

const PaymentCard = ({ name, logo }: PaymentCardProps) => {
  return (
    <div
      title={name}
      className="flex items-center justify-center w-12 h-8 p-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700/70 rounded-md shadow-sm hover:shadow-md hover:border-rose-400 dark:hover:border-rose-500 hover:-translate-y-0.5 transition-all duration-200 cursor-default group"
    >
      <img
        src={logo}
        alt={`${name} logo`}
        className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform duration-200"
      />
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 pt-14 pb-8 border-t border-stone-200 dark:border-stone-800 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-stone-200 dark:border-stone-800/80">

          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-stone-900 dark:text-stone-100 font-serif text-xl tracking-tight"
            >
              <Logo />
            </Link>

            <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
              Your trusted destination for 100% authentic skincare, beauty, and
              personal care essentials. Pure, dermatologist-approved radiance
              everyday.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                aria-label="Facebook"
                className="p-2 rounded-full bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="p-2 rounded-full bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                aria-label="Youtube"
                className="p-2 rounded-full bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-stone-900 dark:text-stone-100 text-xs font-semibold uppercase tracking-wider">
              Shop & Categories
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-light">
              <li>
                <Link to="/shop?category=skincare" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                  Skincare Care
                </Link>
              </li>
              <li>
                <Link to="/shop?category=makeup" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                  Makeup Collections
                </Link>
              </li>
              <li>
                <Link to="/shop?category=hair-care" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                  Hair Care Solutions
                </Link>
              </li>
              <li>
                <Link to="/shop?category=fragrance" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                  Fragrances & Perfumes
                </Link>
              </li>
              <li>
                <Link to="/shop?sort=new" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-stone-900 dark:text-stone-100 text-xs font-semibold uppercase tracking-wider">
              Help & Information
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-light">
              <li>
                <Link to="/about" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                  About Our Story
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                  Shipping & Delivery Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-stone-900 dark:text-stone-100 text-xs font-semibold uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-light text-stone-600 dark:text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-rose-500 dark:text-rose-400 shrink-0" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-rose-500 dark:text-rose-400 shrink-0" />
                <span>contact@konebari.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ✅ Reusable Payment Methods Section */}
        <div className="pt-8 pb-6 border-b border-stone-200 dark:border-stone-800/80">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-stone-900 dark:text-stone-100 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>100% Secure Payment Gateways</span>
              </h4>
              <span className="h-px bg-stone-300 dark:bg-stone-800 flex-1 hidden sm:block" />
            </div>

            {/* Render Cards Cleanly */}
            <div className="flex flex-wrap items-center gap-2.5">
              {paymentMethods.map((method) => (
                <PaymentCard
                  key={method.name}
                  name={method.name}
                  logo={method.logo}
                />
              ))}
            </div>

            <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-1 flex items-center gap-1.5 font-light">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Encrypted SSL Gateway Connection · Powered by SSLCommerz
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-stone-500 dark:text-stone-400">
          <p>© {new Date().getFullYear()} KONEBARI. All rights reserved.</p>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5">
              developed by{" "}
              <a
                href="https://portfolio-e021a.web.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-500 dark:text-rose-400 hover:underline font-medium transition-colors"
              >
                Shafayet Hossain
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}