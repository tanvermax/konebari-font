// pages/Help/Help.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Search, HelpCircle, Mail, Phone, MessageCircle,
  ChevronDown, ChevronUp, Truck, RotateCcw,
  CreditCard, User, Package, Send, Facebook,
  Clock, MapPin, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
// import { useCreateMessageMutation } from "@/redux/features/contact/contact.api";

// ========== FAQ DATA ==========
const faqCategories = [
  {
    id: "orders",
    label: "Orders & Tracking",
    icon: Package,
    faqs: [
      { q: "How do I track my order?", a: "After placing an order, you'll receive a tracking ID via SMS/email. You can also track it from your Profile → Orders page." },
      { q: "Can I cancel my order?", a: "Yes, you can cancel before the order is shipped. Go to Profile → Orders → select order → Cancel. After shipping, cancellation is not possible." },
      { q: "How long does delivery take?", a: "Inside Dhaka: 1-2 days. Outside Dhaka: 3-5 days." },
    ],
  },
  {
    id: "shipping",
    label: "Shipping & Delivery",
    icon: Truck,
    faqs: [
      { q: "What is the shipping cost?", a: "Inside Dhaka: ৳60. Outside Dhaka: ৳120. Free shipping on orders above ৳1000." },
      { q: "Do you deliver outside Bangladesh?", a: "Currently we only deliver inside Bangladesh." },
    ],
  },
  {
    id: "returns",
    label: "Returns & Refunds",
    icon: RotateCcw,
    faqs: [
      { q: "What is your return policy?", a: "You can return any product within 7 days of delivery if it's unused, sealed, and with original packaging." },
      { q: "How do I get a refund?", a: "Once we receive the returned product and verify it, refunds are processed within 3-5 working days to your original payment method or as store credit." },
    ],
  },
  {
    id: "payment",
    label: "Payment",
    icon: CreditCard,
    faqs: [
      { q: "What payment methods are available?", a: "We accept Cash on Delivery, bKash, Nagad, Rocket, and all major credit/debit cards via SSLCommerz." },
      { q: "Is it safe to pay online?", a: "Yes! All online payments are processed through SSLCommerz with bank-level encryption." },
    ],
  },
  {
    id: "account",
    label: "Account & Profile",
    icon: User,
    faqs: [
      { q: "How do I reset my password?", a: "Click 'Forgot Password' on the login page and follow the email link to reset." },
      { q: "Do I need an account to order?", a: "No, you can order as a guest. But logging in lets you track orders, save favorites, and earn coins." },
    ],
  },
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("orders");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  // const [createMessage, { isLoading: isSubmitting }] = useCreateMessageMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  // ✅ Filter FAQs by search
  const filteredFaqs = searchTerm.trim()
    ? faqCategories
        .flatMap((c) => c.faqs.map((f) => ({ ...f, category: c.label })))
        .filter(
          (f) =>
            f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.a.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : faqCategories.find((c) => c.id === activeCategory)?.faqs.map((f) => ({
        ...f,
        category: activeCategory,
      })) || [];

  const onSubmit = async (
    data: any
  ) => {
    try {
      // await createMessage(data).unwrap();
      toast.success("Feature will coming  soon 🎉",data);
      reset();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send message");
    }
  };

  return (
    <div className="bg-background backdrop-blur-3xl min-h-screen">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-br   via-[#E06D9F] to-[purple-100] text-white py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3 h-3" />
            We're here to help
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-serif font-medium mb-3"
          >
            How can we help you?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/90 text-sm md:text-base mb-6"
          >
            Search our FAQs or contact our support team — we reply within minutes!
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for help... (e.g. 'track order')"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 rounded-2xl border-0 text-foreground bg-white shadow-2xl text-sm"
            />
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">

        {/* ============ QUICK CONTACT CARDS ============ */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-14">
          <a
            href="https://wa.me/8801700000000?text=Hello%20I%20need%20help"
            target="_blank"
            rel="noreferrer"
            className="group p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 hover:shadow-lg hover:-translate-y-1 transition-all text-center"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">WhatsApp</p>
            <p className="text-[10px] text-emerald-600/70">Chat instantly</p>
          </a>

          <a
            href="https://m.me/yourpage"
            target="_blank"
            rel="noreferrer"
            className="group p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 hover:shadow-lg hover:-translate-y-1 transition-all text-center"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Facebook className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Messenger</p>
            <p className="text-[10px] text-blue-600/70">Message us</p>
          </a>

          <a
            href="tel:+8801700000000"
            className="group p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 hover:shadow-lg hover:-translate-y-1 transition-all text-center"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">Call Us</p>
            <p className="text-[10px] text-rose-600/70">9AM - 9PM</p>
          </a>

          <a
            href="mailto:support@yourdomain.com"
            className="group p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 hover:shadow-lg hover:-translate-y-1 transition-all text-center"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-purple-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">Email</p>
            <p className="text-[10px] text-purple-600/70">Reply in 24h</p>
          </a>
        </section>

        {/* ============ FAQ + CONTACT FORM ============ */}
        <div className="grid lg:grid-cols-5 gap-6 md:gap-8">

          {/* ============ FAQ SECTION ============ */}
          <section className="lg:col-span-3">
            <div className="mb-5">
              <h2 className="text-xl md:text-2xl font-serif mb-1 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-rose-500" />
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-muted-foreground">
                {searchTerm
                  ? `${filteredFaqs.length} result(s) for "${searchTerm}"`
                  : "Browse by category"}
              </p>
            </div>

            {/* Category tabs */}
            {!searchTerm && (
              <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
                {faqCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3 h-9 rounded-full whitespace-nowrap text-xs font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md"
                          : "bg-card border border-border/60 hover:border-rose-300 text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* FAQ list */}
            <div className="space-y-2">
              {filteredFaqs.length === 0 ? (
                <Card className="border-border/40">
                  <CardContent className="py-12 text-center">
                    <HelpCircle className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">
                      No results found. Try another keyword or contact us below.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredFaqs.map((faq, idx) => {
                  const faqId = `${idx}-${faq.q}`;
                  const isOpen = openFaq === faqId;
                  return (
                    <Card
                      key={faqId}
                      className={`border-border/40 transition-all ${isOpen ? "border-rose-300 shadow-md" : ""}`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : faqId)}
                        className="w-full text-left p-4 flex items-center justify-between gap-3"
                      >
                        <span className="text-sm font-medium flex-1">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          </section>

          {/* ============ CONTACT FORM ============ */}
          <section className="lg:col-span-2">
            <Card className="border-border/40 sticky top-6">
              <CardContent className="p-5 md:p-6 space-y-4">
                <div>
                  <h2 className="text-xl font-serif mb-1 flex items-center gap-2">
                    <Send className="w-5 h-5 text-rose-500" />
                    Still need help?
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Fill the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Name *</Label>
                    <Input
                      {...register("name", { required: "Name is required" })}
                      placeholder="Your name"
                      className="h-10 text-sm"
                    />
                    {errors.name && (
                      <p className="text-[10px] text-red-500">{errors.name.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Email *</Label>
                    <Input
                      type="email"
                      {...register("email", { required: "Email is required" })}
                      placeholder="you@example.com"
                      className="h-10 text-sm"
                    />
                    {errors.email && (
                      <p className="text-[10px] text-red-500">{errors.email.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Phone *</Label>
                    <Input
                      {...register("phone", { required: "Phone is required" })}
                      placeholder="01XXXXXXXXX"
                      className="h-10 text-sm"
                    />
                    {errors.phone && (
                      <p className="text-[10px] text-red-500">{errors.phone.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Subject *</Label>
                    <Input
                      {...register("subject", { required: "Subject is required" })}
                      placeholder="What's this about?"
                      className="h-10 text-sm"
                    />
                    {errors.subject && (
                      <p className="text-[10px] text-red-500">{errors.subject.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Message *</Label>
                    <Textarea
                      {...register("message", { required: "Message is required" })}
                      placeholder="Tell us how we can help..."
                      rows={4}
                      className="text-sm resize-none"
                    />
                    {errors.message && (
                      <p className="text-[10px] text-red-500">{errors.message.message as string}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    // disabled={isSubmitting}
                    className="w-full h-11 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl gap-2"
                  >
                    {/* {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <> */}
                        <Send className="w-4 h-4" />
                        Send Message
                      {/* </>
                    )} */}
                  </Button>
                </form>

                {/* Info section */}
                <div className="pt-3 border-t border-border/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    <span>Support hours: 9 AM - 9 PM (Sat-Thu)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>Dhaka, Bangladesh</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* ============ BOTTOM CTA ============ */}
        <section className="mt-16 text-center p-8 rounded-3xl bg-gradient-to-br from-stone-100 to-rose-50 dark:from-stone-900 dark:to-rose-950/30 border border-border/40">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-500 uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" />
            Still curious?
          </div>
          <h3 className="text-xl md:text-2xl font-serif mb-2">
            Chat with us directly
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Our support team is online now. Get instant answers on WhatsApp or Messenger.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <a
              href="https://wa.me/8801700000000?text=Hello%20I%20need%20help"
              target="_blank"
              rel="noreferrer"
            >
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl gap-2">
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </Button>
            </a>
            <a href="https://m.me/yourpage" target="_blank" rel="noreferrer">
              <Button
                variant="outline"
                className="rounded-xl gap-2 border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <Facebook className="w-4 h-4" />
                Message on Facebook
              </Button>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}