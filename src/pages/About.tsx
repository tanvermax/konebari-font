// pages/About/About.tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router";
import {
  Sparkles,
  ShieldCheck,
  Heart,
  Truck,
  Star,
  ArrowRight,
  Award,
  Users,
  Package,
  Globe,
  Leaf,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================
// ✅ DATA
// ============================================
const stats = [
  { value: "50K+", label: "Happy Customers", icon: Users },
  { value: "500+", label: "Premium Products", icon: Package },
  { value: "4.9", label: "Average Rating", icon: Star },
  { value: "99%", label: "Satisfaction Rate", icon: Heart },
];

const values = [
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    description:
      "Every product is sourced directly from official brands and verified before it reaches you.",
  },
  {
    icon: Leaf,
    title: "Clean Beauty",
    description:
      "We curate products free from harmful chemicals — dermatologist-tested and safe for every skin type.",
  },
  {
    icon: Heart,
    title: "Customer First",
    description:
      "From ordering to delivery, your satisfaction is our priority. Real human support, always.",
  },
  {
    icon: Globe,
    title: "Global Standards",
    description:
      "We bring world-class K-beauty and luxury skincare from Korea, France, and the USA to Bangladesh.",
  },
];

const milestones = [
  { year: "2020", title: "The Beginning", description: "Started with just 10 products and a dream to make authentic beauty accessible." },
  { year: "2022", title: "Growing Community", description: "Reached 10,000+ happy customers across Bangladesh and expanded our collection." },
  { year: "2024", title: "Authorized Partner", description: "Became an official partner for multiple international beauty and jewelry brands." },
  { year: "2026", title: "The Future", description: "Aiming to become Bangladesh's most trusted online beauty destination." },
];

// ============================================
// ✅ ANIMATION VARIANTS
// ============================================
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
} as any;

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // ✅ Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <div className="bg-white dark:bg-[#0A0A0A] text-foreground overflow-x-hidden">

      {/* ============================================
          HERO SECTION — Apple-style fullscreen
         ============================================ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated background gradient */}
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-rose-50 to-purple-100 dark:from-stone-950 dark:via-rose-950/20 dark:to-purple-950/30" />
          
          {/* Floating orbs */}
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-rose-300/20 dark:bg-rose-500/10 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-300/20 dark:bg-purple-500/10 blur-3xl"
          />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 container mx-auto px-4 text-center max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 text-xs font-medium mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Our Story</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-medium tracking-tighter leading-[0.95] mb-6"
          >
            Beauty,{" "}
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 bg-clip-text text-transparent italic font-light">
              redefined.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light"
          >
            We're on a mission to make 100% authentic, world-class beauty
            accessible to every person in Bangladesh — no compromises, no fakes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/shop">
              <Button className="h-12 px-8 rounded-full bg-foreground hover:bg-foreground/90 text-background text-sm font-medium gap-2 group">
                Explore Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/help">
              <Button
                variant="outline"
                className="h-12 px-8 rounded-full text-sm font-medium border-border/60 hover:bg-accent"
              >
                Talk to Us
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 rounded-full bg-muted-foreground/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================
          STATS SECTION
         ============================================ */}
      <section className="py-20 md:py-32 bg-stone-50 dark:bg-stone-950/50 border-y border-border/40">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  className="text-center group"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-500/10 to-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-rose-500" />
                  </div>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium tracking-tight mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============================================
          STORY SECTION — Big Typography
         ============================================ */}
      <section className="py-24 md:py-40 relative">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-rose-500"
            >
              The Beginning
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight leading-[1.05]"
            >
              We started with a{" "}
              <span className="italic font-light text-muted-foreground">
                simple belief
              </span>{" "}
              — that authentic beauty should never be a luxury.
            </motion.h2>

            <motion.div
              variants={fadeUp}
              className="grid md:grid-cols-2 gap-8 md:gap-12 pt-8"
            >
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground font-light">
                In a market flooded with fakes and counterfeit products, we saw
                people losing trust in the beauty industry. Skincare routines
                ruined. Money wasted. Hope lost.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground font-light">
                So we built something different. A place where every single
                product is verified, every brand is authorized, and every
                customer is treated like family.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          VALUES SECTION
         ============================================ */}
      <section className="py-24 md:py-32 bg-stone-50 dark:bg-stone-950/50 border-y border-border/40">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4"
            >
              What We Stand For
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-5xl md:text-6xl font-serif font-medium tracking-tight"
            >
              Our core values
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          >
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="group p-8 md:p-10 rounded-3xl bg-white dark:bg-stone-900/50 border border-border/40 hover:border-rose-200/60 dark:hover:border-rose-900/40 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif font-medium mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-light">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============================================
          TIMELINE SECTION
         ============================================ */}
      <section className="py-24 md:py-40">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4"
            >
              Our Journey
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-5xl md:text-6xl font-serif font-medium tracking-tight"
            >
              Milestones that shaped us
            </motion.h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-rose-500 via-pink-500 to-purple-500 opacity-30" />

            <div className="space-y-10 md:space-y-16">
              {milestones.map((milestone, idx) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 ring-4 ring-background z-10" />

                  {/* Content */}
                  <div className={`pl-12 md:pl-0 md:w-1/2 ${idx % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className="inline-block px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 text-[11px] font-bold uppercase tracking-wider mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif font-medium mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light">
                      {milestone.description}
                    </p>
                  </div>

                  {/* Spacer for alternate */}
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          MISSION QUOTE SECTION
         ============================================ */}
      <section className="py-24 md:py-40 bg-gradient-to-br from-stone-100 via-rose-50 to-purple-100 dark:from-stone-950 dark:via-rose-950/20 dark:to-purple-950/30 border-y border-border/40 relative overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-96 h-96 rounded-full bg-rose-300/20 dark:bg-rose-500/5 blur-3xl"
        />

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center space-y-8"
          >
            <motion.div variants={fadeUp} className="flex justify-center">
              <Award className="w-16 h-16 text-rose-500" />
            </motion.div>

            <motion.blockquote
              variants={fadeUp}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-tight leading-tight"
            >
              "Our mission is simple:{" "}
              <span className="italic font-light text-rose-600">
                no fake products, no false promises, no compromise on quality.
              </span>{" "}
              Just authentic beauty — delivered with love."
            </motion.blockquote>

            <motion.div variants={fadeUp} className="pt-4">
              <p className="text-sm font-semibold">The Konnebari Team</p>
              <p className="text-xs text-muted-foreground mt-1">
                Founder & CEO
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          FINAL CTA
         ============================================ */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-5xl md:text-6xl font-serif font-medium tracking-tight"
            >
              Ready to glow?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto font-light"
            >
              Explore our curated collection of authentic beauty products —
              trusted by 50,000+ customers across Bangladesh.
            </motion.p>
            <motion.div variants={fadeUp} className="pt-4">
              <Link to="/shop">
                <Button className="h-14 px-10 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-base font-medium gap-2 group shadow-xl shadow-rose-500/25">
                  Shop Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          FEATURES STRIP
         ============================================ */}
      <section className="py-12 border-t border-border/40 bg-stone-50 dark:bg-stone-950/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { icon: Truck, title: "Fast Delivery", desc: "1-3 days nationwide" },
              { icon: ShieldCheck, title: "100% Authentic", desc: "Brand authorized" },
              { icon: CheckCircle2, title: "7-Day Returns", desc: "No questions asked" },
              { icon: Heart, title: "Real Support", desc: "9AM - 9PM daily" },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  className="flex items-center gap-3"
                >
                  <div className="p-2.5 rounded-full bg-white dark:bg-stone-800 text-rose-500 flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium">{f.title}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}