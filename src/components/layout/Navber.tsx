/* eslint-disable @typescript-eslint/no-explicit-any */
import Logo from "@/assets/icons/logo";
import UserMenu from "@/components/navbar-components/user-menu";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggler";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { Link, useLocation, useNavigate } from "react-router";
import {
  Heart,
  ShoppingCartIcon,
  Sparkles,
  Search,
  LogIn,
  Menu,
  X,
  Tag,

  Home,
  Layers,
  MessageCircle,
  Store,
  User,
  HelpCircle,
  PackageSearch,
  ArrowRight,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { useEffect, useState, useRef, useMemo } from "react";
import { Spinner } from "../ui/spinner";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Cart & Favorite counts
import { useGetCartQuery } from "@/redux/features/cart/cart.api";
import { useGetFavoritesQuery } from "@/redux/features/favorite/favorite.api";
import {
  computeGuestCartTotals,
  getGuestFavorites,
} from "@/lib/guestStorage";
import { useSessionId } from "@/redux/hooks/useSessionId";

// ✅ Dynamic Categories from API
import { useCategoriesQuery } from "@/redux/features/product/product.api";

// ============ CATEGORY ICONS MAP ============
// ✅ DB category name → Emoji icon
const CATEGORY_ICONS: Record<string, string> = {
  // Your actual categories
  "Body Care": "🧖‍♀️",
  "Jewelry": "💍",
  "Jewellery": "💍",

  // Common ones (case-insensitive match হবে)
  makeup: "💄",
  skin: "🧴",
  skincare: "🧴",
  hair: "💇‍♀️",
  "hair care": "💇‍♀️",
  "personal care": "🧖‍♀️",
  "mom & baby": "👶",
  "mom and baby": "👶",
  fragrance: "🌸",
  perfume: "🌸",
  undergarments: "👙",
  combo: "🎯",
  "clearance sale": "🏷️",
  clearance: "🏷️",
  men: "👨",
  pet: "🐾",
  "pet supplies": "🐾",
  automotive: "🚗",
  "musical instruments": "🎸",
  other: "📦",
};

// ✅ Default icon
const DEFAULT_ICON = "🛍️";

// ============ QUICK ACTIONS ============
const quickActions = [
  { label: "Wishlist", icon: Heart, href: "/favorites" },
  { label: "Chat", icon: MessageCircle, href: "/chat" },
  { label: "Orders", icon: PackageSearch, href: "/orders" },
  { label: "Support", icon: HelpCircle, href: "/support" },
];

// ============ BOTTOM NAV ============
const bottomNavItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Brands", icon: Store, href: "/brands" },
  { label: "Categories", icon: Layers, href: "/shop" },
  { label: "Cart", icon: ShoppingCartIcon, href: "/cart" },
  { label: "Profile", icon: User, href: "/profile" },
];

// ============ SALE LABELS ============
const SALE_LABELS = ["clearance sale", "combo", "sale"];

// ============ HELPER: Get Icon ============
const getCategoryIcon = (name: string): string => {
  if (!name) return DEFAULT_ICON;

  const lower = name.toLowerCase().trim();

  // Direct match
  if (CATEGORY_ICONS[name]) return CATEGORY_ICONS[name];

  // Case-insensitive match
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (key.toLowerCase() === lower) return icon;
  }

  // Partial match
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return icon;
    }
  }

  return DEFAULT_ICON;
};

