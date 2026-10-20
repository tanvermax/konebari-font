// components/layout/BrandSlider.tsx
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useGetActiveBrandsQuery } from "@/redux/features/brand/brand.api";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrandSlider() {
  const { data: brands = [], isLoading } = useGetActiveBrandsQuery({ limit: 20 });

  // ✅ Ekbaro duplicate kore dao (seamless scroll er jonno)
  const duplicatedLogos = brands.length > 0 ? [...brands, ...brands, ...brands] : [];

  if (isLoading) {
    return (
      <section className="py-12 bg-stone-50 dark:bg-[#0D0D0D] border-y border-border/40 overflow-hidden">
        <div className="container mx-auto px-4 mb-6 text-center">
          <Skeleton className="h-4 w-40 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        <div className="flex gap-12 px-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 flex-shrink-0" />
          ))}
        </div>
      </section>
    );
  }

  if (brands.length === 0) return null;

  return (
    <section className="py-12 bg-stone-50 dark:bg-[#0D0D0D] border-y border-border/40 overflow-hidden">
      <div className="container mx-auto px-4 mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[11px] font-medium tracking-wider uppercase mb-2">
          <Sparkles size={12} />
          <span>Authorized Partners</span>
        </div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Top Cosmetic & Jewellery Brands We Carry
        </h3>
      </div>

      {/* Infinite Seamless Scrolling Container */}
      <div className="relative w-full overflow-hidden flex items-center [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <motion.div
          className="flex items-center gap-12 sm:gap-16 whitespace-nowrap w-max"
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: Math.max(15, brands.length * 2), // ব্র্যান্ড সংখ্যা অনুযায়ী গতি
          }}
        >
          {duplicatedLogos.map((brand, index) =>
           (
            <div
              key={`${brand._id}-${index}`}
              className="flex items-center justify-center opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-110 cursor-pointer px-4">
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-7 sm:h-9 w-auto max-w-[120px] object-contain dark:invert"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}