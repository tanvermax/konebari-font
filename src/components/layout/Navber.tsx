/* eslint-disable @typescript-eslint/no-explicit-any */
import Logo from "@/assets/icons/logo";
import UserMenu from "@/components/navbar-components/user-menu";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
    subcategories: [
      { label: "Cleansers", href: "/shop?category=skincare&sub=cleansers" },
      { label: "Toners", href: "/shop?category=skincare&sub=toners" },
      { label: "Serums", href: "/shop?category=skincare&sub=serums" },
      {
        label: "Moisturizers",
        href: "/shop?category=skincare&sub=moisturizers",
      },
      {
        label: "Sun Protection",
        href: "/shop?category=skincare&sub=sunscreen",
      },
      { label: "Face Masks", href: "/shop?category=skincare&sub=masks" },
      { label: "Eye Care", href: "/shop?category=skincare&sub=eye-care" },
    ],
  },
  {
    label: "Hair",
    href: "/shop?category=hair-care",
    subcategories: [
      { label: "Shampoos", href: "/shop?category=hair-care&sub=shampoos" },
      {
        label: "Conditioners",
        href: "/shop?category=hair-care&sub=conditioners",
      },
      { label: "Hair Oils", href: "/shop?category=hair-care&sub=oils" },
      { label: "Hair Serums", href: "/shop?category=hair-care&sub=serums" },
      {
        label: "Styling Products",
        href: "/shop?category=hair-care&sub=styling",
      },
    ],
  },
  {
    label: "Personal care",
    href: "/shop?category=personal-care",
    subcategories: [
      { label: "Oral Care", href: "/shop?category=personal-care&sub=oral" },
      { label: "Body Care", href: "/shop?category=personal-care&sub=body" },
      { label: "Hand & Feet", href: "/shop?category=personal-care&sub=hands" },
      {
        label: "Deodorants",
        href: "/shop?category=personal-care&sub=deodorants",
      },
    ],
  },
  {
    label: "Mom & Baby",
    href: "/shop?category=mom-baby",
    subcategories: [
      {
        label: "Maternity Care",
        href: "/shop?category=mom-baby&sub=maternity",
      },
      { label: "Baby Skincare", href: "/shop?category=mom-baby&sub=baby-skin" },
      {
        label: "Baby Hair Care",
        href: "/shop?category=mom-baby&sub=baby-hair",
      },
      {
        label: "Feeding Essentials",
        href: "/shop?category=mom-baby&sub=feeding",
      },
    ],
  },
  {
    label: "Fragrance",
    href: "/shop?category=fragrance",
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
    subcategories: [
      { label: "Bras", href: "/shop?category=undergarments&sub=bras" },
      { label: "Briefs", href: "/shop?category=undergarments&sub=briefs" },
      {
        label: "Shapewear",
        href: "/shop?category=undergarments&sub=shapewear",
      },
      {
        label: "Loungewear",
        href: "/shop?category=undergarments&sub=loungewear",
      },
    ],
  },
  {
    label: "Combo",
    href: "/shop?category=combo",
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
    subcategories: [
      { label: "Up to 50% Off", href: "/shop?category=clearance&sub=50" },
      { label: "Up to 70% Off", href: "/shop?category=clearance&sub=70" },
      {
        label: "Last Chance",
        href: "/shop?category=clearance&sub=last-chance",
      },
    ],
  },
  {
    label: "Men",
    href: "/shop?category=men",
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

// Mobile Bottom Navigation Items
const bottomNavItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Brands", icon: Store, href: "/brands" },
  { label: "Categories", icon: Layers, href: "/shop" },
  { label: "Cart", icon: ShoppingCartIcon, href: "/cart" },
  { label: "Chat", icon: MessageCircle, href: "/chat" },
];

