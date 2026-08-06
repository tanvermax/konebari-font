import { motion } from "framer-motion";
import { Star, Instagram, Quote, CheckCircle2 } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Nusrat Jahan",
    role: "Verified Buyer",
    rating: 5,
    comment: "Hyaluronic Acid Serum টা ব্যবহার করার ৩ দিনের মধ্যেই ত্বকের শুষ্কতা একদম চলে গেছে! প্রোডাক্ট ১০০% অরিজিনাল ছিল।",
    product: "Hyaluronic Acid Serum",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
    userTag: "@nusrat_j",
  },
  {
    id: 2,
    name: "Anika Rahman",
    role: "Verified Buyer",
    rating: 5,
    comment: "প্যাকেজিং এবং ডেলিভারি অনেক ফাস্ট ছিল। ভিটামিন সি সিরাম ব্যবহারের পর থেকে ত্বকের ডার্ক স্পট বেশ হালকা হয়েছে।",
    product: "Pure Vitamin C 21.5 Serum",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop",
    userTag: "@anika_beauty",
  },
  {
    id: 3,
    name: "Sumiya Akter",
    role: "Verified Buyer",
    rating: 5,
    comment: "আমার সেনসিটিভ স্কিন হওয়া সত্ত্বেও কোনো র‍্যাশ উঠেনি। আসল প্রোডাক্ট পাওয়ার জন্য নিশ্চিন্তে অর্ডার করতে পারেন।",
    product: "Ceramide Moisture Cream",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop",
    userTag: "@sumiya_glow",
  },
];

const lookbookImages = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop",
    tag: "@glowelegance.bd",
    likes: "1.2k",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop",
    tag: "@glowelegance.bd",
    likes: "856",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1512290900673-1f198f1a4e10?w=500&auto=format&fit=crop",
    tag: "@glowelegance.bd",
    likes: "2.4k",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&auto=format&fit=crop",
    tag: "@glowelegance.bd",
    likes: "1.8k",
  },
];

export default function LookbookReviews() {
  return (
    <section className="py-16 sm:py-24 bg-stone-50/60 dark:bg-stone-900/30 overflow-hidden border-t border-border/40">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* SECTION HEADER */}
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
              {reviews.map((r, i) => (
                <img key={i} src={r.avatar} alt="User" className="w-8 h-8 rounded-full border-2 border-background object-cover" />
              ))}
            </div>
            <div className="text-xs font-medium">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
              </div>
              <span className="text-muted-foreground">4.9/5 from 2,500+ Reviews</span>
            </div>
          </motion.div>
        </div>

        {/* REVIEWS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {reviews.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 shadow-sm flex flex-col justify-between relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-stone-200 dark:text-stone-800 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm font-light text-foreground/90 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center gap-3">
                <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-border/40" />
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1 truncate">
                    {item.name}
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                  </h4>
                  <span className="text-[10px] text-muted-foreground block truncate">
                    Bought {item.product}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* INSTAGRAM LOOKBOOK GALLERY */}
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
                
                {/* Overlay on Hover */}
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
    </section>
  );
}