// ============ MAIN COMPONENT ============
export default function Navbar() {
  // ✅ Auth + Session
  const { isLoggedIn } = useSessionId();
  const { data: userData, isLoading: isUserLoading } = useUserInfoQuery(undefined);

  // ✅ Counts
  const { data: apiCart, isFetching: isCartFetching } = useGetCartQuery(
    undefined,
    { skip: !isLoggedIn, pollingInterval: 30000 }
  );

  const { data: apiFavorites, isFetching: isFavFetching } = useGetFavoritesQuery(
    undefined,
    { skip: !isLoggedIn, pollingInterval: 30000 }
  );

  // ✅ Dynamic Categories
  const { data: categoriesData } = useCategoriesQuery(undefined);

  // ✅ Build categoryData from API
  const categoryData = useMemo(() => {
    const list = Array.isArray(categoriesData) ? categoriesData : [];

    return list
      .filter((c: any) => c && (c.name || c._id || c.title))
      .map((c: any) => {
        const name = c.name || c._id || c.title || "";

        return {
          label: name,
          href: `/shop?category=${encodeURIComponent(name)}`,
          icon: getCategoryIcon(name),
          count: c.count || 0,
          subcategories: [
            // ✅ You can later fetch real subcategories
            {
              label: `All ${name}`,
              href: `/shop?category=${encodeURIComponent(name)}`,
            },
          ],
        };
      });
  }, [categoriesData]);

  // ✅ Guest counts
  const [guestCartCount, setGuestCartCount] = useState(0);
  const [guestFavCount, setGuestFavCount] = useState(0);

  useEffect(() => {
    const update = () => {
      const { totalItems } = computeGuestCartTotals();
      setGuestCartCount(totalItems);
      setGuestFavCount(getGuestFavorites().length);
    };
    update();
    window.addEventListener("cartUpdated", update);
    window.addEventListener("favoriteUpdated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cartUpdated", update);
      window.removeEventListener("favoriteUpdated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  // ✅ Final counts
  const cartItemsCount = isLoggedIn
    ? apiCart?.totalItems ||
      apiCart?.data?.totalItems ||
      (Array.isArray(apiCart?.items)
        ? apiCart.items.reduce((s: number, i: any) => s + (i.quantity || 0), 0)
        : 0)
    : guestCartCount;

  const favoriteItemsCount = isLoggedIn
    ? apiFavorites?.totalItems ||
      apiFavorites?.data?.totalItems ||
      (Array.isArray(apiFavorites?.items) ? apiFavorites.items.length : 0)
    : guestFavCount;

  const showCartSpinner = isCartFetching;
  const showFavSpinner = isFavFetching;

  // ============ UI STATE ============
  const [, setIsScrolled] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Current URL category (for highlighting active)
  const currentCategory = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "";
  }, [location.search]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleMouseEnter = (label: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveCategory(label);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setActiveCategory(null), 150);
  };

  const isBottomNavActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    if (href === "/shop") return location.pathname.startsWith("/shop");
    return location.pathname === href || location.pathname.startsWith(href);
  };

  // ✅ Check if category active
  const isCategoryActive = (categoryName: string) => {
    if (!currentCategory) return false;
    return currentCategory.toLowerCase() === categoryName.toLowerCase();
  };

  const isSaleLabel = (name: string) => {
    return SALE_LABELS.some((s) => name.toLowerCase().includes(s));
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] },
    }),
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  } as any;

  return (
    <>
      {/* ===== TOP ANNOUNCEMENT BAR ===== */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 dark:from-rose-950 dark:via-rose-900 dark:to-rose-950 text-stone-100 text-[11px] font-medium py-2.5 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-2 border-b border-white/5">
        <Sparkles size={12} className="text-rose-400 animate-pulse" />
        <span>Free Delivery On Orders Above ৳2,000 | 100% Authentic Beauty</span>
        <Sparkles size={12} className="text-rose-400 animate-pulse" />
      </div>

      {/* ===== MAIN HEADER ===== */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 md:px-6">
          {/* ===== TOP ROW ===== */}
          <div className="flex items-center justify-between gap-3 py-2 md:py-3">
            {/* Left: Logo & Mobile Menu */}
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden relative size-9 rounded-full border border-border/50 hover:bg-muted/50 transition-colors flex items-center justify-center"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {isMobileMenuOpen ? (
                    <X className="size-4 text-rose-500" />
                  ) : (
                    <Menu className="size-4" />
                  )}
                </motion.div>
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to="/" className="flex items-center">
                  <Logo />
                </Link>
              </motion.div>
            </div>

            {/* Center: Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search products, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 h-10 text-sm rounded-full bg-muted/40 border-border/40 focus-visible:ring-rose-500/30"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </form>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden size-9 rounded-full border border-border/50 hover:bg-muted/50 transition-colors flex items-center justify-center"
              >
                <Search className="size-4" />
              </motion.button>

              {/* Wishlist */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/favorites"
                  className="relative hidden sm:flex size-9 rounded-full border border-border/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors items-center justify-center group"
                >
                  <Heart
                    size={18}
                    className={`transition-colors ${
                      favoriteItemsCount > 0
                        ? "fill-rose-500 text-rose-500"
                        : "text-muted-foreground group-hover:text-rose-500"
                    }`}
                  />
                  {favoriteItemsCount > 0 && (
                    <Badge className="bg-rose-500 text-white border-2 border-background absolute -top-1 -right-1 rounded-full text-[8px] font-bold px-1.5 min-w-[18px] h-[18px] flex items-center justify-center">
                      {showFavSpinner ? (
                        <Spinner className="w-2.5 h-2.5" />
                      ) : favoriteItemsCount > 99 ? (
                        "99+"
                      ) : (
                        favoriteItemsCount
                      )}
                    </Badge>
                  )}
                </Link>
              </motion.div>

              {/* Cart */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/cart"
                  className="relative size-9 rounded-full border border-border/50 hover:bg-muted/50 transition-colors flex items-center justify-center"
                >
                  <ShoppingCartIcon size={18} className="text-foreground" />
                  {cartItemsCount > 0 && (
                    <Badge className="bg-rose-500 text-white border-2 border-background absolute -top-1 -right-1 rounded-full text-[8px] font-bold px-1.5 min-w-[18px] h-[18px] flex items-center justify-center">
                      {showCartSpinner ? (
                        <Spinner className="w-2.5 h-2.5" />
                      ) : cartItemsCount > 99 ? (
                        "99+"
                      ) : (
                        cartItemsCount
                      )}
                    </Badge>
                  )}
                </Link>
              </motion.div>

              <div className="hidden sm:block">
                <ModeToggle />
              </div>

              {/* User */}
              {!isUserLoading && userData?.data?.email ? (
                <div className="border border-border/50 p-0.5 rounded-full bg-stone-100/50 dark:bg-stone-900/50">
                  <UserMenu userData={userData?.data} />
                </div>
              ) : (
                !isUserLoading && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      asChild
                      size="sm"
                      className="rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-sm font-semibold px-4 h-9 text-xs border-0"
                    >
                      <Link to="/login" className="flex items-center gap-1.5">
                        <LogIn size={14} />
                        <span className="hidden sm:inline">Sign In</span>
                      </Link>
                    </Button>
                  </motion.div>
                )
              )}
            </div>
          </div>

          {/* ===== BOTTOM ROW: Category Navigation (Dynamic) ===== */}
          {categoryData.length > 0 && (
            <div className="hidden lg:flex items-center justify-center gap-0.5 py-2 border-t border-border/30 flex-wrap">
              {categoryData.map((category) => {
                const isActive = isCategoryActive(category.label);
                const isSale = isSaleLabel(category.label);

                return (
                  <div
                    key={category.label}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(category.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Link
                        to={category.href}
                        className={`relative px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap ${
                          isActive
                            ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        } ${isSale ? "text-rose-600 dark:text-rose-400" : ""}`}
                      >
                        <span className="text-base">{category.icon}</span>
                        <span>{category.label}</span>
                        {category.count > 0 && (
                          <span className="text-[9px] opacity-60">
                            ({category.count})
                          </span>
                        )}
                        {isSale && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        )}
                        {isActive && (
                          <motion.div
                            layoutId="desktopNavIndicator"
                            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-rose-500"
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.4,
                            }}
                          />
                        )}
                      </Link>
                    </motion.div>

                    {/* Subcategories dropdown */}
                    <AnimatePresence>
                      {activeCategory === category.label &&
                        category.subcategories.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-1/2 -translate-x-1/2 mt-1 min-w-[220px] bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-2 z-50"
                            style={{ top: "100%" }}
                          >
                            <div className="space-y-0.5">
                              {category.subcategories.map((sub) => (
                                <Link
                                  key={sub.label}
                                  to={sub.href}
                                  className="block px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-stone-50 dark:hover:bg-stone-800 transition-all"
                                >
                                  {sub.label}
                                </Link>
                              ))}
                              <div className="border-t border-border/30 my-1.5" />
                              <Link
                                to={category.href}
                                className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all group"
                              >
                                <span>View All {category.label}</span>
                                <ArrowRight
                                  size={14}
                                  className="group-hover:translate-x-1 transition-transform"
                                />
                              </Link>
                            </div>
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* ===== MOBILE SEARCH OVERLAY ===== */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[120px] left-0 right-0 z-40 lg:hidden px-4"
          >
            <div className="bg-background/95 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl p-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  autoFocus
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 h-12 text-sm rounded-xl bg-muted/30 border-border/50 focus-visible:ring-rose-500/30"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </form>
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                {["Serum", "Moisturizer", "Sunscreen", "Lipstick", "Foundation"].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setTimeout(() => {
                          navigate(`/shop?search=${suggestion}`);
                          setIsSearchOpen(false);
                        }, 300);
                      }}
                      className="flex-shrink-0 px-3.5 py-1.5 text-[10px] font-medium rounded-full bg-muted/30 hover:bg-muted/60 transition-all border border-border/30"
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MOBILE MENU DRAWER ===== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: { type: "spring", bounce: 0.2, duration: 0.5 },
              }}
              exit={{
                x: "-100%",
                opacity: 0,
                transition: { duration: 0.3, ease: "easeInOut" },
              }}
              className="fixed top-0 left-0 bottom-0 w-[320px] max-w-[85vw] bg-background/95 backdrop-blur-xl border-r border-border/50 z-50 lg:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-border/40">
                <Logo />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="size-8 rounded-full hover:bg-muted/50 transition-colors flex items-center justify-center"
                >
                  <X className="size-4" />
                </motion.button>
              </div>

              <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
                {/* Quick Actions */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500/60 mb-3 px-2 flex items-center gap-2">
                    <span className="flex-1 h-px bg-rose-500/20" />
                    <span>Quick Actions</span>
                    <span className="flex-1 h-px bg-rose-500/20" />
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <motion.div
                        key={action.label}
                        custom={index}
                        variants={menuItemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Link
                          to={action.href}
                          className="relative flex flex-col items-center gap-1.5 p-3.5 rounded-xl bg-muted/30 hover:bg-muted/60 transition-all border border-border/30"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <action.icon className="size-5 text-rose-500" />
                          <span className="text-[10px] font-medium text-center leading-tight">
                            {action.label}
                          </span>
                          {action.label === "Wishlist" && favoriteItemsCount > 0 && (
                            <Badge className="bg-rose-500 text-white absolute top-1.5 right-1.5 rounded-full text-[8px] font-bold px-1.5 min-w-[16px] h-[16px] flex items-center justify-center">
                              {favoriteItemsCount > 99 ? "99+" : favoriteItemsCount}
                            </Badge>
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* ✅ Dynamic Categories */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500/60 mb-3 px-2 flex items-center gap-2">
                    <span className="flex-1 h-px bg-rose-500/20" />
                    <span>Shop by Category</span>
                    <span className="flex-1 h-px bg-rose-500/20" />
                  </p>
                  <div className="space-y-1">
                    {categoryData.map((category, index) => {
                      const isActive = isCategoryActive(category.label);
                      const isSale = isSaleLabel(category.label);

                      return (
                        <motion.div
                          key={category.label}
                          custom={index}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <div className="border-b border-border/20 last:border-0">
                            <Link
                              to={category.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                                isActive
                                  ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                              } ${isSale ? "text-rose-600 dark:text-rose-400" : ""}`}
                            >
                              <span className="flex items-center gap-3">
                                <span className="text-lg">{category.icon}</span>
                                <span>{category.label}</span>
                                {category.count > 0 && (
                                  <span className="text-[10px] opacity-60">
                                    ({category.count})
                                  </span>
                                )}
                                {isSale && <Tag size={12} className="text-rose-500" />}
                              </span>
                            </Link>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Theme */}
                <div className="border-t border-border/40 pt-4">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Theme
                    </span>
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="bg-background/95 backdrop-blur-xl border-t border-border/40 shadow-lg"
        >
          <div className="flex items-center justify-around py-1.5 px-2">
            {bottomNavItems.map((item) => {
              const isActive = isBottomNavActive(item.href);
              const Icon = item.icon;
              const isCart = item.label === "Cart";

              return (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <Link
                    to={item.href}
                    className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="relative">
                      <Icon
                        size={22}
                        className={`transition-all duration-200 ${
                          isActive ? "scale-110" : ""
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      {isCart && cartItemsCount > 0 && (
                        <Badge className="bg-rose-500 text-white border-2 border-background absolute -top-1.5 -right-2.5 rounded-full text-[8px] font-bold px-1 min-w-[16px] h-[16px] flex items-center justify-center">
                          {showCartSpinner ? (
                            <Spinner className="w-2 h-2" />
                          ) : cartItemsCount > 99 ? (
                            "99+"
                          ) : (
                            cartItemsCount
                          )}
                        </Badge>
                      )}
                    </div>
                    <span
                      className={`text-[9px] font-medium tracking-wide ${
                        isActive
                          ? "text-rose-600 dark:text-rose-400 font-semibold"
                          : ""
                      }`}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="bottomNavIndicator"
                        className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-rose-500"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.4,
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
          <div className="h-safe-bottom bg-transparent" />
        </motion.div>
      </div>

      {/* ===== FAB ===== */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-20 right-4 z-40 md:hidden"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="size-12 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/40 flex items-center justify-center"
          onClick={() => navigate("/shop")}
        >
          <Sparkles className="size-5 fill-current" />
        </motion.button>
      </motion.div>

      <style>{`
        .h-safe-bottom {
          height: env(safe-area-inset-bottom, 0px);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}