import { motion } from "framer-motion";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {  ArrowUpRight, Flame, Clock } from "lucide-react";

export default function TrendingOffers() {
  const collections = [
    {
      id: 1,
      tag: "Best for Hydration",
      title: "Hyaluronic Acid Serum",
      subtitle: "Intense moisture retention for glowing skin",
      discount: "20% OFF",
      price: "৳ 1,450",
      oldPrice: "৳ 1,800",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop",
      link: "/shop?category=skincare",
    },
    {
      id: 2,
      tag: "Trending Makeup",
      title: "Velvet Matte Lipstick",
      subtitle: "Long-lasting, smudge-proof elegant shades",
      discount: "Hot Deal",
      price: "৳ 850",
      oldPrice: "৳ 1,100",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop",
      link: "/shop?category=makeup",
    },
  ];

  return (
    <section className="py-12 rounded-2xl sm:py-16 bg-[#FAFAFA] dark:bg-[#0A0A0A] overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-1"
          >
            <div className="inline-flex items-center gap-1.5 text-rose-500 font-medium text-xs tracking-wider uppercase">
              <Flame size={14} className="animate-bounce" />
              <span>Limited Time Specials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium tracking-tight text-foreground">
              Trending Spotlight
            </h2>
          </motion.div>

          {/* Flash Timer Badge */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-medium text-stone-600 dark:text-stone-300 w-fit"
          >
            <Clock size={13} className="text-rose-500" />
            <span>Offers end in: <strong className="text-foreground">24h 15m</strong></span>
          </motion.div>
        </div>

        {/* 2-Column Animated Offer Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {collections.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col sm:flex-row"
            >
              
              {/* Product Image Wrapper */}
              <div className="relative sm:w-1/2 aspect-[4/3] sm:aspect-auto overflow-hidden bg-stone-100 dark:bg-stone-900 shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <span className="absolute top-3 left-3 bg-stone-900/90 text-white dark:bg-white/90 dark:text-stone-900 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-medium tracking-wide">
                  {item.discount}
                </span>
              </div>

              {/* Product Details Area */}
              <div className="p-6 sm:p-8 sm:w-1/2 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider">
                    {item.tag}
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif font-normal text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-foreground">
                      {item.price}
                    </span>
                    <span className="text-xs text-muted-foreground line-through font-light">
                      {item.oldPrice}
                    </span>
                  </div>

                  <Button 
                    asChild 
                    size="sm" 
                    className="rounded-full bg-stone-900 dark:bg-rose-600 hover:bg-stone-800 dark:hover:bg-rose-700 text-white h-9 px-4 text-xs font-normal shadow-none gap-1 group/btn"
                  >
                    <Link to={item.link}>
                      Get Offer
                      <ArrowUpRight size={14} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </Link>
                  </Button>
                </div>

              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}