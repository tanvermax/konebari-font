// components/layout/HomeLayout/Footer/Footer.tsx
import { Link } from "react-router";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import Logo from "@/assets/icons/logo";

// ============================================
// ✅ REAL PAYMENT LOGO SVG ICONS
// ============================================

const BkashLogo = () => (
  <svg viewBox="0 0 60 32" className="h-7 w-auto" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="32" rx="4" fill="#E2136E" />
    <text x="30" y="21" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900" fontFamily="Arial, sans-serif" fontStyle="italic">
      bKash
    </text>
  </svg>
);

const NagadLogo = () => (
  <svg viewBox="0 0 60 32" className="h-7 w-auto" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="32" rx="4" fill="#F6921E" />
    <text x="30" y="21" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900" fontFamily="Arial, sans-serif">
      Nagad
    </text>
  </svg>
);

const RocketLogo = () => (
  <svg viewBox="0 0 60 32" className="h-7 w-auto" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="32" rx="4" fill="#8C3494" />
    {/* Rocket flame icon */}
    <path d="M12 20 L16 10 L20 20 L16 17 Z" fill="#FFD200" />
    <text x="36" y="21" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900" fontFamily="Arial, sans-serif">
      Rocket
    </text>
  </svg>
);

const UpayLogo = () => (
  <svg viewBox="0 0 60 32" className="h-7 w-auto" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="32" rx="4" fill="#FDB913" />
    <text x="30" y="21" textAnchor="middle" fill="#1A1A1A" fontSize="13" fontWeight="900" fontFamily="Arial, sans-serif">
      upay
    </text>
  </svg>
);

const VisaLogo = () => (
  <svg viewBox="0 0 60 32" className="h-7 w-auto" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="32" rx="4" fill="#fff" stroke="#E5E7EB" />
    <text x="30" y="21" textAnchor="middle" fill="#1A1F71" fontSize="15" fontWeight="900" fontFamily="Arial, sans-serif" fontStyle="italic" letterSpacing="1">
      VISA
    </text>
    {/* Visa yellow stripe accent */}
    <path d="M48 8 L52 8 L52 10 L48 10 Z" fill="#F7B600" />
  </svg>
);

const MastercardLogo = () => (
  <svg viewBox="0 0 60 32" className="h-7 w-auto" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="32" rx="4" fill="#fff" stroke="#E5E7EB" />
    {/* Two circles overlapping */}
    <circle cx="24" cy="16" r="8" fill="#EB001B" />
    <circle cx="36" cy="16" r="8" fill="#F79E1B" />
    <path d="M30 9 A8 8 0 0 1 30 23 A8 8 0 0 1 30 9" fill="#FF5F00" />
  </svg>
);

const AmexLogo = () => (
  <svg viewBox="0 0 60 32" className="h-7 w-auto" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="32" rx="4" fill="#006FCF" />
    <text x="30" y="14" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif">
      AMERICAN
    </text>
    <text x="30" y="25" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif">
      EXPRESS
    </text>
  </svg>
);

const CodLogo = () => (
  <svg viewBox="0 0 60 32" className="h-7 w-auto" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="32" rx="4" fill="#059669" />
    {/* Cash icon */}
    <rect x="6" y="10" width="10" height="8" rx="1" fill="none" stroke="#fff" strokeWidth="1" />
    <text x="30" y="21" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800" fontFamily="Arial, sans-serif">
      COD
    </text>
  </svg>
);

// ✅ All payment methods
const paymentMethods = [
  { name: "bKash", component: BkashLogo },
  { name: "Nagad", component: NagadLogo },
  { name: "Rocket", component: RocketLogo },
  { name: "Upay", component: UpayLogo },
  { name: "Visa", component: VisaLogo },
  { name: "Mastercard", component: MastercardLogo },
  { name: "American Express", component: AmexLogo },
  { name: "Cash on Delivery", component: CodLogo },
];

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-8 border-t border-stone-800">
      <div className="container mx-auto px-4 md:px-8">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-stone-800/80">

          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-stone-100 font-serif text-xl tracking-tight"
            >
              <Logo />
            </Link>

            <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
              Your trusted destination for 100% authentic skincare, beauty, and
              personal care essentials. Pure, dermatologist-approved radiance
              everyday.
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
            <h4 className="text-stone-100 text-xs font-semibold uppercase tracking-wider">
              Shop & Categories
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-light">
              <li>
                <Link
                  to="/shop?category=skincare"
                  className="hover:text-rose-400 transition-colors"
                >
                  Skincare Care
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=makeup"
                  className="hover:text-rose-400 transition-colors"
                >
                  Makeup Collections
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=hair-care"
                  className="hover:text-rose-400 transition-colors"
                >
                  Hair Care Solutions
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=fragrance"
                  className="hover:text-rose-400 transition-colors"
                >
                  Fragrances & Perfumes
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?sort=new"
                  className="hover:text-rose-400 transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-stone-100 text-xs font-semibold uppercase tracking-wider">
              Help & Information
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-light">
              <li>
                <Link
                  to="/about"
                  className="hover:text-rose-400 transition-colors"
                >
                  About Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-rose-400 transition-colors"
                >
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-rose-400 transition-colors"
                >
                  Shipping & Delivery Info
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-rose-400 transition-colors"
                >
                  Return Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-rose-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-stone-100 text-xs font-semibold uppercase tracking-wider">
              Contact Us
            </h4>
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

        {/* ✅ Payment Methods Section */}
        <div className="pt-8 pb-6 border-b border-stone-800/80">
          <div className="flex flex-col gap-4">
            <h4 className="text-stone-100 text-xs font-semibold uppercase tracking-wider flex items-center gap-3">
              <span>Secure Payment Methods</span>
              <span className="h-px bg-stone-700 flex-1 max-w-[120px]" />
            </h4>

            <div className="flex flex-wrap items-center gap-2.5">
              {paymentMethods.map((method) => {
                const IconComponent = method.component;
                return (
                  <div
                    key={method.name}
                    title={method.name}
                    className="hover:scale-105 hover:-translate-y-0.5 transition-all duration-200 cursor-default drop-shadow-md"
                  >
                    <IconComponent />
                  </div>
                );
              })}
            </div>

            <p className="text-stone-500 text-[10px] mt-1 flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-emerald-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              100% Secure SSL Encrypted Payment · Powered by SSLCommerz
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-stone-400">
          <p>
            © {new Date().getFullYear()} Glow & Elegance. All rights reserved.
          </p>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SSLCommerz Verified Merchant
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}