// components/layout/Brands/BrandCard.tsx
import { Link } from "react-router";
import { Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface BrandCardProps {
  brand: {
    _id?: string;
    name: string;
    slug?: string;
    logo?: string;
    image?: string;
    count?: number;
    totalStock?: number;
    minPrice?: number;
    maxPrice?: number;
  };
}

const getInitials = (name: string) => {
  if (!name) return "?";
  const words = name.trim().split(" ");
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function BrandCard({ brand }: BrandCardProps) {
  const initials = getInitials(brand.name);
  const logoUrl = brand.logo || brand.image;
  const brandParam = brand.slug || brand.name;

  return (
    <Link
      to={`/shop?brand=${encodeURIComponent(brandParam)}`}
      className="group block h-full"
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="relative flex flex-col items-center h-full bg-white dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 hover:shadow-md transition-all duration-300 overflow-hidden"
      >
        <div className="p-6 w-full flex flex-col items-center flex-1">
          
          {/* Logo / Initials Area */}
          <div className="relative mb-4">
            {logoUrl ? (
              <div className="w-20 h-20 rounded-full overflow-hidden border border-stone-100 dark:border-stone-800  dark:bg-stone-900 flex items-center justify-center p-3 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={logoUrl}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-stone-700 dark:text-stone-300 font-semibold text-xl group-hover:scale-105 transition-transform duration-300">
                {initials}
              </div>
            )}
          </div>

          {/* Brand Info */}
          <div className="text-center flex-1 flex flex-col items-center w-full">
            <h3
              className="text-sm font-semibold text-stone-800 dark:text-stone-200 line-clamp-1 leading-snug px-2"
              title={brand.name}
            >
              {brand.name}
            </h3>

            {/* Product Count (Minimal text) */}
            {typeof brand.count === "number" && brand.count > 0 && (
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1">
                <Package className="w-3 h-3" />
                {brand.count} Items
              </p>
            )}
          </div>

          {/* Minimal Hover CTA */}
          <div className="mt-4 flex items-center justify-center gap-1 text-[11px] font-medium text-stone-400 dark:text-stone-500 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors w-full">
            <span>View Products</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
          
        </div>
      </motion.div>
    </Link>
  );
}