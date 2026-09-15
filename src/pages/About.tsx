// pages/About.tsx
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Truck,
  Award,

  ArrowRight,
  Smile,

  Star,
  Users,
  Gem,

  Instagram,
  Facebook,
  Twitter,
  Youtube,

  Eye,
  Target,
  Lightbulb,
} from "lucide-react";
import { Link } from "react-router";

// Animation Variants
const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" },
};

const fadeInRight = {
  initial: { opacity: 0, x: 50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.15 } },
};

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50/20 to-purple-50/10">
      <div className="py-12 md:py-20 px-4 container mx-auto max-w-7xl space-y-20">
        
        {/* ========== HERO SECTION ========== */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative text-center"
        >
          {/* Background Effects */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-r from-pink-400/10 via-rose-400/10 to-purple-400/10 blur-[150px] rounded-full -z-10" />
          
          <Badge className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 border-none px-5 py-2 rounded-full text-xs font-semibold tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Welcome to Our Story
          </Badge>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mt-6 leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">
              Where Beauty
            </span>
            <br />
            <span className="text-foreground">Meets Authenticity</span>
          </motion.h1>

          <motion.p
            className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto mt-6 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            We're on a mission to bring you premium beauty products that are 100% authentic, 
            carefully curated, and loved by thousands of women just like you.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/shop">
              <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 rounded-full px-8 py-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Explore Products
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="rounded-full px-8 py-6 border-pink-300/50 hover:bg-pink-50">
                <Heart className="w-4 h-4 mr-2" />
                Get in Touch
              </Button>
            </Link>
          </motion.div>
        </motion.section>

        {/* ========== OUR MISSION & VISION ========== */}
        <motion.section
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: <Target className="w-8 h-8 text-pink-500" />,
              title: "Our Mission",
              description: "To empower every woman to feel confident and beautiful by providing access to authentic, high-quality beauty products that nurture and enhance natural radiance.",
              color: "pink",
            },
            {
              icon: <Eye className="w-8 h-8 text-purple-500" />,
              title: "Our Vision",
              description: "To become the most trusted beauty destination where authenticity meets affordability, and every woman finds her perfect beauty routine.",
              color: "purple",
            },
            {
              icon: <Lightbulb className="w-8 h-8 text-amber-500" />,
              title: "Our Values",
              description: "Authenticity, Quality, Customer-Centricity, Transparency, and Inclusivity - these pillars define everything we do.",
              color: "amber",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              whileHover={{ y: -6 }}
              className={`p-8 rounded-2xl border-2 border-${item.color}-200/50 bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-${item.color}-100 flex items-center justify-center mb-4`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* ========== OUR STORY ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={fadeInLeft}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Badge className="bg-pink-100 text-pink-600 border-none">Our Story</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              How It All <br />
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Began
              </span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded in 2020 with a simple belief - every woman deserves access to authentic, 
                premium beauty products without the worry of counterfeits or inflated prices.
              </p>
              <p className="border-l-4 border-pink-400/40 pl-4 italic text-foreground/80">
                "We started this journey because we saw too many women struggling to find genuine 
                products. We wanted to create a space where trust and beauty go hand in hand."
              </p>
              <p>
                Today, we've grown into a community of thousands of happy customers who trust us 
                for their daily beauty needs. Our curated collection features products from over 
                200+ premium brands worldwide.
              </p>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold">5,000+ Happy Customers</p>
                <p className="text-xs text-muted-foreground">And growing every day</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInRight}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1000"
                  alt="About us story"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-sm font-medium">Est. 2020</p>
                  <h3 className="text-xl font-bold">Built with Passion</h3>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ========== WHAT MAKES US DIFFERENT ========== */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="text-center space-y-3">
            <Badge className="bg-pink-100 text-pink-600 border-none">Why Choose Us</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              What Makes Us <span className="text-pink-500">Different</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We go the extra mile to ensure you get nothing but the best
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                title: "100% Authentic",
                description: "Every product is genuine and sourced directly from authorized brands",
                color: "pink",
              },
              {
                icon: <Truck className="w-6 h-6" />,
                title: "Fast & Secure Delivery",
                description: "Tracked shipping with real-time updates and insurance",
                color: "blue",
              },
              {
                icon: <Award className="w-6 h-6" />,
                title: "Premium Quality",
                description: "Carefully curated products that meet international standards",
                color: "amber",
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: "Customer Love",
                description: "Thousands of happy customers with 4.9★ average rating",
                color: "rose",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ scale: 1.03 }}
                className="p-6 text-center rounded-2xl border bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all"
              >
                <div className={`w-14 h-14 rounded-full bg-${item.color}-100 flex items-center justify-center text-${item.color}-500 mx-auto mb-3`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ========== STATISTICS ========== */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { number: "10K+", label: "Happy Customers", icon: <Smile className="w-6 h-6" /> },
            { number: "200+", label: "Premium Brands", icon: <Gem className="w-6 h-6" /> },
            { number: "100%", label: "Authentic Products", icon: <ShieldCheck className="w-6 h-6" /> },
            { number: "4.9★", label: "Average Rating", icon: <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="text-center space-y-2 p-6 rounded-2xl border bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all"
            >
              <div className="flex justify-center text-pink-500">{stat.icon}</div>
              <h3 className="text-2xl md:text-3xl font-extrabold">{stat.number}</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{stat.label}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* ========== TEAM SECTION ========== */}
        <motion.section
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center space-y-3">
            <Badge className="bg-pink-100 text-pink-600 border-none">Meet the Team</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              The Faces Behind <span className="text-pink-500">The Brand</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Founder & CEO",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
                bio: "Passionate about authentic beauty products and empowering women worldwide.",
                social: { instagram: "#", linkedin: "#" },
              },
              {
                name: "Emily Chen",
                role: "Head of Product Curation",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
                bio: "Expert in skincare and beauty trends with 10+ years of industry experience.",
                social: { instagram: "#", linkedin: "#" },
              },
              {
                name: "Maria Rodriguez",
                role: "Customer Experience Lead",
                image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=400",
                bio: "Committed to ensuring every customer has an exceptional experience.",
                social: { instagram: "#", linkedin: "#" },
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -4 }}
                className="text-center p-6 rounded-2xl border bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all"
              >
                <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-2 border-pink-200 mb-4">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-sm text-pink-500 font-medium">{member.role}</p>
                <p className="text-xs text-muted-foreground mt-2">{member.bio}</p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <a href={member.social.instagram} className="p-2 rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100 transition">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href={member.social.linkedin} className="p-2 rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100 transition">
                    <Users className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ========== BRANDS WE PARTNER WITH ========== */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="text-center space-y-3">
            <Badge className="bg-pink-100 text-pink-600 border-none">Our Partners</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Trusted <span className="text-pink-500">Global Brands</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "L'Oréal", logo: "https://via.placeholder.com/150x80?text=L'Oréal" },
              { name: "Estée Lauder", logo: "https://via.placeholder.com/150x80?text=Estée+Lauder" },
              { name: "MAC", logo: "https://via.placeholder.com/150x80?text=MAC" },
              { name: "NARS", logo: "https://via.placeholder.com/150x80?text=NARS" },
            ].map((brand, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-xl border bg-white/60 backdrop-blur-sm flex items-center justify-center h-24 hover:shadow-lg transition-all"
              >
                <p className="font-bold text-muted-foreground/60">{brand.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ========== TESTIMONIALS ========== */}
        <motion.section
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center space-y-3">
            <Badge className="bg-pink-100 text-pink-600 border-none">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              What Our <span className="text-pink-500">Customers Say</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Jennifer M.",
                text: "I've been buying my skincare from this store for over a year. The products are always authentic and the delivery is super fast!",
                rating: 5,
              },
              {
                name: "Lisa K.",
                text: "Finally found a place where I can trust the products. The customer service team is amazing and always helpful.",
                rating: 5,
              },
              {
                name: "Amanda R.",
                text: "Love the variety of brands available. Every product I've ordered has exceeded my expectations.",
                rating: 4.9,
              },
              {
                name: "Priya S.",
                text: "The best beauty store online! Their curated collections make shopping so easy and enjoyable.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl border bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all"
              >
                <div className="flex gap-1 text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(testimonial.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">Verified Buyer</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ========== CALL TO ACTION ========== */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 text-white rounded-3xl p-10 md:p-16 text-center shadow-2xl shadow-pink-500/20"
        >
          {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10" /> */}
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <Sparkles className="w-12 h-12 mx-auto text-white/80" />
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Ready to Start Your <br />
              <span className="underline decoration-white/30">Beauty Journey</span>?
            </h2>
            <p className="text-sm md:text-base opacity-90 max-w-md mx-auto">
              Join thousands of happy customers who've found their perfect beauty routine with us
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link to="/shop">
                <Button className="bg-white text-pink-600 hover:bg-pink-50 shadow-lg shadow-white/20 hover:shadow-white/30 px-8 py-6 rounded-full text-sm font-bold">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Shop Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="ghost" className="text-white hover:bg-white/20 rounded-full px-6 py-6">
                  <Heart className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>

        {/* ========== FOOTER ========== */}
        <div className="text-center space-y-4 pt-4 border-t">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-pink-500 transition">About</Link>
            <Link to="/shop" className="hover:text-pink-500 transition">Shop</Link>
            <Link to="/contact" className="hover:text-pink-500 transition">Contact</Link>
            <Link to="/help" className="hover:text-pink-500 transition">Help</Link>
            <Link to="/privacy" className="hover:text-pink-500 transition">Privacy Policy</Link>
          </div>
          <div className="flex justify-center gap-4">
            <a href="#" className="p-2 rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100 transition">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100 transition">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100 transition">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100 transition">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Glamour & Elegance. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}