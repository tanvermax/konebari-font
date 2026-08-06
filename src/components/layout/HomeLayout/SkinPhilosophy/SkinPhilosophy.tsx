import { motion } from "framer-motion";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, Leaf, HeartHandshake, ArrowRight } from "lucide-react";

export default function SkinPhilosophy() {
  const pillars = [
    {
      icon: Leaf,
      title: "Clean & Skin-Safe",
      desc: "Free from harsh chemicals, parabens, and synthetic toxins. Formulated for delicate skin types.",
      badge: "Pure Formula"
    },
    {
      icon: ShieldCheck,
      title: "100% Authentic Source",
      desc: "Directly imported from official beauty distributors and dermatologically certified labs.",
      badge: "Verified"
    },
    {
      icon: HeartHandshake,
      title: "Ethical & Cruelty-Free",
      desc: "We stand against animal testing. Every single product is ethically sourced with compassion.",
      badge: "Cruelty Free"
    }
  ];

  return (
    <section className="py-16 sm:py-24  relative overflow-hidden">
      
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-200/20 dark:bg-rose-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* Upper Split Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          
          {/* Animated Image Side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl bg-stone-200 dark:bg-stone-800">
              <img 
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop" 
                alt="Natural Skincare Philosophy" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              {/* Floating Badge */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-white/20 dark:border-stone-800"
              >
                <p className="text-xs font-serif italic text-foreground">
                  "True radiance comes from nourishing your natural skin barrier."
                </p>
                <span className="text-[10px] uppercase font-semibold text-rose-500 tracking-wider mt-1 block">
                  — Skin Experts Choice
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Text & Pitch Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/80 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-medium tracking-wide border border-rose-200/50 dark:border-rose-900/30">
              <Sparkles size={13} />
              <span>Our Core Philosophy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-foreground leading-[1.15]">
              Pure Ingredients. <br />
              <span className="italic font-light text-rose-500">Uncompromised Quality.</span>
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed max-w-xl">
              আমরা বিশ্বাস করি সুন্দর ত্বকের চাবিকাঠি সঠিক ও নিরাপদ পরিচর্যায়। আমাদের প্রতিটি প্রোডাক্ট আন্তর্জাতিক মানসম্পন্ন ব্র্যান্ড থেকে সরাসরি সংগৃহীত এবং অ্যালার্জি-টেস্টেড।
            </p>

            <div className="pt-2">
              <Button asChild size="lg" className="rounded-full bg-slate-900 dark:bg-rose-600 hover:bg-slate-800 dark:hover:bg-rose-700 text-white font-normal px-7 text-xs sm:text-sm h-11 shadow-none gap-2">
                <Link to="/about">
                  Learn Our Story <ArrowRight size={15} />
                </Link>
              </Button>
            </div>
          </motion.div>

        </div>

        {/* 3 Pillars Cards (Animated Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 shadow-sm hover:shadow-md transition-all duration-300 relative space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 text-rose-500 shrink-0">
                  <item.icon size={22} />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-stone-100 dark:bg-stone-800/80 px-2.5 py-1 rounded-full">
                  {item.badge}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-medium text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}