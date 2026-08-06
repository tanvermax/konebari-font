import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Droplets, 
  Sun, 
  ShieldAlert, 
  SmilePlus, 
  ArrowUpRight 
} from "lucide-react";

// Interactive Skin Concerns & Solution Collections
const skinGoals = [
  {
    id: "hydration",
    icon: Droplets,
    label: "Dry & Dehydrated",
    tagline: "Deep Moisture & Barrier Repair",
    description: "শুষ্ক ও প্রাণহীন ত্বকে ফিরিয়ে আনুন হাইড্রেশনের জাদুকরী ছোঁয়া। আমাদের ময়েশ্চার লক টেকনোলজি দেয় দীর্ঘস্থায়ী আর্দ্রতা।",
    featuredProducts: [
      { name: "Hyaluronic Acid Serum", price: "৳ 1,450", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop" },
      { name: "Ceramide Moisture Cream", price: "৳ 1,850", image: "https://images.unsplash.com/photo-1608248597262-2f3b92cb33f3?w=400&auto=format&fit=crop" },
    ],
    link: "/shop?concern=dry-skin",
    bgAccent: "from-sky-500/10 via-blue-500/5 to-transparent",
  },
  {
    id: "brightening",
    icon: Sun,
    label: "Dullness & Pigmentation",
    tagline: "Glow & Tone Correcting",
    description: "ব্রণ বা রোদে পোড়া দাগ দূর করে ত্বককে এক টোনে উজ্জ্বল ও দীপ্তিময় করে তুলতে সি-ভিটামিন এবং নিয়াসিনামাইড সমাধান।",
    featuredProducts: [
      { name: "Pure Vitamin C 21.5 Serum", price: "৳ 1,950", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop" },
      { name: "Niacinamide Glow Essence", price: "৳ 1,600", image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400&auto=format&fit=crop" },
    ],
    link: "/shop?concern=brightening",
    bgAccent: "from-amber-500/10 via-orange-500/5 to-transparent",
  },
  {
    id: "acne",
    icon: ShieldAlert,
    label: "Acne & Pore Control",
    tagline: "Gentle Clarifying Care",
    description: "তৈলাক্ত ও ব্রণপ্রবণ ত্বকের অতিরিক্ত সেবাম নিয়ন্ত্রণ করে পোরস পরিষ্কার রাখতে ডার্মাটোলজিস্ট টেস্টেড জেন্টল ফর্মুলা।",
    featuredProducts: [
      { name: "BHA Blackhead Power Liquid", price: "৳ 1,550", image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&auto=format&fit=crop" },
      { name: "Tea Tree Spot Treatment Gel", price: "৳ 990", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&auto=format&fit=crop" },
    ],
    link: "/shop?concern=acne-care",
    bgAccent: "from-emerald-500/10 via-teal-500/5 to-transparent",
  },
  {
    id: "anti-aging",
    icon: SmilePlus,
    label: "Fine Lines & Firming",
    tagline: "Youthful Skin Elasticity",
    description: "ত্বকের বয়সের ছাপ প্রতিরোধে এবং কোলাজেন বৃদ্ধিতে কাজ করে আমাদের পেপটাইড ও রেটিনল সমৃদ্ধ অ্যাডভান্সড স্কিন কেয়ার।",
    featuredProducts: [
      { name: "Retinol 0.2% Night Treatment", price: "৳ 2,200", image: "https://images.unsplash.com/photo-1512290900673-1f198f1a4e10?w=400&auto=format&fit=crop" },
      { name: "Peptide Firming Eye Cream", price: "৳ 1,750", image: "https://images.unsplash.com/photo-1567928269937-ae146e45b428?w=400&auto=format&fit=crop" },
    ],
    link: "/shop?concern=anti-aging",
    bgAccent: "from-rose-500/10 via-pink-500/5 to-transparent",
  },
];

export default function SkinGoals() {
  const [activeTab, setActiveTab] = useState(skinGoals[0].id);
  const currentGoal = skinGoals.find((goal) => goal.id === activeTab) || skinGoals[0];

  return (
    <section className="py-16 rounded-3xl sm:py-24 bg-background relative overflow-hidden border-t border-border/40">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(244,63,94,0.06),rgba(255,255,255,0))]" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-medium"
          >
            <Sparkles size={13} className="text-rose-500" />
            <span>Targeted Care</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-foreground"
          >
            Shop By <span className="italic font-light text-rose-500">Skin Concern</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-xs sm:text-sm font-light leading-relaxed"
          >
            আপনার ত্বকের বিশেষ চাহিদার সাথে মানানসই সেরা উপাদান ও ডার্মাটোলজিস্ট টেস্টেড সমাধান বেছে নিন সহজে।
          </motion.p>
        </div>

        {/* Interactive Filter Pills/Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10 sm:mb-12">
          {skinGoals.map((goal) => {
            const Icon = goal.icon;
            const isActive = activeTab === goal.id;

            return (
              <motion.button
                key={goal.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(goal.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-white shadow-lg shadow-rose-500/20"
                    : "bg-stone-100 dark:bg-stone-900 text-muted-foreground hover:bg-stone-200/70 dark:hover:bg-stone-800"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSkinGoalTab"
                    className="absolute inset-0 bg-slate-900 dark:bg-rose-600 rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon size={16} className={isActive ? "text-rose-400 dark:text-stone-200" : "text-stone-500"} />
                <span>{goal.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Dynamic Animated Content Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentGoal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="p-6 sm:p-10 rounded-3xl bg-stone-50/80 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800/60 backdrop-blur-md relative overflow-hidden"
          >
            {/* Dynamic Accent Ambient Light */}
            <div className={`absolute inset-0 bg-gradient-to-r ${currentGoal.bgAccent} pointer-events-none`} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              
              {/* Concern Overview */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">
                  {currentGoal.tagline}
                </span>

                <h3 className="text-2xl sm:text-3xl font-serif text-foreground font-medium">
                  {currentGoal.label} Solutions
                </h3>

                <p className="text-muted-foreground text-xs sm:text-sm font-light leading-relaxed">
                  {currentGoal.description}
                </p>

                <div className="pt-2">
                  <Button
                    asChild
                    className="rounded-full bg-slate-900 dark:bg-rose-600 hover:bg-slate-800 dark:hover:bg-rose-700 text-white text-xs font-normal h-10 px-6 gap-2 shadow-none group"
                  >
                    <Link to={currentGoal.link}>
                      Explore Full Routine
                      <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Handpicked Products Mini Grid */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentGoal.featuredProducts.map((product, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -4 }}
                    className="flex items-center gap-4 p-3.5 rounded-2xl bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 shadow-sm transition-all"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900 shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-xs font-medium text-foreground truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                        {product.price}
                      </p>
                      <span className="inline-block text-[10px] text-muted-foreground hover:underline cursor-pointer">
                        View Item →
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}