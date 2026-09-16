// components/layout/Brands/BrandCard.tsx
import { Link } from "react-router";
import { Package, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BrandCardProps {
  brand: {
    name: string;
    count: number;
    totalStock?: number;
    image?: string;
    minPrice?: number;
    maxPrice?: number;
  };
}

// ✅ Brand name → color gradient
const getBrandGradient = (name: string) => {
  const gradients = [
    "from-rose-400 to-pink-500",
    "from-purple-400 to-pink-500",
    "from-blue-400 to-cyan-500",
    "from-emerald-400 to-green-500",
    "from-amber-400 to-orange-500",
    "from-indigo-400 to-purple-500",
    "from-pink-400 to-rose-500",
    "from-teal-400 to-cyan-500",
  ];
  const idx = name.charCodeAt(0) % gradients.length;
  return gradients[idx];
};

// ✅ Brand name → 2 letter initials
const getInitials = (name: string) => {
  if (!name) return "?";
  const words = name.trim().split(" ");
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function BrandCard({ brand }: BrandCardProps) {
  const gradient = getBrandGradient(brand.name);
  const initials = getInitials(brand.name);

  return (
    <Link
      to={`/shop?brand=${encodeURIComponent(brand.name)}`}
      className="block group"
    >
      <Card className="overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:shadow-lg hover:border-rose-200/60 dark:hover:border-rose-900/40 p-5 flex flex-col items-center text-center">

        {/* Logo / Initials */}
        <div className="relative mb-3">
          {brand.image ? (
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-rose-100 dark:border-rose-900/40 bg-white shadow-sm group-hover:scale-105 transition-transform">
              <img
                src={brand.image}
                alt={brand.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          ) : (
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform`}
            >
              {initials}
            </div>
          )}

          {/* Count badge */}
          {brand.count > 0 && (
            <Badge className="absolute -bottom-1 -right-1 bg-rose-500 text-white border-2 border-background rounded-full text-[10px] font-bold px-1.5 min-w-[24px] h-[24px] flex items-center justify-center">
              {brand.count}
            </Badge>
          )}
        </div>

        {/* Brand Name */}
        <h3
          className="text-sm font-semibold text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-2 min-h-[36px] leading-snug"
          title={brand.name}
        >
          {brand.name}
        </h3>

        {/* Product Count */}
        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
          <Package className="w-3 h-3" />
          {brand.count} {brand.count === 1 ? "product" : "products"}
        </p>

        {/* Price Range (optional) */}
        {brand.minPrice !== undefined && brand.maxPrice !== undefined && (
          <p className="text-[10px] text-muted-foreground mt-0.5">
            ৳{brand.minPrice.toLocaleString()} - ৳
            {brand.maxPrice.toLocaleString()}
          </p>
        )}

        {/* Hover CTA */}
        <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Shop Now</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </Card>
    </Link>
  );
}