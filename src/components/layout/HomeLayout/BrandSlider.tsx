import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

// জনপ্রিয় কসমোটিক এবং জুয়েলারি ব্র্যান্ড লোগো লিস্ট (SVG / PNG Images)
const brandLogos = [
  {
    name: "Chanel",
    logo: "https://upload.wikimedia.org/wikipedia/en/9/92/Chanel_logo_interlocking_cs.svg",
  },
  {
    name: "Dior",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Dior_Logo.svg",
  },
  {
    name: "L'Oréal",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/L%27Or%C3%A9al_logo.svg",
  },
  {
    name: "Estée Lauder",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv_wWNFbpRgGE2hu-vk8JpswjRiqsCFBwj3dWssKzNJA&s=10",
  },
  {
    name: "Cartier",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2h12FUoVno1Us-0u_8w3YJzckRJYwOIeUgh1BBCg1Yg&s=10",
  },
  {
    name: "Pandora",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf1_lurigFchQN4beQ-cV5SKTnswHVMcuP3tmSc1M3ww&s=10",
  },
  {
    name: "Tiffany & Co.",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXhym0hERmhZWWcHOt3hhTlJB_nxLD3ebFOHA1wzjA4A&s=10",
  },
  {
    name: "COSRX",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3fhBwhjx3LWa2QgbQDXA--sGiLUwCeIR_pepXvHniKw&s=10",
  },
];

// রিপিট করার জন্য ডুপ্লিকেট অ্যারে তৈরি
const duplicatedLogos = [...brandLogos, ...brandLogos, ...brandLogos];

export default function BrandSlider() {
  return (
    <section className="py-12 bg-stone-50 dark:bg-[#0D0D0D] border-y border-border/40 overflow-hidden">
      <div className="container mx-auto px-4 mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[11px] font-medium tracking-wider uppercase mb-2">
          <Sparkles size={12} />
          <span>Authorized Partners</span>
        </div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Top Cosmetic & Jewellery Brands We Carry
        </h3>
      </div>

      {/* Infinite Seamless Scrolling Container */}
      <div className="relative w-full overflow-hidden flex items-center [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <motion.div
          className="flex items-center gap-12 sm:gap-16 whitespace-nowrap w-max"
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20, // গতি সামঞ্জস্য করতে সময় কমানো/ বাড়ানো যাবে
          }}
        >
          {duplicatedLogos.map((brand, index) => (
            <div
              key={index}
              className="flex items-center justify-center opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-110 cursor-pointer px-4"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-7 sm:h-9 w-auto max-w-[120px] object-contain dark:invert"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}