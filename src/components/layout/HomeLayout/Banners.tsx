"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Link as RouterLink } from "react-router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// 5/6 টি উচ্চমানের স্কিনকেয়ার ও বিউটি ব্যানার ইমেজ
const bannerSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=1600&auto=format&fit=crop",
    subtitle: "100% Authentic K-Beauty",
    title: "Reveal Your Skin's Natural Radiance",
    description: "আসল কোরিয়ান স্কিনকেয়ার এবং ডার্মাটোলজিস্ট টেস্টেড সিরাম দিয়ে আপনার ত্বককে করুন সজীব।",
    buttonText: "Shop Collection",
    link: "/shop?category=skincare",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&auto=format&fit=crop",
    subtitle: "Hydration Mastery",
    title: "Deep Moisture & Barrier Care",
    description: "শুষ্কতা দূর করে ত্বককে আর্দ্র ও কোমল রাখতে বেছে নিন অ্যাডভান্সড হাইড্রেশন সেট।",
    buttonText: "Explore Serums",
    link: "/shop?concern=hydration",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&auto=format&fit=crop",
    subtitle: "Pure Ingredients",
    title: "Gentle Formula for Sensitive Skin",
    description: "কোনো প্রকার ক্ষতিকারক কেমিক্যাল ছাড়া প্রাকৃতিক নির্যাস থেকে তৈরি বিশ্বমানের প্রসাধনী।",
    buttonText: "Discover Clean Care",
    link: "/shop?sort=bestseller",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1600&auto=format&fit=crop",
    subtitle: "Spotless Glow",
    title: "Targeted Anti-Acne & Dark Spot Care",
    description: "ব্রণ ও ত্বকের যেকোনো দাগ দূর করার জন্য বিশেষ ফর্মুলেটেড ডার্মাটোলজি সলিউশন।",
    buttonText: "View Acne Care",
    link: "/shop?concern=acne-care",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1512290900673-1f198f1a4e10?w=1600&auto=format&fit=crop",
    subtitle: "Exclusive Bundles",
    title: "Glass Skin Ritual 3-Step Routine",
    description: "কমপ্লিট স্কিনকেয়ার রুটিন সেটে উপভোগ করুন ২০% পর্যন্ত নিশ্চিত ডিসকাউন্ট।",
    buttonText: "Claim Bundle",
    link: "/shop?category=bundles",
  },
];

export default function HeroBanner() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  // Autoplay Plugin setup (3 Seconds = 3000ms delay)
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="container mx-auto px-4 md:px-8 my-4">
      <div className="relative rounded-3xl overflow-hidden border border-stone-200/60 dark:border-stone-800/60 shadow-lg bg-stone-900">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {bannerSlides.map((slide) => (
              <CarouselItem key={slide.id} className="relative">
                {/* Hero Slide Container */}
                <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] w-full overflow-hidden">
                  
                  {/* Background Image */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center transition-transform duration-1000 scale-105"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/50 to-transparent" />

                  {/* Banner Content */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="px-6 sm:px-12 lg:px-16 max-w-xl space-y-3 sm:space-y-4">
                      
                      {/* Subtitle Badge */}
                      <motion.div
                        key={`sub-${current}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-medium tracking-wider uppercase backdrop-blur-md"
                      >
                        <Sparkles size={12} className="text-rose-400" />
                        <span>{slide.subtitle}</span>
                      </motion.div>

                      {/* Main Title */}
                      <motion.h1
                        key={`title-${current}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-2xl sm:text-4xl lg:text-5xl font-serif text-white leading-tight font-medium"
                      >
                        {slide.title}
                      </motion.h1>

                      {/* Description */}
                      <motion.p
                        key={`desc-${current}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed line-clamp-2"
                      >
                        {slide.description}
                      </motion.p>

                      {/* CTA Button */}
                      <motion.div
                        key={`btn-${current}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="pt-2"
                      >
                        <Button
                          asChild
                          className="rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium px-6 h-10 shadow-lg shadow-rose-600/30 gap-2 border-0"
                        >
                          <RouterLink to={slide.link}>
                            {slide.buttonText}
                            <ArrowRight size={14} />
                          </RouterLink>
                        </Button>
                      </motion.div>

                    </div>
                  </div>

                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Custom Slide Indicators (Dots) */}
        <div className="absolute bottom-5 right-6 sm:right-10 z-20 flex items-center gap-2">
          {bannerSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => api?.scrollTo(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === idx
                  ? "w-7 bg-rose-500"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}