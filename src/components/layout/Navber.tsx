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
  ArrowRight
} from "lucide-react";
import { useAllOrderQuery } from "@/redux/features/order/Order.api";
import { Badge } from "../ui/badge";
import { useEffect, useState, useCallback } from "react";
import { Spinner } from "../ui/spinner";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";

const categoryLinks = [
  { href: "/shop?category=skincare", label: "Skincare" },
  { href: "/shop?category=makeup", label: "Makeup" },
  { href: "/shop?category=hair-care", label: "Hair Care" },
  { href: "/shop?category=body-care", label: "Body Care" },
  { href: "/shop?sort=bestseller", label: "Best Sellers" },
];

export default function Navbar() {
  const { data: userData, isLoading: isUserLoading } = useUserInfoQuery(undefined);
  const { data: response, isLoading: isOrdersLoading, isFetching } = useAllOrderQuery(undefined, {
    skip: !userData?.data
  });

  const [cartItemsCount, setCartItemsCount] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const showSpinner = isUserLoading || isOrdersLoading || isFetching;

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 dark:bg-rose-950 text-stone-100 text-[11px] font-medium py-2 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-2 border-b border-white/10">
        <Sparkles size={12} className="text-rose-400 animate-pulse" />
        <span>Free Delivery On Orders Above ৳2,000 | 100% Authentic Korean Skincare</span>
      </div>

      <header
        className={`sticky  top-2 z-50 w-full mx-auto transition-all duration-500 ${
          isScrolled
            ? "bg-background/80 rounded-full max-w-7xl backdrop-blur-[3px] border-b border-border/40 shadow-sm py-2.5"
            : "bg-background/40 backdrop-blur-[3px] max-w-7xl border-b border-border/20 py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Brand Logo & Mobile Drawer */}
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
                  className="w-70 p-4 mt-2 md:hidden rounded-3xl border-border/50 shadow-2xl backdrop-blur-2xl bg-background/95 space-y-3"
                >
                  <p className="text-[10px] font-semibold tracking-widest text-rose-500 uppercase px-2">Explore Collections</p>
                  <NavigationMenu className="max-w-none *:w-full">
                    <NavigationMenuList className="flex-col items-start gap-1">
                      {categoryLinks.map((link, index) => {
                        const isActive = location.pathname + location.search === link.href;
                        return (
                          <NavigationMenuItem key={index} className="w-full">
                            <NavigationMenuLink
                              asChild
                              className={`w-full justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                                isActive
                                  ? "bg-slate-900 text-white dark:bg-rose-600 font-semibold"
                                  : "hover:bg-stone-100 dark:hover:bg-stone-800 text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <Link to={link.href} className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <Tag size={14} className={isActive ? "text-rose-400" : "text-stone-400"} />
                                  <span>{link.label}</span>
                                </div>
                                <ArrowRight size={13} className="opacity-60" />
                              </Link>
                            </NavigationMenuLink>
                          </NavigationMenuItem>
                        );
                      })}
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>

              <Link to="/" className="flex items-center transition-transform hover:opacity-90 active:scale-95">
                <Logo />
              </Link>
            </div>

            {/* Middle: Desktop Search Input */}
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

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center justify-center">
              <NavigationMenu>
                <NavigationMenuList className="gap-1 bg-stone-100/60 dark:bg-stone-900/40 p-1 rounded-full border border-stone-200/50 dark:border-stone-800/50">
                  {categoryLinks.map((link, index) => {
                    const isActive = location.pathname + location.search === link.href;
                    return (
                      <NavigationMenuItem key={index}>
                        <NavigationMenuLink
                          asChild
                          className={`relative px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${
                            isActive
                              ? "bg-slate-900 dark:bg-rose-600 text-white shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-stone-800/50"
                          }`}
                        >
                          <Link to={link.href}>{link.label}</Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-1.5 md:gap-2">
              
              {/* Search Toggle for Mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden rounded-full text-muted-foreground hover:text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 h-9 w-9"
                aria-label="Search"
              >
                {isSearchOpen ? <X size={18} /> : <Search size={18} />}
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

              {/* Shopping Cart */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-full bg-stone-100 dark:bg-stone-900 hover:bg-stone-200/80 dark:hover:bg-stone-800 transition-all duration-300 hover:scale-105 active:scale-95 border border-border/40"
                aria-label="Shopping Cart"
              >
                <ShoppingCartIcon size={17} className="text-foreground" />
                <Badge className="bg-rose-500 text-white border-2 border-background absolute -top-1.5 -right-1.5 rounded-full text-[9px] font-bold px-1.5 min-w-[18px] h-[18px] flex items-center justify-center shadow-sm">
                  {showSpinner ? <Spinner className="w-2.5 h-2.5" /> : cartItemsCount}
                </Badge>
              </Link>

              {/* Dark/Light Mode Switcher */}
              <ModeToggle />

              {/* User Authentication / Profile Menu */}
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

          {/* Expandable Search Drawer for Mobile */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden pt-3 pb-2 border-t border-border/40 mt-3 overflow-hidden"
              >
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Search serums, cleansers, makeup..."
                    value={searchQuery}
                    autoFocus
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 h-10 text-xs rounded-full bg-stone-100 dark:bg-stone-900 border-border/60 focus-visible:ring-rose-500/30"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}