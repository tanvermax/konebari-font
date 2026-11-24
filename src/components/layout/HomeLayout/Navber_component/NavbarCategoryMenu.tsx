// components/layout/Navbar/NavbarCategoryMenu.tsx
import { useState, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight } from "lucide-react";
import { useGetCategoriesQuery } from "@/redux/features/category/category.api";
import { useGetSubCategoriesQuery } from "@/redux/features/subcategory/subcategory.api";

export default function NavbarCategoryMenu() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  // ✅ Fetch Categories & Subcategories
  const { data: categoriesData } = useGetCategoriesQuery(undefined);
  const { data: subCategoriesData } = useGetSubCategoriesQuery();

  // ✅ Grouping logic
  const categoryData = useMemo(() => {
    const list = Array.isArray(categoriesData) ? categoriesData : [];
    const subList = Array.isArray(subCategoriesData) ? subCategoriesData : [];

    return list.map((c: any) => {
      const matchedSubs = subList.filter((sub: any) => {
        const subParentId = sub.categoryId?._id || sub.categoryId;
        return subParentId?.toString() === c._id.toString();
      });

      return {
        ...c,
        subcategories: matchedSubs,
      };
    });
  }, [categoriesData, subCategoriesData]);

  const currentCategory = new URLSearchParams(location.search).get("category") || "";

  const handleMouseEnter = (id: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveCategory(id);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setActiveCategory(null), 150);
  };

  if (categoryData.length === 0) return null;

  return (
    <div className="hidden lg:flex items-center justify-center gap-1 py-2 border-t border-border/30 flex-wrap">
      {categoryData.map((category: any) => {
        const isActive = currentCategory.toLowerCase() === category.name.toLowerCase();
        const hasSub = category.subcategories && category.subcategories.length > 0;

        return (
          <div
            key={category._id}
            className="relative"
            onMouseEnter={() => handleMouseEnter(category._id)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className={`relative px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <span>{category.name}</span>
              {/* ✅ Plus icon (only if sub-categories exist) */}
              {hasSub && (
                <motion.div
                  animate={{ rotate: activeCategory === category._id ? 45 : 0 }}
                  className="w-4 h-4 rounded-full bg-muted flex items-center justify-center"
                >
                  <Plus className="w-3 h-3" />
                </motion.div>
              )}
            </Link>

            {/* Subcategories Dropdown */}
            <AnimatePresence>
              {activeCategory === category._id && hasSub && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 -translate-x-1/2 mt-2 min-w-[220px] bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-2 z-50"
                  style={{ top: "100%" }}
                >
                  <div className="space-y-0.5">
                    {category.subcategories.map((sub: any) => (
                      <Link
                        key={sub._id}
                        to={`/shop?subcategory=${encodeURIComponent(sub.name)}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                      >
                        {sub.image ? (
                           <img src={sub.image} alt={sub.name} className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                           <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-[10px]">🛍️</span>
                        )}
                        {sub.name}
                      </Link>
                    ))}
                    <div className="border-t border-border/30 my-1.5" />
                    <Link
                      to={`/shop?category=${encodeURIComponent(category.name)}`}
                      className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all group"
                    >
                      <span>View All {category.name}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}