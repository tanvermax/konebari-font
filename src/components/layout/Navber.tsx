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
  ChevronDown,
  ChevronRight,
  Home,
  Layers,
  MessageCircle,
  Store,
  User,
  HelpCircle,
  PackageSearch,
  ArrowRight,
} from "lucide-react";
import { useAllOrderQuery } from "@/redux/features/order/Order.api";
import { Badge } from "../ui/badge";
import { useEffect, useState, useCallback, useRef } from "react";
import { Spinner } from "../ui/spinner";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";

// ============ CATEGORY DATA ============
const categoryData = [
  {
    label: "Makeup",
    href: "/shop?category=makeup",
    icon: "💄",
    subcategories: [
      { label: "Face Makeup", href: "/shop?category=makeup&sub=face" },
      { label: "Eyes Makeup", href: "/shop?category=makeup&sub=eyes" },
      { label: "Lips Makeup", href: "/shop?category=makeup&sub=lips" },
      { label: "Makeup Tools", href: "/shop?category=makeup&sub=tools" },
      { label: "Makeup Kits", href: "/shop?category=makeup&sub=kits" },
    ],
  },
  {
    label: "Skin",
    href: "/shop?category=skincare",
    icon: "🧴",
    subcategories: [
      { label: "Cleansers", href: "/shop?category=skincare&sub=cleansers" },
      { label: "Toners", href: "/shop?category=skincare&sub=toners" },
      { label: "Serums", href: "/shop?category=skincare&sub=serums" },
      { label: "Moisturizers", href: "/shop?category=skincare&sub=moisturizers" },
      { label: "Sun Protection", href: "/shop?category=skincare&sub=sunscreen" },
      { label: "Face Masks", href: "/shop?category=skincare&sub=masks" },
      { label: "Eye Care", href: "/shop?category=skincare&sub=eye-care" },
    ],
  },
  {
    label: "Hair",
    href: "/shop?category=hair-care",
    icon: "💇‍♀️",
    subcategories: [
      { label: "Shampoos", href: "/shop?category=hair-care&sub=shampoos" },
      { label: "Conditioners", href: "/shop?category=hair-care&sub=conditioners" },
      { label: "Hair Oils", href: "/shop?category=hair-care&sub=oils" },
      { label: "Hair Serums", href: "/shop?category=hair-care&sub=serums" },
      { label: "Styling Products", href: "/shop?category=hair-care&sub=styling" },
    ],
  },
  {
    label: "Personal Care",
    href: "/shop?category=personal-care",
    icon: "🧖‍♀️",
    subcategories: [
      { label: "Oral Care", href: "/shop?category=personal-care&sub=oral" },
      { label: "Body Care", href: "/shop?category=personal-care&sub=body" },
      { label: "Hand & Feet", href: "/shop?category=personal-care&sub=hands" },
      { label: "Deodorants", href: "/shop?category=personal-care&sub=deodorants" },
    ],
  },
  {
    label: "Mom & Baby",
    href: "/shop?category=mom-baby",
    icon: "👶",
    subcategories: [
      { label: "Maternity Care", href: "/shop?category=mom-baby&sub=maternity" },
      { label: "Baby Skincare", href: "/shop?category=mom-baby&sub=baby-skin" },
      { label: "Baby Hair Care", href: "/shop?category=mom-baby&sub=baby-hair" },
      { label: "Feeding Essentials", href: "/shop?category=mom-baby&sub=feeding" },
    ],
  },
  {
    label: "Fragrance",
    href: "/shop?category=fragrance",
    icon: "🌸",
    subcategories: [
      { label: "Perfumes", href: "/shop?category=fragrance&sub=perfumes" },
      { label: "Body Mists", href: "/shop?category=fragrance&sub=body-mists" },
      { label: "Attars", href: "/shop?category=fragrance&sub=attars" },
      { label: "Gift Sets", href: "/shop?category=fragrance&sub=gift-sets" },
    ],
  },
  {
    label: "Undergarments",
    href: "/shop?category=undergarments",
    icon: "👙",
    subcategories: [
      { label: "Bras", href: "/shop?category=undergarments&sub=bras" },
      { label: "Briefs", href: "/shop?category=undergarments&sub=briefs" },
      { label: "Shapewear", href: "/shop?category=undergarments&sub=shapewear" },
      { label: "Loungewear", href: "/shop?category=undergarments&sub=loungewear" },
    ],
  },
  {
    label: "Combo",
    href: "/shop?category=combo",
    icon: "🎯",
    subcategories: [
      { label: "Skincare Combos", href: "/shop?category=combo&sub=skincare" },
      { label: "Makeup Combos", href: "/shop?category=combo&sub=makeup" },
      { label: "Hair Combos", href: "/shop?category=combo&sub=hair" },
      { label: "Gift Combos", href: "/shop?category=combo&sub=gift" },
    ],
  },
  {
    label: "Jewellery",
    href: "/shop?category=jewellery",
    icon: "💍",
    subcategories: [
      { label: "Necklaces", href: "/shop?category=jewellery&sub=necklaces" },
      { label: "Earrings", href: "/shop?category=jewellery&sub=earrings" },
      { label: "Rings", href: "/shop?category=jewellery&sub=rings" },
      { label: "Bracelets", href: "/shop?category=jewellery&sub=bracelets" },
    ],
  },
  {
    label: "Clearance Sale",
    href: "/shop?category=clearance",
    icon: "🏷️",
    subcategories: [
      { label: "Up to 50% Off", href: "/shop?category=clearance&sub=50" },
      { label: "Up to 70% Off", href: "/shop?category=clearance&sub=70" },
      { label: "Last Chance", href: "/shop?category=clearance&sub=last-chance" },
    ],
  },
  {
    label: "Men",
    href: "/shop?category=men",
    icon: "👨",
    subcategories: [
      { label: "Skincare", href: "/shop?category=men&sub=skincare" },
      { label: "Hair Care", href: "/shop?category=men&sub=hair" },
      { label: "Fragrance", href: "/shop?category=men&sub=fragrance" },
      { label: "Grooming", href: "/shop?category=men&sub=grooming" },
    ],
  },
];

