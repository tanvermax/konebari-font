// components/layout/HomeLayout/Navber.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Search, ShoppingCartIcon, Heart, Menu, LogIn, Home, Store, Layers, User } from "lucide-react";
import Logo from "@/assets/icons/logo";
import UserMenu from "@/components/navbar-components/user-menu";
import { ModeToggle } from "./ModeToggler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "../ui/badge";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetCartQuery } from "@/redux/features/cart/cart.api";
import { useGetFavoritesQuery } from "@/redux/features/favorite/favorite.api";
import { computeGuestCartTotals, getGuestFavorites } from "@/lib/guestStorage";
import { useSessionId } from "@/redux/hooks/useSessionId";
import NavbarCategoryMenu from "./HomeLayout/Navber_component/NavbarCategoryMenu";
import MobileMenuDrawer from "./HomeLayout/Navber_component/MobileMenuDrawer";



const bottomNavItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Brands", icon: Store, href: "/brands" },
  { label: "Categories", icon: Layers, href: "/categories" },
  { label: "Cart", icon: ShoppingCartIcon, href: "/cart" },
  { label: "Profile", icon: User, href: "/user/profile" },
];

export default function Navber() {
  // ==========================================
  // ✅ ALL HOOKS MUST BE CALLED AT THE TOP
  // ==========================================
  const { isLoggedIn } = useSessionId();
  const { data: userData, isLoading: isUserLoading } = useUserInfoQuery(undefined);
  const navigate = useNavigate();

  // ✅ Cart & Fav data hooks
  const { data: apiCart } = useGetCartQuery(undefined, { skip: !isLoggedIn });
  const { data: apiFavorites } = useGetFavoritesQuery(undefined, { skip: !isLoggedIn });

  // ✅ UI State hooks
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // ✅ Guest State hooks
  const [guestCartCount, setGuestCartCount] = useState(0);
  const [guestFavCount, setGuestFavCount] = useState(0);

  // ✅ Effect hooks
  useEffect(() => {
    const update = () => {
      const { totalItems } = computeGuestCartTotals();
      setGuestCartCount(totalItems);
      setGuestFavCount(getGuestFavorites().length);
    };
    
    // Initial call
    update();

    // Listeners
    window.addEventListener("cartUpdated", update);
    window.addEventListener("favoriteUpdated", update);
    
    // Cleanup
    return () => {
      window.removeEventListener("cartUpdated", update);
      window.removeEventListener("favoriteUpdated", update);
    };
  }, []);

  // ==========================================
  // ✅ CALCULATIONS (No hooks below this line)
  // ==========================================
  const cartItemsCount = isLoggedIn ? (apiCart?.totalItems || 0) : guestCartCount;
  const favoriteItemsCount = isLoggedIn ? (apiFavorites?.totalItems || 0) : guestFavCount;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 md:px-6">
          
          {/* TOP ROW */}
          <div className="flex items-center justify-between gap-3 py-2 md:py-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden size-9 rounded-full border border-border/50 flex items-center justify-center">
                <Menu className="size-4" />
              </button>
              <Link to="/"><Logo /></Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 h-10 text-sm rounded-full bg-muted/40" />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </form>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="md:hidden size-9 rounded-full border border-border/50 flex items-center justify-center">
                <Search className="size-4" />
              </button>

              <Link to="/favorites" className="relative hidden sm:flex size-9 rounded-full border border-border/50 items-center justify-center">
                <Heart size={18} className={favoriteItemsCount > 0 ? "fill-rose-500 text-rose-500" : "text-muted-foreground"} />
                {favoriteItemsCount > 0 && <Badge className="absolute -top-1 -right-1 bg-rose-500 rounded-full px-1.5 text-[8px]">{favoriteItemsCount}</Badge>}
              </Link>

              <Link to="/cart" className="relative size-9 rounded-full border border-border/50 flex items-center justify-center">
                <ShoppingCartIcon size={18} />
                {cartItemsCount > 0 && <Badge className="absolute -top-1 -right-1 bg-rose-500 rounded-full px-1.5 text-[8px]">{cartItemsCount}</Badge>}
              </Link>

              <div className="hidden sm:block"><ModeToggle /></div>

              {!isUserLoading && userData?.data?.email ? (
                <UserMenu userData={userData?.data} />
              ) : (
                <Button asChild size="sm" className="rounded-full bg-rose-500 text-white h-9 px-4">
                  <Link to="/login"><LogIn size={14} className="mr-1" /> Sign In</Link>
                </Button>
              )}
            </div>
          </div>

          {/* ✅ Category Menu */}
          <NavbarCategoryMenu />
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 border-t border-border/40 pb-safe">
        <div className="flex items-center justify-around py-1.5 px-2">
          {bottomNavItems.map((item) => (
            <Link key={item.label} to={item.href} className="flex flex-col items-center gap-0.5 text-muted-foreground">
              <item.icon size={22} />
              <span className="text-[9px]">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}