// components/layout/Navbar/MobileMenuDrawer.tsx
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Heart, 
  HelpCircle, 
  PackageSearch, 
  AlignHorizontalDistributeEndIcon, 
  Plus, 
  Minus 
} from "lucide-react";
import Logo from "@/assets/icons/logo";

import { useGetCategoriesQuery } from "@/redux/features/category/category.api";
import { useGetSubCategoriesQuery } from "@/redux/features/subcategory/subcategory.api";
import { useMemo, useState } from "react";
import { ModeToggle } from "../../ModeToggler";

const quickActions = [
  { label: "Wishlist", icon: Heart, href: "/favorites" },
  { label: "About", icon: AlignHorizontalDistributeEndIcon, href: "/about" },
  { label: "Orders", icon: PackageSearch, href: "/user/profile" },
  { label: "Support", icon: HelpCircle, href: "/help" },
];

export default function MobileMenuDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  // ✅ State to track which category is expanded
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const { data: categoriesData } = useGetCategoriesQuery(undefined);
  const { data: subCategoriesData } = useGetSubCategoriesQuery();

  // ✅ Group Categories & Subcategories
  const categories = useMemo(() => {
    const list = Array.isArray(categoriesData) ? categoriesData : [];
    const subList = Array.isArray(subCategoriesData) ? subCategoriesData : [];

    return list.map((main: any) => {
      const matchedSubs = subList.filter((sub: any) => {
        const subParentId = sub.categoryId?._id || sub.categoryId;
        return subParentId?.toString() === main._id.toString();
      });

      return {
        ...main,
        subCategories: matchedSubs,
      };
    });
  }, [categoriesData, subCategoriesData]);

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            className="fixed top-0 left-0 bottom-0 w-[320px] max-w-[85vw] bg-background/95 backdrop-blur-xl border-r border-border/50 z-50 lg:hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-border/40">
              <Logo />
              <button onClick={onClose} className="size-8 rounded-full hover:bg-muted/50 flex items-center justify-center">
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)] scrollbar-hide">
              {/* Quick Actions */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500/60 mb-3 px-2 flex items-center gap-2">
                  <span className="flex-1 h-px bg-rose-500/20" /> Quick Actions <span className="flex-1 h-px bg-rose-500/20" />
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <Link key={action.label} to={action.href} onClick={onClose} className="flex flex-col items-center gap-1.5 p-3.5 rounded-xl bg-muted/30 hover:bg-muted/60 transition-all border border-border/30">
                      <action.icon className="size-5 text-rose-500" />
                      <span className="text-[10px] font-medium">{action.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* ✅ Categories & Sub-categories */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500/60 mb-3 px-2 flex items-center gap-2">
                  <span className="flex-1 h-px bg-rose-500/20" /> Shop by Category <span className="flex-1 h-px bg-rose-500/20" />
                </p>
                <div className="space-y-1">
                  {categories.map((cat: any) => {
                    const hasSub = cat.subCategories && cat.subCategories.length > 0;
                    const isExpanded = expandedCategory === cat._id;

                    return (
                      <div key={cat._id} className="flex flex-col">
                        {/* Category Row */}
                        <div className="flex items-center justify-between">
                          <Link 
                            to={`/shop?category=${encodeURIComponent(cat.name)}`} 
                            onClick={onClose} 
                            className="flex-1 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/30 transition-all"
                          >
                            {cat.name}
                          </Link>
                          
                          {/* ✅ + / - Button */}
                          {hasSub && (
                            <button
                              onClick={() => toggleCategory(cat._id)}
                              className="p-2 mr-1 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all"
                            >
                              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
                              </motion.div>
                            </button>
                          )}
                        </div>

                        {/* Subcategory List (Animated) */}
                        <AnimatePresence>
                          {isExpanded && hasSub && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="pl-6 pr-2 py-1 space-y-1">
                                {cat.subCategories.map((sub: any) => (
                                  <Link
                                    key={sub._id}
                                    to={`/shop?subcategory=${encodeURIComponent(sub.name)}`}
                                    onClick={onClose}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
                                  >
                                    {sub.image ? (
                                      <img src={sub.image} alt={sub.name} className="w-5 h-5 rounded-full object-cover" />
                                    ) : (
                                      <span className="text-xs">🛍️</span>
                                    )}
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Theme */}
              <div className="border-t border-border/40 pt-4 flex items-center justify-between px-2">
                <span className="text-xs font-medium text-muted-foreground">Theme</span>
                <ModeToggle />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}