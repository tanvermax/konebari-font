// components/layout/HomeLayout/CategoriesPage/CategoriesPage.tsx
import { useMemo } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  Layers,
  PackageX,
  Sparkles,
  RefreshCw,
  Grid3X3,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// ✅ IMPORT DUITAI KORTE HOBE
import { useGetCategoriesQuery } from "@/redux/features/category/category.api";
import { useGetSubCategoriesQuery } from "@/redux/features/subcategory/subcategory.api";

const DEFAULT_ICON = "🛍️";

const GRADIENTS = [
  "from-rose-400 via-pink-400 to-fuchsia-300",
  "from-orange-400 via-rose-400 to-pink-200",
//   "from-violet-500 via-purple-500 to-fuchsia-500",
//   "from-pink-400 via-rose-400 to-red-400",
//   "from-amber-400 via-orange-400 to-rose-400",
//   "from-teal-400 via-emerald-400 to-green-500",
//   "from-sky-400 via-blue-400 to-indigo-500",
//   "from-fuchsia-400 via-pink-400 to-rose-400",
];

const CategorySkeleton = () => (
  <div className="space-y-4 mb-10">
    <Skeleton className="h-32 w-full rounded-3xl" />
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-2xl" />
      ))}
    </div>
  </div>
);

export default function CategoriesPage() {
  // ✅ 1. Main Categories Fetch
  const { data: categoriesData, isLoading: isCatLoading, isError: isCatError, refetch: refetchCat } = useGetCategoriesQuery();
  
  // ✅ 2. Sub Categories Fetch
  const { data: subCategoriesData, isLoading: isSubLoading, isError: isSubError, refetch: refetchSub } = useGetSubCategoriesQuery();

  const isLoading = isCatLoading || isSubLoading;
  const isError = isCatError || isSubError;

  // ✅ Grouping Logic (Thik moto string compare kora hoyeche)
  const categories = useMemo(() => {
    const list = Array.isArray(categoriesData) ? categoriesData : [];
    const subList = Array.isArray(subCategoriesData) ? subCategoriesData : [];

    // Main Category gulo filter koro
    const mainCategories = list.filter((c: any) => c && c._id && c.name);

    return mainCategories.map((main: any) => {
      // Oi main category er under er sub-categories khujo
      const matchedSubs = subList.filter((sub: any) => {
        // Backend theke categoryId object ba string hote pare
        const subParentId = sub.categoryId?._id || sub.categoryId;
        return subParentId?.toString() === main._id.toString();
      });

      return {
        ...main,
        subCategories: matchedSubs,
      };
    });
  }, [categoriesData, subCategoriesData]);

  const totalProducts = categories.reduce((s: number, c: any) => s + (c.count || 0), 0);

  const handleRefetch = () => {
    refetchCat();
    refetchSub();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-rose-50/20 to-background dark:from-background dark:via-rose-950/5 dark:to-background">
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-rose-300/20 dark:bg-rose-500/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-32 w-96 h-96 bg-pink-300/20 dark:bg-pink-500/10 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-3 md:px-4 py-6 md:py-10 max-w-7xl">
        {/* HERO BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 md:mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500 p-6 md:p-10 text-white shadow-xl shadow-rose-500/20"
        >
          <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-[11px] font-semibold mb-3">
                <Sparkles className="w-3 h-3" />
                Shop by Category
              </div>
              <h1 className="text-2xl md:text-4xl font-black mb-2 leading-tight">
                Explore All <span className="text-yellow-200">Categories</span>
              </h1>
              <p className="text-sm md:text-base text-white/90 max-w-md">
                Browse our curated collection of {categories.length} categories — find exactly what you need.
              </p>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-black">{categories.length}</p>
                <p className="text-[10px] md:text-xs uppercase tracking-wider text-white/80 font-semibold">Categories</p>
              </div>
              <div className="w-px h-10 bg-white/30" />
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-black">{totalProducts}+</p>
                <p className="text-[10px] md:text-xs uppercase tracking-wider text-white/80 font-semibold">Products</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* LOADING / ERROR / EMPTY */}
        {isLoading ? (
           <div className="space-y-8">
             <CategorySkeleton />
             <CategorySkeleton />
           </div>
        ) : isError ? (
          <div className="py-20 text-center">
            <PackageX className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-lg font-bold mb-2">Failed to Load Data</h2>
            <Button onClick={handleRefetch} className="bg-rose-500 text-white"><RefreshCw className="w-4 h-4 mr-2" /> Retry</Button>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-20 text-center">
            <PackageX className="w-16 h-16 mx-auto text-rose-500 mb-4" />
            <h2 className="text-lg font-bold mb-2">No Categories Found</h2>
          </div>
        ) : (
          /* MAIN CATEGORIES & SUB-CATEGORIES */
          <div className="space-y-10 md:space-y-14">
            {categories.map((mainCat: any, mainIdx: number) => {
              const gradient = GRADIENTS[mainIdx % GRADIENTS.length];
              
              return (
                <motion.div
                  key={mainCat._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden"
                >
                  {/* 1. MAIN CATEGORY BANNER */}
                  <div className={`relative flex items-center h-22 md:h-48 overflow-hidden bg-gradient-to-r ${gradient}`}>
                    {mainCat.image && (
                      <img
                        src={mainCat.image}
                        alt={mainCat.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/30" />
                    
                    <div className="relative z-10 px-6 md:px-10 flex flex-col justify-center h-full text-white w-full">
                      <h2 className="text-xl md:text-5xl font-black mb-2 flex items-center gap-3 drop-shadow-lg">
                         <span className="text-4xl md:text-5xl">{DEFAULT_ICON}</span>
                         {mainCat.name}
                      </h2>
                      <p className="text-[11px] md:text-base text-white/90 max-w-lg drop-shadow-md line-clamp-2">
                        {mainCat.description || `Explore our wide range of ${mainCat.name} products`}
                      </p>
                    </div>
                  </div>

                  {/* 2. SUB-CATEGORIES GRID */}
                  <div className="p-4 md:p-6 bg-card">
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                      
                      {/* View All Box */}
                      <Link
                        to={`/shop?category=${encodeURIComponent(mainCat.name)}`}
                        className={`group flex flex-col items-center justify-center aspect-square rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                      >
                        <Grid3X3 className="w-8 h-8 md:w-10 md:h-10 mb-2 opacity-90 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] md:text-sm font-bold tracking-wide">View All</span>
                      </Link>

                      {/* Sub-Category Boxes */}
                      {mainCat.subCategories && mainCat.subCategories.length > 0 ? (
                        mainCat.subCategories.map((sub: any) => (
                          <Link
                            key={sub._id}
                            to={`/shop?subcategory=${encodeURIComponent(sub.name)}`}
                            className="group flex flex-col items-center justify-center rounded-xl aspect-square  hover:bg-muted/60  hover:border-rose-300 transition-all duration-300 hover:-translate-y-1 p-2 shadow-sm"
                          >
                            {/* Image or Fallback Icon */}
                            <div className="w-full h-full overflow-hidden flex items-center justify-center bg-background  group-hover:scale-105 transition-transform  ">
                              {sub.image ? (
                                <img src={sub.image} alt={sub.name} className="w-full h-full rounded-xl object-cover" />
                              ) : (
                                <span className="text-2xl">🛍️</span>
                              )}
                            </div>
                            {/* Title */}
                            <span className="text-[10px] pt-2 md:text-xs font-semibold text-foreground text-center line-clamp-2 px-1 group-hover:text-rose-600 transition-colors">
                              {sub.name}
                            </span>
                          </Link>
                        ))
                      ) : (
                        <div className="col-span-full py-8 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-2xl border border-dashed border-border/60">
                          <Layers className="w-8 h-8 mb-2 opacity-20" />
                          <span className="text-xs">No sub-categories added yet.</span>
                        </div>
                      )}

                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}