// Special sale/highlight categories
const saleCategories = ["Clearance Sale", "Combo"];

// ============ MOBILE BOTTOM NAVIGATION ============
const bottomNavItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Brands", icon: Store, href: "/brands" },
  { label: "Categories", icon: Layers, href: "/shop" },
  { label: "Cart", icon: ShoppingCartIcon, href: "/cart" },
  { label: "Profile", icon: User, href: "/profile" },
];

// ============ QUICK ACTIONS FOR MOBILE ============
const quickActions = [
  { label: "Wishlist", icon: Heart, href: "/wishlist" },
  { label: "Chat", icon: MessageCircle, href: "/chat" },
  { label: "Orders", icon: PackageSearch, href: "/orders" },
  { label: "Support", icon: HelpCircle, href: "/support" },
];

// ============ MAIN COMPONENT ============
export default function Navbar() {
  const { data: userData, isLoading: isUserLoading } = useUserInfoQuery(undefined);
  const { data: response, isLoading: isOrdersLoading, isFetching } = useAllOrderQuery(undefined, {
    skip: !userData?.data,
  });

  const [cartItemsCount, setCartItemsCount] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // --- Scroll effect ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
console.log(isScrolled);
  // --- Cart logic ---
  const updateCartView = useCallback(() => {
    if (userData?.data) {
      const pendingOrder = response?.data?.find((o: { status: string }) => o.status === "Pending");
      setCartItemsCount(pendingOrder?.orderedItems?.length || 0);
    } else {
      try {
        const localItems = JSON.parse(localStorage.getItem("guestCart") || "[]");
        setCartItemsCount(localItems.length);
      } catch {
        setCartItemsCount(0);
      }
    }
  }, [response, userData]);

  useEffect(() => {
    updateCartView();
  }, [userData, response, updateCartView]);

  useEffect(() => {
    window.addEventListener("cartUpdated", updateCartView);
    window.addEventListener("storage", updateCartView);
    return () => {
      window.removeEventListener("cartUpdated", updateCartView);
      window.removeEventListener("storage", updateCartView);
    };
  }, [updateCartView]);

  // --- Search ---
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  // --- Hover handlers ---
  const handleMouseEnter = (label: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveCategory(label);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 150);
  };

  const showSpinner = isUserLoading || isOrdersLoading || isFetching;

  // Check if a bottom nav item is active
  const isBottomNavActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    if (href === "/shop") return location.pathname === "/shop" || location.pathname.startsWith("/shop");
    return location.pathname === href || location.pathname.startsWith(href);
  };

  // Menu item animation variants
  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  } as any;

  return (
    <>
      {/* ===== TOP ANNOUNCEMENT BAR ===== */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 dark:from-rose-950 dark:via-rose-900 dark:to-rose-950 text-stone-100 text-[11px] font-medium py-2.5 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-2 border-b border-white/5">
        <Sparkles size={12} className="text-rose-400 animate-pulse" />
        <span>Free Delivery On Orders Above ৳2,000 | 100% Authentic Korean Skincare</span>
        <Sparkles size={12} className="text-rose-400 animate-pulse" />
      </div>

      {/* ===== MAIN HEADER ===== */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 md:px-6">
          
          {/* ===== TOP ROW: Logo + Search + Actions ===== */}
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

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/" className="flex items-center">
                  <Logo />
                </Link>
              </motion.div>
            </div>

            {/* Center: Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search for products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 h-10 text-sm rounded-full bg-muted/40 border-border/40 hover:border-rose-300/50 focus:border-rose-400 focus-visible:ring-rose-500/30 transition-all duration-300"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </form>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Search - Mobile */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden size-9 rounded-full border border-border/50 hover:bg-muted/50 transition-colors flex items-center justify-center"
              >
                <Search className="size-4" />
              </motion.button>

              {/* Wishlist */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex rounded-full text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 size-9 transition-all duration-300"
                  aria-label="Wishlist"
                >
                  <Heart size={18} />
                </Button>
              </motion.div>

              {/* Cart */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/cart"
                  className="relative size-9 rounded-full border border-border/50 hover:bg-muted/50 transition-colors flex items-center justify-center"
                >
                  <ShoppingCartIcon size={18} className="text-foreground" />
                  <Badge className="bg-rose-500 text-white border-2 border-background absolute -top-1 -right-1 rounded-full text-[8px] font-bold px-1.5 min-w-[18px] h-[18px] flex items-center justify-center shadow-sm">
                    {showSpinner ? <Spinner className="w-2.5 h-2.5" /> : cartItemsCount}
                  </Badge>
                </Link>
              </motion.div>

              {/* Theme Toggle */}
              <div className="hidden sm:block">
                <ModeToggle />
              </div>

              {/* User Menu / Sign In */}
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
                      className="rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-sm font-semibold px-4 h-9 text-xs transition-all border-0"
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

          {/* ===== BOTTOM ROW: Category Navigation ===== */}
          <div className="hidden lg:flex items-center justify-center gap-0.5 py-2 border-t border-border/30">
            {categoryData.map((category) => {
              const isActive = location.pathname + location.search === category.href;
              const isSale = saleCategories.includes(category.label);
              
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
                      className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap ${
                        isActive
                          ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      } ${isSale ? "text-rose-600 dark:text-rose-400" : ""}`}
                    >
                      <span className="text-base">{category.icon}</span>
                      <span>{category.label}</span>
                      <ChevronDown size={12} className={`opacity-60 ml-0.5 transition-transform duration-200 ${activeCategory === category.label ? "rotate-180" : ""}`} />
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
                      {isSale && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      )}
                    </Link>
                  </motion.div>

                  {/* Dropdown Subcategories */}
                  <AnimatePresence>
                    {activeCategory === category.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-1/2 -translate-x-1/2 mt-1 min-w-[240px] bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-2 z-50"
                        style={{ top: "100%" }}
                      >
                        <div className="space-y-0.5">
                          {category.subcategories.map((sub) => {
                            const isSubActive = location.pathname + location.search === sub.href;
                            return (
                              <Link
                                key={sub.label}
                                to={sub.href}
                                className={`block px-4 py-2.5 rounded-xl text-sm transition-all ${
                                  isSubActive
                                    ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-stone-50 dark:hover:bg-stone-800"
                                }`}
                              >
                                {sub.label}
                              </Link>
                            );
                          })}
                          <div className="border-t border-border/30 my-1.5" />
                          <Link
                            to={category.href}
                            className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all group"
                          >
                            <span>View All {category.label}</span>
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
        </div>
      </header>

      {/* ===== MOBILE SEARCH OVERLAY ===== */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[68px] left-0 right-0 z-40 lg:hidden px-4"
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
                {["Serum", "Moisturizer", "Sunscreen", "Lipstick", "Foundation"].map((suggestion) => (
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
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MOBILE MENU (Side Drawer) ===== */}
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
                transition: {
                  type: "spring",
                  bounce: 0.2,
                  duration: 0.5,
                },
              }}
              exit={{
                x: "-100%",
                opacity: 0,
                transition: {
                  duration: 0.3,
                  ease: "easeInOut",
                },
              }}
              className="fixed top-0 left-0 bottom-0 w-[320px] max-w-[85vw] bg-background/95 backdrop-blur-xl border-r border-border/50 z-50 lg:hidden shadow-2xl"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <Logo />
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="size-8 rounded-full hover:bg-muted/50 transition-colors flex items-center justify-center"
                >
                  <X className="size-4" />
                </motion.button>
              </div>

              {/* Menu Content */}
              <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
                {/* Main Categories */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500/60 mb-3 px-2 flex items-center gap-2">
                    <span className="flex-1 h-px bg-rose-500/20" />
                    <span>Shop by Category</span>
                    <span className="flex-1 h-px bg-rose-500/20" />
                  </p>
                  <div className="space-y-1">
                    {categoryData.map((category, index) => {
                      const isActive = location.pathname + location.search === category.href;
                      const isExpanded = mobileExpanded === category.label;
                      const isSale = saleCategories.includes(category.label);

                      return (
                        <motion.div
                          key={category.label}
                          custom={index}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <div className="border-b border-border/20 last:border-0">
                            <button
                              onClick={() => {
                                if (window.innerWidth < 768) {
                                  setMobileExpanded(isExpanded ? null : category.label);
                                }
                              }}
                              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                                isActive
                                  ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                              } ${isSale ? "text-rose-600 dark:text-rose-400" : ""}`}
                            >
                              <span className="flex items-center gap-3">
                                <span className="text-lg">{category.icon}</span>
                                <span>{category.label}</span>
                                {isSale && <Tag size={12} className="text-rose-500" />}
                              </span>
                              <ChevronRight
                                size={16}
                                className={`transition-transform duration-200 ${
                                  isExpanded ? "rotate-90" : ""
                                }`}
                              />
                            </button>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pl-12 pb-2 pt-1 space-y-0.5">
                                    {category.subcategories.map((sub) => {
                                      const isSubActive = location.pathname + location.search === sub.href;
                                      return (
                                        <Link
                                          key={sub.label}
                                          to={sub.href}
                                          className={`block px-3 py-2.5 rounded-xl text-xs transition-all ${
                                            isSubActive
                                              ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 font-medium"
                                              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                          }`}
                                          onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                          {sub.label}
                                        </Link>
                                      );
                                    })}
                                    <Link
                                      to={category.href}
                                      className="block px-3 py-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      View All {category.label} →
                                    </Link>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

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
                        custom={index + categoryData.length}
                        variants={menuItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <Link
                          to={action.href}
                          className="flex flex-col items-center gap-1.5 p-3.5 rounded-xl bg-muted/30 hover:bg-muted/60 transition-all border border-border/30 hover:border-rose-500/30"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <action.icon className="size-5 text-rose-500" />
                          <span className="text-[10px] font-medium text-center leading-tight">
                            {action.label}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="border-t border-border/40 pt-4">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-xs font-medium text-muted-foreground">Theme</span>
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== MOBILE BOTTOM NAVIGATION ===== */}
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
                        <Badge className="bg-rose-500 text-white border-2 border-background absolute -top-1.5 -right-2.5 rounded-full text-[8px] font-bold px-1 min-w-[16px] h-[16px] flex items-center justify-center shadow-sm">
                          {showSpinner ? <Spinner className="w-2 h-2" /> : cartItemsCount > 99 ? "99+" : cartItemsCount}
                        </Badge>
                      )}
                    </div>
                    <span className={`text-[9px] font-medium tracking-wide ${isActive ? "text-rose-600 dark:text-rose-400 font-semibold" : ""}`}>
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

      {/* ===== FLOATING ACTION BUTTON ===== */}
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

      {/* ===== STYLES ===== */}
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