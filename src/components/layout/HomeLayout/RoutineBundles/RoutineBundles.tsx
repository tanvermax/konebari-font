import { motion } from "framer-motion";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ShieldCheck, Truck, Clock, Heart } from "lucide-react";

const bundles = [
  {
    id: "glass-skin-kit",
    title: "The Ultimate Glass Skin Ritual",
    subtitle: "3-Step Hydration & Radiance Set",
    price: "৳ 4,200",
    originalPrice: "৳ 5,000",
    savings: "Save ৳ 800",
    badge: "Bestseller Set",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop",
    steps: ["Hydrating Cleanser", "Niacinamide Essence", "Ceramide Cream"],
    tagColor: "bg-rose-500 text-white",
  },
  {
    id: "acne-clarifying-set",
    title: "Pore Refining Clarifying Trio",
    subtitle: "Oil Control & Blemish Care",
    price: "৳ 3,850",
    originalPrice: "৳ 4,500",
    savings: "Save ৳ 650",
    badge: "Derm Approved",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop",
    steps: ["Salicylic Cleanser", "BHA Power Liquid", "Centella Soothing Gel"],
    tagColor: "bg-emerald-600 text-white",
  },
  {
    id: "youth-glow-routine",
    title: "Overnight Youth Restoration Kit",
    subtitle: "Anti-Aging & Collagen Booster",
    price: "৳ 5,100",
    originalPrice: "৳ 6,000",
    savings: "Save ৳ 900",
    badge: "Limited Edition",
    image: "https://images.unsplash.com/photo-1512290900673-1f198f1a4e10?w=600&auto=format&fit=crop",
    steps: ["Peptide Serum", "Retinol Night Cream", "Firming Eye Balm"],
    tagColor: "bg-purple-600 text-white",
  },
];

export default function RoutineBundles() {
  return (
    <section className="py-16 sm:py-24 bg-background relative overflow-hidden border-t border-border/40">
      
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-medium border border-rose-100 dark:border-rose-900/40"
          >
            <Sparkles size={13} />
            <span>Complete Care Bundles</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-foreground"
          >
            Curated <span className="italic font-light text-rose-500">Skincare Sets</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-xs sm:text-sm font-light leading-relaxed"
          >
            আলাদা আলাদা প্রোডাক্টের ঝামেলা ছাড়া একসেটে পান সম্পূর্ণ স্কিনকেয়ার সলিউশন— সাথে বিশেষ সেভিংস ডিসকাউন্ট।
          </motion.p>
        </div>

        {/* BUNDLES CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {bundles.map((bundle, index) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className="group rounded-3xl bg-white dark:bg-[#121212] border border-stone-200/70 dark:border-stone-800/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Banner */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-900">
                  <img
                    src={bundle.image}
                    alt={bundle.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Badge */}
                  <span className={`absolute top-4 left-4 text-[10px] uppercase font-semibold tracking-wider px-3 py-1 rounded-full ${bundle.tagColor} shadow-md`}>
                    {bundle.badge}
                  </span>

                  {/* Savings Pill */}
                  <span className="absolute top-4 right-4 text-[11px] font-medium bg-white/90 dark:bg-black/80 backdrop-blur-md text-foreground px-2.5 py-1 rounded-full shadow-sm">
                    {bundle.savings}
                  </span>
                </div>

                {/* Content Details */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-medium text-rose-500 uppercase tracking-wider">
                      {bundle.subtitle}
                    </span>
                    <h3 className="text-lg font-serif font-medium text-foreground group-hover:text-rose-500 transition-colors">
                      {bundle.title}
                    </h3>
                  </div>

                  {/* Steps Included */}
                  <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800/80">
                    <span className="text-[11px] font-medium text-muted-foreground block">
                      Routine Steps Included:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {bundle.steps.map((step, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/80 text-foreground/80 font-normal"
                        >
                          Step {i + 1}: {step}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="p-6 pt-0 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-semibold text-foreground">
                      {bundle.price}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      {bundle.originalPrice}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Free Delivery
                  </span>
                </div>

                <Button
                  asChild
                  className="w-full rounded-2xl bg-slate-900 dark:bg-rose-600 hover:bg-slate-800 dark:hover:bg-rose-700 text-white text-xs font-medium h-11 transition-all"
                >
                  <Link to={`/product/${bundle.id}`} className="flex items-center justify-center gap-2">
                    Claim This Set
                    <ArrowRight size={14} />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* TRUST BADGES BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 sm:p-8 rounded-3xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800/60">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-500 shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground">100% Authentic Korean Products</h4>
              <p className="text-[11px] text-muted-foreground">Directly imported from official distributors</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-500 shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground">Fast Cash on Delivery</h4>
              <p className="text-[11px] text-muted-foreground">24-48 Hours inside Dhaka & all BD</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-500 shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground">7-Day Easy Replacement</h4>
              <p className="text-[11px] text-muted-foreground">Hassle-free return policy guaranteed</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}