// ============ COMPONENT ============
export default function Navbar() {
  const { data: userData, isLoading: isUserLoading } =
    useUserInfoQuery(undefined);
  const {
    data: response,
    isLoading: isOrdersLoading,
    isFetching,
  } = useAllOrderQuery(undefined, {
    skip: !userData?.data,
  });

  const [cartItemsCount, setCartItemsCount] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // --- Scroll effect ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Cart logic ---
  const updateCartView = useCallback(() => {
    if (userData?.data) {
      const pendingOrder = response?.data?.find(
        (o: { status: string }) => o.status === "Pending",
      );
      setCartItemsCount(pendingOrder?.orderedItems?.length || 0);
    } else {
      try {
        const localItems = JSON.parse(
          localStorage.getItem("guestCart") || "[]",
        );
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

  const handleCategoryClick = (label: string) => {
    // On mobile, toggle expand; on desktop, navigate
    if (window.innerWidth < 768) {
      setMobileExpanded(mobileExpanded === label ? null : label);
    }
  };

  const showSpinner = isUserLoading || isOrdersLoading || isFetching;

  // Check if a bottom nav item is active
  const isBottomNavActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    if (href === "/shop")
      return (
        location.pathname === "/shop" || location.pathname.startsWith("/shop")
      );
    return location.pathname === href || location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 dark:bg-rose-950 text-stone-100 text-[11px] font-medium py-2 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-2 border-b border-white/10">
        <Sparkles size={12} className="text-rose-400 animate-pulse" />
        <span>
          Free Delivery On Orders Above ৳2,000 | 100% Authentic Korean Skincare
        </span>
      </div>

      <header
        className={`sticky top-2 z-50 w-full mx-auto transition-all duration-500 ${
          isScrolled
            ? "bg-background/80 rounded-full max-w-7xl backdrop-blur-[3px] border-b border-border/40 shadow-sm py-2.5"
            : "bg-background/40 backdrop-blur-[3px] max-w-7xl border-b border-border/20 py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* ===== LEFT: Brand Logo & Mobile Drawer ===== */}
            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-9 w-9 md:hidden hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full"
                    variant="ghost"
                    size="icon"
                    aria-label="Toggle Navigation Menu"
                  >
                    <Menu className="h-5 w-5 text-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-[85vw] max-w-sm p-4 mt-2 md:hidden rounded-3xl border-border/50 shadow-2xl backdrop-blur-2xl bg-background/95 max-h-[80vh] overflow-y-auto"
                >
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold tracking-widest text-rose-500 uppercase px-2 mb-3">
                      Shop by Category
                    </p>

                    {/* Mobile Accordion Menu */}
                    <div className="space-y-1">
                      {categoryData.map((category) => {
                        const isActive =
                          location.pathname + location.search === category.href;
                        const isExpanded = mobileExpanded === category.label;
                        const isSale = saleCategories.includes(category.label);

                        return (
                          <div
                            key={category.label}
                            className="border-b border-border/30 last:border-0"
                          >
                            <button
                              onClick={() =>
                                handleCategoryClick(category.label)
                              }
                              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                                isActive
                                  ? "bg-slate-900 text-white dark:bg-rose-600"
                                  : "hover:bg-stone-100 dark:hover:bg-stone-800 text-foreground"
                              }`}
                            >
                              <span className="flex items-center gap-2.5">
                                {isSale && (
                                  <Tag size={14} className="text-rose-500" />
                                )}
                                <span>{category.label}</span>
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
                                  <div className="pl-4 pb-2 pt-1 space-y-0.5">
                                    {category.subcategories.map((sub) => {
                                      const isSubActive =
                                        location.pathname + location.search ===
                                        sub.href;
                                      return (
                                        <Link
                                          key={sub.label}
                                          to={sub.href}
                                          className={`block px-3 py-2.5 rounded-xl text-xs transition-all ${
                                            isSubActive
                                              ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 font-medium"
                                              : "text-muted-foreground hover:text-foreground hover:bg-stone-50 dark:hover:bg-stone-800"
                                          }`}
                                        >
                                          {sub.label}
                                        </Link>
                                      );
                                    })}
                                    <Link
                                      to={category.href}
                                      className="block px-3 py-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all"
                                    >
                                      View All {category.label} →
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
                </PopoverContent>
              </Popover>

              <Link
                to="/"
                className="flex items-center transition-transform hover:opacity-90 active:scale-95"
              >
                <Logo />
              </Link>
            </div>

            {/* ===== MIDDLE: Desktop Search ===== */}
            <div className="hidden lg:flex flex-1 max-w-sm mx-6">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search serums, cleansers, makeup..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 h-9 text-xs rounded-full bg-stone-100/70 dark:bg-stone-900/60 border-stone-200/60 dark:border-stone-800/80 focus-visible:ring-rose-500/30 focus-visible:bg-background transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              </form>
            </div>

            {/* ===== RIGHT: Action Controls ===== */}
            <div className="flex items-center gap-1.5 md:gap-2">
              {/* ===== ENHANCED MOBILE SEARCH TOGGLE WITH ANIMATION ===== */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden rounded-full text-muted-foreground hover:text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 h-9 w-9 transition-all duration-300 relative"
                aria-label="Search"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isSearchOpen ? 90 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {isSearchOpen ? <X size={18} /> : <Search size={18} />}
                </motion.div>
              </Button>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex rounded-full text-muted-foreground hover:text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 h-9 w-9 transition-all"
                aria-label="Wishlist"
              >
                <Heart size={18} />
              </Button>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-full bg-stone-100 dark:bg-stone-900 hover:bg-stone-200/80 dark:hover:bg-stone-800 transition-all duration-300 hover:scale-105 active:scale-95 border border-border/40"
                aria-label="Shopping Cart"
              >
                <ShoppingCartIcon size={17} className="text-foreground" />
                <Badge className="bg-rose-500 text-white border-2 border-background absolute -top-1.5 -right-1.5 rounded-full text-[9px] font-bold px-1.5 min-w-[18px] h-[18px] flex items-center justify-center shadow-sm">
                  {showSpinner ? (
                    <Spinner className="w-2.5 h-2.5" />
                  ) : (
                    cartItemsCount
                  )}
                </Badge>
              </Link>

              {/* Theme Toggle */}
              <ModeToggle />

              {/* User Menu / Sign In */}
              {!isUserLoading && userData?.data?.email ? (
                <div className="border border-border/50 p-0.5 rounded-full bg-stone-100/50 dark:bg-stone-900/50">
                  <UserMenu userData={userData?.data} />
                </div>
              ) : (
                !isUserLoading && (
                  <Button
                    asChild
                    size="sm"
                    className="rounded-full bg-slate-900 dark:bg-rose-600 hover:bg-slate-800 dark:hover:bg-rose-700 text-white shadow-sm font-normal px-4 h-9 gap-1.5 text-xs transition-all hover:scale-105 active:scale-95 border-0"
                  >
                    <Link to="/login">
                      <LogIn size={13} />
                      <span className="hidden sm:inline">Sign In</span>
                    </Link>
                  </Button>
                )
              )}
            </div>
          </div>

          {/* ===== ENHANCED MOBILE SEARCH DRAWER WITH ADVANCED ANIMATIONS ===== */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  y: 0,
                  transition: {
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                    staggerChildren: 0.05,
                  },
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  y: -10,
                  transition: {
                    duration: 0.3,
                    ease: "easeInOut",
                  },
                }}
                className="lg:hidden pt-3 pb-2 border-t border-border/40 mt-3 overflow-hidden"
              >
                <motion.form
                  onSubmit={handleSearchSubmit}
                  className="relative w-full"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                      delay: 0.1,
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }}
                  exit={{
                    scale: 0.95,
                    opacity: 0,
                    transition: {
                      duration: 0.2,
                    },
                  }}
                >
                  <motion.div
                    className="relative"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      transition: {
                        delay: 0.2,
                        duration: 0.4,
                        ease: "easeOut",
                      },
                    }}
                  >
                    <Input
                      type="text"
                      placeholder="Search serums, cleansers, makeup..."
                      value={searchQuery}
                      autoFocus
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 h-10 text-xs rounded-full bg-stone-100 dark:bg-stone-900 border-border/60 focus-visible:ring-rose-500/30 transition-all duration-200"
                    />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.3,
                        duration: 0.3,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </motion.div>

                    {/* Typing animation indicator */}
                    {searchQuery && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1"
                      >
                        <motion.div
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="w-1 h-1 rounded-full bg-rose-400"
                        />
                        <motion.div
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.2,
                          }}
                          className="w-1 h-1 rounded-full bg-rose-400"
                        />
                        <motion.div
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.4,
                          }}
                          className="w-1 h-1 rounded-full bg-rose-400"
                        />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Quick search suggestions */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: 0.3,
                        duration: 0.4,
                        ease: "easeOut",
                      },
                    }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide"
                  >
                    {[
                      "Serum",
                      "Moisturizer",
                      "Sunscreen",
                      "Cleanser",
                      "Makeup",
                    ].map((suggestion, index) => (
                      <motion.button
                        key={suggestion}
                        type="button"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          transition: {
                            delay: 0.4 + index * 0.05,
                            duration: 0.3,
                            type: "spring",
                            stiffness: 200,
                          },
                        }}
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "rgba(244, 63, 94, 0.1)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          // Optional: auto-submit after a delay
                          setTimeout(() => {
                            navigate(
                              `/shop?search=${encodeURIComponent(suggestion)}`,
                            );
                            setIsSearchOpen(false);
                          }, 300);
                        }}
                        className="flex-shrink-0 px-3 py-1.5 text-[10px] font-medium rounded-full bg-stone-100 dark:bg-stone-800 text-muted-foreground hover:text-foreground transition-all duration-200 border border-border/30"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <hr className="mt-1 hidden md:block" />
        {/* ===== DESKTOP NAVIGATION LINKS (with dropdowns) ===== */}
        <div className="container  mx-auto px-4 md:px-8">
          <div className="hidden md:flex items-center justify-center py-1">
            <NavigationMenu>
              <NavigationMenuList className="gap-0.5 ">
                {categoryData.map((category) => {
                  const isActive =
                    location.pathname + location.search === category.href;
                  const isSale = saleCategories.includes(category.label);

                  return (
                    <NavigationMenuItem
                      key={category.label}
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(category.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <NavigationMenuLink
                        asChild
                        className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                          isActive
                            ? "bg-slate-900 dark:bg-rose-600 text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-stone-800/50"
                        } ${isSale ? "text-rose-600 dark:text-rose-400" : ""}`}
                      >
                        <Link to={category.href}>
                          <span>{category.label}</span>
                          <ChevronDown size={12} className="opacity-60" />
                        </Link>
                      </NavigationMenuLink>

                      {/* Dropdown Subcategories */}
                      <AnimatePresence>
                        {activeCategory === category.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-1/2 -translate-x-1/2 mt-2 min-w-[200px] bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-2 z-50"
                            style={{ top: "100%" }}
                          >
                            <div className="space-y-0.5">
                              {category.subcategories.map((sub) => {
                                const isSubActive =
                                  location.pathname + location.search ===
                                  sub.href;
                                return (
                                  <Link
                                    key={sub.label}
                                    to={sub.href}
                                    className={`block px-3.5 py-2.5 rounded-xl text-xs transition-all ${
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
                                className="block px-3.5 py-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all"
                              >
                                View All {category.label} →
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </header>

      {/* ===== MOBILE BOTTOM NAVIGATION BAR ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-background/95 backdrop-blur-xl border-t border-border/40 shadow-lg">
          <div className="flex items-center justify-around py-1.5 px-2">
            {bottomNavItems.map((item) => {
              const isActive = isBottomNavActive(item.href);
              const Icon = item.icon;

              // Special handling for Cart badge
              const isCart = item.label === "Cart";

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 relative ${
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
                        {showSpinner ? (
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
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-muted-foreground"
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
              );
            })}
          </div>

          {/* Safe area spacer for notch phones */}
          <div className="h-safe-bottom bg-transparent" />
        </div>
      </div>
    </>
  );
}