import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  Star, 
  ArrowRight, 
  Eye 
} from "lucide-react";

// Filter Categories
const catalogTabs = [
  { id: "all", label: "All Products" },
  { id: "bestsellers", label: "Best Sellers" },
  { id: "new", label: "New Arrivals" },
  { id: "derm-pick", label: "Derm Picks" },
];

// Sample Curated Products
const featuredProducts = [
  {
    id: "prod-1",
    name: "Advanced Snail 96 Mucin Power Essence",
    category: "Essence",
    tag: "bestsellers",
    price: "৳ 1,650",
    originalPrice: "৳ 1,900",
    rating: 4.9,
    reviews: 320,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop",
    isNew: false,
  },
  // {
  //   id: "prod-2",
  //   name: "Centella Water Alcohol-Free Toner",
  //   category: "Toner",
  //   tag: "derm-pick",
  //   price: "৳ 1,400",
  //   originalPrice: "৳ 1,600",
  //   rating: 4.8,
  //   reviews: 180,
  //   image: "https://images.unsplash.com/photo-1608248597262-2f3b92cb33f3?w=500&auto=format&fit=crop",
  //   isNew: true,
  // },
  {
    id: "prod-3",
    name: "Pure Vitamin C 21.5 Advanced Serum",
    category: "Serum",
    tag: "bestsellers",
    price: "৳ 1,950",
    originalPrice: "৳ 2,300",
    rating: 4.9,
    reviews: 410,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop",
    isNew: false,
  },
  {
    id: "prod-4",
    name: "Low pH Good Morning Gel Cleanser",
    category: "Cleanser",
    tag: "new",
    price: "৳ 1,150",
    originalPrice: "৳ 1,350",
    rating: 4.7,
    reviews: 95,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&auto=format&fit=crop",
    isNew: true,
  },
];

export default function FeaturedCatalog() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProducts = activeTab === "all" 
    ? featuredProducts 
    : featuredProducts.filter(p => p.tag === activeTab || (activeTab === "new" && p.isNew));

  return (
    <section className="py-16 sm:py-24 bg-background border-t border-border/40 relative">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div className="space-y-3 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 text-xs font-medium border border-border/40"
            >
              <Sparkles size={13} className="text-rose-500" />
              <span>Handpicked Collection</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-foreground"
            >
              Explore Our <span className="italic font-light text-rose-500">Curations</span>
            </motion.h2>
          </div>

          {/* FILTER TABS */}
          <div className="flex flex-wrap gap-2">
            {catalogTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 relative ${
                    isActive 
                      ? "text-blue-500" 
                      : "text-muted-foreground hover:text-foreground bg-stone-100/60 dark:bg-stone-900/60"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCatalogTab"
                      className="absolute inset-0 bg-slate-900 dark:bg-rose-600 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* PRODUCT GRID */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -6 }}
                className="group rounded-3xl bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/70 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* IMAGE CONTAINER */}
                  <div className="relative aspect-square overflow-hidden bg-stone-100 dark:bg-stone-900">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* BADGES */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {product.isNew && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-rose-500 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                          New
                        </span>
                      )}
                    </div>

                    {/* QUICK ACTION BUTTONS OVERLAY */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-8 h-8 rounded-full bg-white/90 dark:bg-black/80 text-foreground flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors shadow-md">
                        <Heart size={14} />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-white/90 dark:bg-black/80 text-foreground flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors shadow-md">
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-amber-500">
                        <Star size={12} fill="currentColor" />
                        <span>{product.rating}</span>
                        <span className="text-muted-foreground">({product.reviews})</span>
                      </div>
                    </div>

                    <h3 className="text-xs sm:text-sm font-medium text-foreground line-clamp-2 group-hover:text-rose-500 transition-colors">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* PRICING & ADD TO CART */}
                <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-stone-100 dark:border-stone-800/80 mt-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm sm:text-base font-semibold text-foreground">
                      {product.price}
                    </span>
                    <span className="text-[11px] text-muted-foreground line-through">
                      {product.originalPrice}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    className="rounded-full bg-slate-900 dark:bg-rose-600 hover:bg-slate-800 dark:hover:bg-rose-700 text-white h-8 px-3 gap-1.5 text-xs font-normal shadow-none"
                  >
                    <ShoppingBag size={13} />
                    <span>Add</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* VIEW ALL SHOP LINK */}
        <div className="mt-14 text-center">
          <Button
            asChild
            variant="outline"
            className="rounded-full border-border/60 hover:border-slate-900 dark:hover:border-rose-500 px-8 h-11 text-xs font-medium gap-2 transition-all"
          >
            <Link to="/shop">
              Explore Entire Skincare Collection
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}