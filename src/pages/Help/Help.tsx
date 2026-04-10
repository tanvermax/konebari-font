/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  Mail, 
  Phone, 
  MessageSquare, 
  Truck, 
  ShieldCheck, 
  HelpCircle, 
  Facebook,
  ExternalLink 
} from "lucide-react";

export default function Help() {
  const faqs = [
    {
      question: "How do I install the Solar-Powered Helicopter Perfume?",
      answer: "Simply peel the adhesive film at the base and place it on a flat surface on your dashboard. Ensure the solar panels face direct sunlight for the rotor to spin automatically. No batteries required!"
    },
    {
      question: "What is your shipping policy within Bangladesh?",
      answer: "We offer delivery within 2-3 business days inside Dhaka (60৳) and 3-5 business days outside Dhaka (120৳)."
    },
    {
      question: "Do the JDM Racing Pendants come with scent refills?",
      answer: "Yes, all our JDM style pendants come pre-scented and include a 10ml concentrated essential oil bottle to refresh the fragrance whenever needed."
    },
    {
      question: "Can I return a product if it doesn't fit my car?",
      answer: "We offer a 7-day replacement warranty for manufacturing defects. Please ensure the product packaging remains intact for a smooth return process."
    }
  ];

  return (
    <div className="min-h-screen bg-dot-pattern py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Support Center
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            How can we help?
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl">
            From installation guides to delivery tracking, everything you need to know about your JCS Trading gear.
          </p>
          
          <div className="relative max-w-2xl mx-auto mt-8 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Search for 'installation', 'shipping'..." 
              className="pl-12 h-14 rounded-full border-muted-foreground/20 bg-background/80 backdrop-blur-sm shadow-xl focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Support Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          <ContactCard 
            icon={<Phone className="w-5 h-5" />} 
            title="Call Support" 
            detail="+8801674986600" 
            subDetail="Sun-Thu, 10am-8pm"
          />
          <ContactCard 
            icon={<Mail className="w-5 h-5" />} 
            title="Email Us" 
            detail="jcstrading2022@gmail.com" 
            subDetail="24hr response time"
          />
          <ContactCard 
            icon={<MessageSquare className="w-5 h-5" />} 
            title="WhatsApp" 
            detail="Live Chat" 
            subDetail="Connect instantly"
          />
          <a 
            href="https://www.facebook.com/share/1SDTmgM62M/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group"
          >
            <Card className="h-full border-blue-500/20 hover:border-blue-500 transition-all duration-300 bg-blue-50/50 dark:bg-blue-950/10">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white mb-2 shadow-lg shadow-blue-500/20">
                  <Facebook className="w-5 h-5 fill-current" />
                </div>
                <CardTitle className="text-lg flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                  Facebook <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Follow us for updates & DM for quick queries.
              </CardContent>
            </Card>
          </a>
        </div>

        {/* FAQ Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-1 space-y-4">
            <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Can't find what you're looking for? Reach out to our team and we'll get back to you within a few hours.
            </p>
          </div>

          <div className="lg:col-span-2 bg-card border rounded-3xl p-2 shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-none px-4">
                  <AccordionTrigger className="text-left font-semibold py-6 hover:no-underline hover:text-primary transition-colors text-base md:text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Bottom Categories */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryItem 
            icon={<Truck />} 
            title="Order Tracking" 
            desc="Check the real-time status of your accessory delivery." 
          />
          <CategoryItem 
            icon={<ShieldCheck />} 
            title="Warranty Info" 
            desc="Learn about our 100% authenticity and damage protection." 
          />
        </div>
      </div>
    </div>
  );
}

/* Helper Components */
function ContactCard({ icon, title, detail, subDetail }: { icon: React.ReactNode, title: string, detail: string, subDetail: string }) {
  return (
    <Card className="hover:shadow-md transition-all duration-300 border-muted/60">
      <CardHeader className="pb-2">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-semibold text-foreground truncate">{detail}</p>
        <p className="text-xs text-muted-foreground mt-1">{subDetail}</p>
      </CardContent>
    </Card>
  );
}

function CategoryItem({ icon, title, desc }: { icon: React.ReactElement<any, any>, title: string, desc: string }) {
  return (
    <div className="group flex gap-5 p-6 border rounded-2xl items-start hover:bg-muted/50 transition-colors cursor-pointer">
      <div className="bg-background border shadow-sm p-4 rounded-xl text-primary group-hover:scale-110 transition-transform">
        {React.isValidElement(icon) ? React.cloneElement(icon, { className: "w-6 h-6" }) : icon}
      </div>
      <div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}