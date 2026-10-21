// components/layout/HomeLayout/LookbookReviews.tsx
import { motion } from "framer-motion";
import { Star, Instagram, Quote, CheckCircle2 } from "lucide-react";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
} from "lucide-react";
import { useGetTopReviewsQuery } from "@/redux/features/review/review.api";
import { Link } from "react-router";

// ✅ Instagram Lookbook (static — ei ta apnar IG image ba API theke replace korte paren)
const lookbookImages = [
  { id: 1, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop", tag: "@glowelegance.bd", likes: "1.2k" },
  { id: 2, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop", tag: "@glowelegance.bd", likes: "856" },
  { id: 3, image: "https://images.unsplash.com/photo-1512290900673-1f198f1a4e10?w=500&auto=format&fit=crop", tag: "@glowelegance.bd", likes: "2.4k" },
  { id: 4, image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&auto=format&fit=crop", tag: "@glowelegance.bd", likes: "1.8k" },
];

const features = [
  { icon: Truck, title: "Fast Shipping", desc: "Across Dhaka & Countrywide" },
  { icon: ShieldCheck, title: "100% Authentic", desc: "Guaranteed Original Items" },
  { icon: RotateCcw, title: "Easy Returns", desc: "Hassle-free 7 Days Return" },
  { icon: Headphones, title: "Dedicated Support", desc: "Always here for your query" },
];

// ✅ Helper: user name theke avatar initial color
const getAvatarColor = (name: string) => {
  const colors = [
    "from-rose-400 to-pink-500",
    "from-purple-400 to-pink-500",
    "from-blue-400 to-cyan-500",
    "from-emerald-400 to-green-500",
    "from-amber-400 to-orange-500",
    "from-indigo-400 to-purple-500",
  ];
  const idx = (name?.charCodeAt(0) || 0) % colors.length;
  return colors[idx];
};

export default function LookbookReviews() {
  // ✅ Dynamic data from backend
  const { data: reviews = [], isLoading } = useGetTopReviewsQuery({ limit: 3 });

  // ✅ Average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  // ✅ Hide section if no reviews (optional)
  if (!isLoading && reviews.length === 0) {
    return null; // Ba empty state dekhao
  }

  return (
    <section className="py-16 rounded-2xl sm:py-24 bg-stone-50/60 dark:bg-stone-900/30 overflow-hidden border-t border-border/40">
      <div className="container mx-auto px-4 md:px-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-2 max-w-xl"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Real Stories, Real Radiance
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-foreground tracking-tight">
              Loved by <span className="italic font-light text-rose-500">Thousands</span> of Skin Enthusiasts
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="flex -space-x-2">
              {reviews.slice(0, 3).map((r, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(r.userName)} border-2 border-background flex items-center justify-center text-white text-[10px] font-bold shadow-sm`}
                >
                  {r.userName.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
            <div className="text-xs font-medium">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
              </div>
              <span className="text-muted-foreground">
                {averageRating}/5 from {reviews.length}+ Reviews
              </span>
            </div>
          </motion.div>
        </div>

        {/* LOADING */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-3xl bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* REVIEWS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {reviews.slice(0, 6).map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-shadow"
                >
                  <Quote className="absolute top-6 right-6 h-8 w-8 text-stone-200 dark:text-stone-800 pointer-events-none" />

                  <div className="space-y-4 relative z-10">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < item.rating ? "currentColor" : "none"}
                          className={i < item.rating ? "" : "text-stone-300"}
                        />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm font-light text-foreground/90 leading-relaxed italic line-clamp-4">
                      "{item.comment}"
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center gap-3">
                    {/* ✅ User Avatar (initial gradient) */}
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(item.userName)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                    >
                      {item.userName.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-foreground flex items-center gap-1 truncate">
                        {item.userName}
                        <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                      </h4>
                      <Link
                        to={`/alldata/${item.productSlug || ""}`}
                        className="text-[10px] text-muted-foreground block truncate hover:text-rose-500 transition-colors"
                      >
                        Bought {item.productName}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* INSTAGRAM LOOKBOOK */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Instagram size={16} className="text-rose-500" />
              <span>Glow Community Lookbook</span>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-rose-500 hover:underline flex items-center gap-1"
            >
              Follow @glowelegance.bd →
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {lookbookImages.map((img, idx) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-800 cursor-pointer shadow-sm"
              >
                <img
                  src={img.image}
                  alt="Community Glow"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-3 space-y-2">
                  <Instagram size={22} className="text-rose-400 animate-bounce" />
                  <span className="text-[11px] font-medium">{img.tag}</span>
                  <span className="text-[10px] font-light bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                    ♥ {img.likes} likes
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="py-8 mt-12 bg-white dark:bg-[#0D0D0D] border-b border-border/40">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((item, index) => (
              <div key={index} className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 shrink-0">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-foreground">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}