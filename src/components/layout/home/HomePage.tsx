import { motion } from "framer-motion";
import { Link } from "react-router";
import { useAllpstockQuery } from "@/redux/features/product/product.api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { IProductCard } from "@/redux/features/product/Product.types";
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  RotateCcw,
  Headphones
} from "lucide-react";
import ProductCard from "../HomeLayout/ProductCard/ProductCard";

export default function HomePage() {
  const { data: productsData, isLoading: productsLoading } = useAllpstockQuery({ 
    limit: 8,
    sort: "-createdAt" 
  });
  
  const products: IProductCard[] = productsData?.data || [];

  // Minimal Elegance Categories
  const categories = [
    { name: 'Skincare', count: '120+ Products', href: '/shop?category=skincare', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop' },
    { name: 'Makeup', count: '85+ Products', href: '/shop?category=makeup', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop' },
    { name: 'Hair Care', count: '60+ Products', href: '/shop?category=hair-care', img: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop' },
    { name: 'Fragrance', count: '40+ Products', href: '/shop?category=fragrance', img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop' },
  ];

  const features = [
    { icon: Truck, title: "Fast Shipping", desc: "Across Dhaka & Countrywide" },
    { icon: ShieldCheck, title: "100% Authentic", desc: "Guaranteed Original Items" },
    { icon: RotateCcw, title: "Easy Returns", desc: "Hassle-free 7 Days Return" },
    { icon: Headphones, title: "Dedicated Support", desc: "Always here for your query" },
  ];

  return (
    <div className="min-h-screen  text-foreground">
      
      {/* ===== HERO SECTION (Minimal & Clean) ===== */}
      <section className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 border-b border-border/40">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs font-medium tracking-wide border border-rose-100 dark:border-rose-900/40">
                <Sparkles size={13} />
                <span>Pure Beauty, Crafted For You</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-foreground leading-[1.15]">
                Elevate Your Everyday <br />
                <span className="italic font-light text-rose-500/90">Glow Routine.</span>
              </h1>

              <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed max-w-md">
                Experience authentic skincare and cosmetics curated with dermatological precision. Simple, effective, and beautifully safe.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild size="lg" className="rounded-full bg-slate-900 dark:bg-rose-600 hover:bg-slate-800 dark:hover:bg-rose-700 text-white shadow-none font-normal px-8 text-sm h-11">
                  <Link to="/shop" className="flex items-center gap-2">
                    Shop Collection <ArrowRight size={15} />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="lg" className="rounded-full font-normal text-sm h-11 hover:bg-rose-50/50 dark:hover:bg-rose-950/20">
                  <Link to="/shop?sort=new">Explore New</Link>
                </Button>
              </div>
            </motion.div>

            {/* Right Hero Visual Banner */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-6"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-sm bg-stone-100 dark:bg-stone-900 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3]">
                <img 
                  src="https://images.unsplash.com/photo-1679623100266-db82be84f5f3?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Minimal Skincare Hero" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-8 bg-white dark:bg-[#0D0D0D] border-b border-border/40">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((item, index) => (
              <div key={index} className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 shrink-0">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-foreground">{item.title}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-14 sm:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-md mx-auto mb-10 space-y-1">
            <h2 className="text-2xl sm:text-3xl font-serif tracking-tight">Curated Categories</h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-light">Find tailored essentials for your daily care</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat, idx) => (
              <Link key={idx} to={cat.href} className="group block relative overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-900 aspect-[3/4]">
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-5 text-white">
                  <h3 className="font-serif text-lg sm:text-xl font-medium">{cat.name}</h3>
                  <p className="text-xs text-white/80 font-light mt-0.5">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RECENT / POPULAR PRODUCTS ===== */}
      <section className="py-12 sm:py-16 bg-white dark:bg-[#0D0D0D] border-t border-border/40">
        <div className="container mx-auto px-4 md:px-8">
          
          <div className="flex items-end justify-between mb-8 pb-3 border-b border-border/30">
            <div>
              <span className="text-xs font-semibold tracking-widest text-rose-500 uppercase">Selected Collection</span>
              <h2 className="text-2xl sm:text-3xl font-serif tracking-tight mt-1">New Arrivals</h2>
            </div>
            <Button asChild variant="link" className="text-foreground hover:text-rose-600 p-0 h-auto text-xs sm:text-sm font-normal">
              <Link to="/shop" className="flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </Button>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-64 sm:h-80 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {products.slice(0, 4).map((product: IProductCard) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={product.minPrice ?? 0}
                  specialPrice={product.specialPrice}
                  hasDiscount={product.hasDiscount}
                  inStock={product.inStock}
                  image={product.mainImage || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop"}
                  slug={product.slug}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ===== ELEGANT MINIMAL BANNER ===== */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-stone-900 text-stone-100 rounded-2xl p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-serif font-light tracking-wide">
              Experience Authentic Skin Luxury
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm max-w-lg mx-auto font-light leading-relaxed">
              Join our beauty newsletter to receive exclusive offers, skincare recommendations, and original product updates directly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 max-w-md mx-auto pt-4">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-full bg-stone-800 text-stone-100 border border-stone-700 text-xs focus:outline-none focus:border-stone-500"
              />
              <Button className="w-full sm:w-auto rounded-full bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs px-6 h-10 font-medium">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}