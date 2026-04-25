import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  ShieldCheck,
  Gauge,
  Globe,
  MapPin,
  Clock,
  Music,
  Heart,
  ArrowRight,
  Zap,
  Award,
} from "lucide-react";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";

// Animation Variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.15 } },
};

export default function About() {
  return (
    <div className="py-24 px-4 container mx-auto max-w-6xl space-y-32 overflow-hidden">
      <LocalBusinessSchema />

      {/* 🏎️ Hero Section - Showroom Style */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8 relative"
      >
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full h-64 bg-primary/5 blur-[120px] -z-10" />

        <Badge
          variant="outline"
          className="rounded-full px-6 py-1 border-primary/30 text-primary uppercase tracking-widest text-xs font-bold bg-primary/5"
        >
          Est. 2024 • Dhaka, BD
        </Badge>
        <header className="text-center mb-24">
          <motion.h1
            className="text-5xl md:text-7xl font-black uppercase italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Premium Car Accessories{" "}
            <span className="text-primary">Bangladesh</span>
          </motion.h1>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
            JCS Trading: Your trusted destination for authentic automotive gear,
            feline nutrition, and musical precision tools in Dhaka.
          </p>
        </header>
      </motion.section>

      {/* 🛠️ Category Grid - "Select Your Gear" Style */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <CategoryCard
          icon={<Car className="w-7 h-7" />}
          title="Automotive Excellence"
          description="High-performance interior upgrades and solar-powered aromatics for the elite driver."
          badge="Top Rated"
        />
        <CategoryCard
          icon={<Heart className="w-7 h-7" />}
          title="Feline Care"
          description="Premium nutrition and accessories. Because your co-pilot at home deserves the best."
          badge="Essential"
        />
        <CategoryCard
          icon={<Music className="w-7 h-7" />}
          title="Musical Precision"
          description="Studio-grade accessories to keep your instruments sounding sharp and protected."
          badge="Pro Gear"
        />
      </motion.div>

      {/* 🏁 Mission Section - Performance Focused */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <motion.div
          variants={fadeIn}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tight">
              Our Mission
            </h2>
            <div className="h-1.5 w-24 bg-primary rounded-full" />
          </div>

          <p className="text-muted-foreground text-lg leading-relaxed border-l-4 border-muted pl-6 italic">
            &quot;We realized that modern life is multifaceted. You aren&apos;t
            just a driver; you’re a pet parent and a creator. JCS Trading bridge
            the gap with 100% authenticity.&quot;
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <ShieldCheck />, text: "Quality Tested" },
              { icon: <Zap />, text: "Fast Delivery" },
              { icon: <Award />, text: "100% Authentic" },
              { icon: <Clock />, text: "24/7 Support" },
            ].map((item, index) => (
              <motion.div
                whileHover={{ x: 5 }}
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl border bg-secondary/30 backdrop-blur-sm"
              >
                <span className="text-primary">{item.icon}</span>
                <span className="font-bold text-xs uppercase tracking-tight">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative group"
        >
          <div className="absolute -inset-2 bg-primary/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
          <div className="relative aspect-video rounded-[2rem] overflow-hidden border-4 border-background shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000"
              alt="Luxury Auto Interior"
              className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <p className="text-white font-bold tracking-widest uppercase text-xs">
                The JCS Experience
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 📍 Flagship Store - "Visit the Showroom" */}
      <motion.section
        variants={fadeIn}
        initial="initial"
        whileInView="whileInView"
        className="bg-secondary/50 border rounded-[3rem] p-10 md:p-16 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-primary text-primary-foreground font-bold italic px-4 py-1">
              SHOWROOM
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
              In-Person <br /> Excellence
            </h2>

            <div className="flex gap-6 items-center p-6 bg-background/50 backdrop-blur-md rounded-2xl border shadow-xl">
              <div className="p-4 bg-primary/10 rounded-full text-primary animate-pulse">
                <MapPin className="w-8 h-8" />
              </div>
              <div>
                <p className="font-black text-xl tracking-tight uppercase">
                  Shop 02, Silver Rain Tower
                </p>
                <p className="text-muted-foreground font-medium">
                  Sonirakhra, Dhaka 1362, BD
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-8 bg-background border-2 border-primary/20 rounded-3xl flex items-center justify-between group/time">
              <div className="space-y-1">
                <h4 className="font-black uppercase italic text-sm text-primary">
                  Hours
                </h4>
                <p className="text-2xl font-bold">10:00 - 21:00</p>
              </div>
              <Clock className="w-10 h-10 text-muted-foreground group-hover/time:rotate-45 transition-transform" />
            </div>
            <button className="w-full py-4 bg-foreground text-background rounded-2xl font-black uppercase italic tracking-widest hover:bg-primary transition-colors flex items-center justify-center gap-2">
              Open in Maps <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.section>

      {/* 📈 Stats - Dashboard Style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "5k+", label: "Clients Served", icon: <Car /> },
          { title: "500+", label: "Products", icon: <Gauge /> },
          { title: "100%", label: "Authentic", icon: <ShieldCheck /> },
          { title: "24h", label: "Response", icon: <Globe /> },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="text-center space-y-2 p-10 rounded-[2rem] border-2 border-transparent hover:border-primary/20 hover:bg-muted/50 transition-all"
          >
            <h3 className="text-5xl font-black tracking-tighter text-foreground italic">
              {stat.title}
            </h3>
            <p className="font-bold text-xs uppercase text-primary tracking-[0.2em]">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 🚀 CTA - The "Final Gear" */}
      <motion.section
        whileHover={{ scale: 1.01 }}
        className="relative overflow-hidden bg-foreground text-background rounded-[4rem] p-16 text-center shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none">
            Ready to <br /> Shift Gears?
          </h2>
          <p className="text-lg opacity-70 font-medium">
            Join the community of Bangladeshi enthusiasts driving with JCS
            Trading gear. Authenticity isn&apos;t optional—it&apos;s standard.
          </p>
          <button className="group relative bg-primary mb-5 text-primary-foreground px-12 py-5 rounded-full font-black uppercase italic text-xl tracking-tighter overflow-hidden hover:pr-16 transition-all">
            <span className="relative z-10">Start Your Journey</span>
            <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" />
          </button>
        </div>
        <section className="bg-secondary/30 p-12 rounded-[3rem] border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 italic">
                Visit Our Showroom
              </h2>
              <address className="not-italic space-y-2">
                <p className="font-bold text-xl">Silver Rain Tower, Shop 02</p>
                <p>Sonirakhra, Dhaka 1362, Bangladesh</p>
                <p className="text-primary font-bold">Call: +8801674986600</p>
              </address>
            </div>
            {/* Pro-Tip: Embed a Google Map iframe here for massive Local SEO boost */}
            <div className="w-full h-64 md:h-96 bg-muted rounded-2xl border flex items-center justify-center p-2">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3653.2498596845408!2d90.4507884!3d23.702769799999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b762ac74a6ad%3A0x4d5928bf7d37b11c!2sSilver%20Rain%20Tower!5e0!3m2!1sen!2sbd!4v1777129598802!5m2!1sen!2sbd"
                className="w-full h-full rounded-xl"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map - Silver Rain Tower"
              />
            </div>
          </div>
        </section>
      </motion.section>
    </div>
  );
}

function CategoryCard({
  icon,
  title,
  description,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
}) {
  return (
    <motion.div variants={fadeIn}>
      <Card className="group relative border-2 border-muted hover:border-primary/50 bg-background transition-all duration-500 overflow-hidden rounded-[2.5rem]">
        <CardContent className="p-10 space-y-6">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
              {icon}
            </div>
            <Badge
              variant="outline"
              className="text-[10px] uppercase font-black italic tracking-tighter"
            >
              {badge}
            </Badge>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-muted-foreground font-medium leading-relaxed">
              {description}
            </p>
          </div>

          <div className="pt-4 flex items-center gap-2 text-xs font-black uppercase italic text-muted-foreground group-hover:text-primary transition-colors">
            Explore Collection{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
