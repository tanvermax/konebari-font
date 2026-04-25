"use client";

import React from "react";
import { motion } from "framer-motion";
import Logo from "@/assets/icons/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Link } from "react-router";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } }
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background overflow-hidden border-t">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-8">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-12 lg:grid-cols-4"
        >
          {/* Brand & Newsletter Column */}
          <motion.div variants={fadeInUp} className="lg:col-span-1 space-y-6">
            <Logo  />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Elevating the multifaceted lifestyle of Bangladesh. From the road to the home, we bring you authentic quality.
            </p>
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider">Join our Newsletter</p>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input 
                  type="email" 
                  placeholder="Email address" 
                  className="h-9 rounded-full bg-muted/50 border-none focus-visible:ring-1" 
                />
                <Button size="sm" className="rounded-full h-9 px-4">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Dynamic Links Grid */}
          <motion.div variants={fadeInUp} className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <FooterSection 
              title="Specialties" 
              links={[
                { name: "Automotive Gear", href: "/auto" },
                { name: "Feline Nutrition", href: "/pets" },
                { name: "Musical Gear", href: "/music" },
                { name: "Best Sellers", href: "/shop" },
              ]} 
            />
            <FooterSection 
              title="Customer Care" 
              links={[
                { name: "Track Order", href: "/track" },
                { name: "Shipping Policy", href: "/shipping" },
                { name: "Return Warranty", href: "/warranty" },
                { name: "Contact Us", href: "/help" },
              ]} 
            />
            <div className="col-span-2 md:col-span-1 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Reach Us
              </h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3 items-start group">
                  <MapPin className="h-5 w-5 text-primary shrink-0 transition-transform group-hover:scale-110" />
                  <span className="group-hover:text-foreground transition-colors">
                    Shop 02, Silver Rain Tower, Sonirakhra, Dhaka 1362
                  </span>
                </li>
                <li className="flex gap-3 items-center group">
                  <Phone className="h-5 w-5 text-primary shrink-0 transition-transform group-hover:scale-110" />
                  <span className="group-hover:text-foreground transition-colors">+8801674986600</span>
                </li>
                <li className="flex gap-3 items-center group">
                  <Mail className="h-5 w-5 text-primary shrink-0 transition-transform group-hover:scale-110" />
                  <span className="group-hover:text-foreground transition-colors truncate">jcstrading2022@gmail.com</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Dynamic Mission Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
          <div className="relative bg-card/40 backdrop-blur-sm border p-8 rounded-3xl text-center">
            <h3 className="text-lg font-semibold mb-2">Our Mission</h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-3xl mx-auto italic">
              &quot;To provide the Bangladeshi market with authentic products, competitive pricing, and a seamless shopping experience for the modern driver, pet parent, and creator.&quot;
            </p>
          </div>
        </motion.div>

        <Separator className="mt-16" />

        {/* Final Bottom Bar */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-4 order-2 md:order-1">
             <SocialIcon icon={<Facebook />} href="https://www.facebook.com/share/1SDTmgM62M/" />
             <SocialIcon icon={<Instagram />} href="#" />
             <SocialIcon icon={<Twitter />} href="#" />
          </div>
          
          <p className="text-xs text-muted-foreground order-3 md:order-2">
            © {currentYear} JCS Trading. Designed with Precision.
          </p>

          <div className="text-xs font-medium order-1 md:order-3">
             <span className="text-muted-foreground">Architected by </span>
             <Link
               to="https://portfolio-e021a.web.app" 
               className="text-primary hover:underline underline-offset-4 decoration-primary/30"
             >
               Shafayet Hossain Tanveer
             </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Sub-components for cleaner code */

function FooterSection({ title, links }: { title: string, links: { name: string, href: string }[] }) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold uppercase tracking-widest">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.name}>
            <Link 
              to={link.href} 
              className="text-sm text-muted-foreground hover:text-primary hover:pl-1 transition-all duration-200 block"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200"
    >
      {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5" }as any)}
    </a>
  );
}