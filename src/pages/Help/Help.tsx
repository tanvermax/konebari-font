"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Mail, 
  Phone, 
  MessageSquare, 
  Truck, 
  ShieldCheck, 
  HelpCircle, 
  Facebook,
  ExternalLink,
  ChevronRight,
  Clock
} from "lucide-react";

// --- SEO SCHEMA DATA ---
const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I install the Solar-Powered Helicopter Perfume?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simply peel the adhesive film at the base and place it on a flat dashboard. Ensure solar panels face direct sunlight for automatic spinning."
      }
    },
    {
      "@type": "Question",
      "name": "What is the shipping cost in Dhaka, Bangladesh?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Shipping is 60৳ inside Dhaka (2-3 business days) and 120৳ outside Dhaka (3-5 business days)."
      }
    }
  ]
};

export default function Help() {
  const faqs = [
    {
      question: "How do I install the Solar-Powered Helicopter Perfume?",
      answer: "Peel the high-quality adhesive film at the base and place it on a flat dashboard surface. For maximum efficiency, ensure the solar panels are exposed to direct sunlight. The rotor spins automatically without any battery or wiring required."
    },
    {
      question: "What are your delivery charges across Bangladesh?",
      answer: "We provide reliable shipping nationwide. Inside Dhaka: 60৳ (Delivery in 2-3 business days). Outside Dhaka: 120৳ (Delivery in 3-5 business days)."
    },
    {
      question: "Do the JDM Racing Pendants include scent refills?",
      answer: "Yes! Every JDM-style pendant comes pre-scented and includes a complementary 10ml concentrated essential oil bottle, ensuring your car stays fresh for months."
    },
    {
      question: "What is your return policy for accessories?",
      answer: "JCS Trading provides a 7-day replacement warranty for manufacturing defects. To be eligible, please keep the original packaging intact."
    }
  ];

  return (
    <main className="min-h-screen  dark:bg-black py-20 px-4 relative overflow-hidden">
      {/* 1. SEO Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* 2. Professional Hero Section */}
        <section className="text-center mb-24 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="outline" className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary rounded-full uppercase tracking-tighter text-xs font-bold">
              JCS Trading Support Hub
            </Badge>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-black tracking-tight italic uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Resolution <span className="text-primary">Center</span>
          </motion.h1 >
          
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Search our comprehensive database for installation guides, shipping rates in Dhaka, and product care instructions.
          </motion.p>
          
          <motion.div 
            className="relative max-w-2xl mx-auto mt-10 group"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary w-5 h-5 z-20" />
            <Input 
              placeholder="Search guides (e.g. 'helicopter installation')..." 
              className="pl-14 h-16 rounded-2xl border-none bg-white dark:bg-zinc-900 shadow-2xl focus-visible:ring-2 focus-visible:ring-primary text-lg"
            />
          </motion.div>
        </section>

        {/* 3. High-Contrast Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          <ContactCard 
            icon={<Phone />} 
            title="Call Support" 
            detail="+8801674986600" 
            subDetail="Available 10:00 - 20:00"
          />
          <ContactCard 
            icon={<Mail />} 
            title="Email Support" 
            detail="jcstrading2022@gmail.com" 
            subDetail="Official inquiries"
          />
          <ContactCard 
            icon={<MessageSquare />} 
            title="WhatsApp" 
            detail="Message Us" 
            subDetail="Instant assistance"
          />
          <SocialCard />
        </div>

        {/* 4. Elegant FAQ Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="inline-flex p-4 rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-primary/20">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-bold tracking-tighter uppercase italic">Common <br />Questions</h2>
            <p className="text-muted-foreground text-lg italic border-l-2 pl-4 border-primary/30">
              Everything you need to know about Bangladesh&apos;s #1 car accessories shop.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 5 }}
                className="bg-white dark:bg-zinc-900 border border-muted rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={`item-${index}`} className="border-none">
                    <AccordionTrigger className="px-6 py-6 font-bold hover:no-underline hover:text-primary transition-colors text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-muted-foreground leading-relaxed text-[15px]">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 5. Utility Footprint */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-8">
          <ActionItem 
            icon={<Truck className="w-6 h-6" />} 
            title="National Delivery Tracking" 
            desc="Track your package from Sonirakhra to any corner of Bangladesh." 
          />
          <ActionItem 
            icon={<ShieldCheck className="w-6 h-6" />} 
            title="Authenticity Guarantee" 
            desc="Verify your JCS Trading serial numbers and warranty certificates." 
          />
        </div>
      </div>
    </main>
  );
}

/* --- UI COMPONENTS --- */

function ContactCard({ icon, title, detail, subDetail }: any) {
  return (
    <motion.div whileHover={{ y: -5 }} className="group">
      <Card className="h-full rounded-2xl p-6 shadow-lg bg-white dark:bg-zinc-900/50 backdrop-blur-xl">
        <CardHeader className="pb-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
            {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" } as any)}
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{title}</CardTitle>
          <p className="text-lg font-black truncate">{detail}</p>
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium bg-primary/5 w-fit px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" /> {subDetail}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SocialCard() {
  return (
    <a href="https://www.facebook.com/share/1SDTmgM62M/" target="_blank" rel="noreferrer">
      <motion.div whileHover={{ y: -5 }}>
        <Card className="h-full rounded-2xl p-6 shadow-lg bg-blue-600 text-white overflow-hidden relative group">
          <Facebook className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
          <CardHeader>
             <Facebook className="w-8 h-8 fill-current" />
          </CardHeader>
          <CardContent className="relative z-10">
            <CardTitle className="text-lg font-bold">Facebook Shop</CardTitle>
            <p className="text-sm opacity-80 flex items-center gap-1">
              DM for quick support <ExternalLink className="w-3 h-3" />
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </a>
  );
}

function ActionItem({ icon, title, desc }: any) {
  return (
    <div className="group flex gap-6 p-8 bg-white dark:bg-zinc-900 border-2 border-transparent hover:border-primary/20 rounded-[2.5rem] items-center transition-all cursor-pointer shadow-sm">
      <div className="bg-primary/10 p-5 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <div>
        <h3 className="font-black text-xl uppercase italic tracking-tighter mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground font-medium leading-snug">{desc}</p>
      </div>
      <ChevronRight className="ml-auto w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all" />
    </div>
  );
}