import Logo from "@/assets/icons/logo"
// import NotificationMenu from "@/components/navbar-components/notification-menu"
import UserMenu from "@/components/navbar-components/user-menu"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ModeToggle } from "./ModeToggler"

import { useUserInfoQuery } from "@/redux/features/auth/auth.api"

import { Link, useLocation,
  //  useNavigate 
  } from "react-router"

import {
  // ArrowDown,
  Heart, ShoppingCartIcon
} from "lucide-react"


import {
  Home,
  ShoppingBag,
  // Tag,
  // Store,
  MapPin,
  Users,
  HelpCircle,
} from "lucide-react";
import { useAllOrderQuery } from "@/redux/features/order/Order.api"
import { Badge } from "../ui/badge"
import { useEffect, useState } from "react"
import { Spinner } from "../ui/spinner"
// import ProductSearch from "./HomeShope/ProductSearch"




const navigationLinks = [
  { href: "/", label: "Home", active: true, icon: Home },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  // { href: "/offers", label: "Offers", icon: Tag },
  // { href: "/brands", label: "Brands", icon: Store },
  // { href: "/facebook", label: "Facebook", icon: Facebook },
  { href: "/ordertrack", label: "Order Tracking", icon: MapPin },
  { href: "/about", label: "About Us", icon: Users },
  { href: "/help", label: "Help", icon: HelpCircle },
];


export default function Navber() {
  const { data } = useUserInfoQuery(undefined);
  // console.log(data.data.email)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: response, isLoading, isFetching, refetch } = useAllOrderQuery(undefined);

  // const [searchTerm, setSearchTerm] = useState("");
  // ... other states
  const [cartData, setCartData] = useState({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    orderedItems: [] as any[],
    totalPrice: 0,
    status: 'Pending'
  });
  // const [page, setPage] = useState(1);
  // const navigate = useNavigate();
  const location = useLocation();

  // const handleSearch = (val: string) => {
  //   setSearchTerm(val);

  //   // If user is NOT on the shop page, redirect them to the shop page with the search query
  //   if (location.pathname !== "/shop") {
  //     navigate(`/shop?search=${encodeURIComponent(val)}`);
  //   }
  // };
  // console.log("cartData in navber", cartData?.orderedItems.length)


  useEffect(() => {
    const updateCartView = () => {
      if (data?.data) {
        // Logic for Logged in User (From API response)
        const pendingOrder = response?.data?.find((o: { status: string }) => o.status === 'Pending');
        if (pendingOrder) {
          setCartData({
            orderedItems: pendingOrder.orderedItems,
            totalPrice: pendingOrder.totalPrice,
            status: pendingOrder.status
          });
          refetch();
        }
      } else {
        // Logic for Guest Cart (From LocalStorage)
        const localItems = JSON.parse(localStorage.getItem('guestCart') || '[]');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const total = localItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        setCartData({
          orderedItems: localItems,
          totalPrice: total,
          status: 'Pending'
        });
      }
    };


    // Run once on mount or when API data changes
    updateCartView();

    // LISTEN FOR THE CUSTOM EVENT
    window.addEventListener('cartUpdated', updateCartView);

    // Optional: Listen for storage changes in other tabs
    window.addEventListener('storage', updateCartView);

    return () => {
      window.removeEventListener('cartUpdated', updateCartView);
      window.removeEventListener('storage', updateCartView);
    };
  }, [response, data, refetch]); // Keep data/response dependencies for logged-in updates





  return (
    <header className=" mx-auto  px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2 ">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full ">
                      <NavigationMenuLink asChild href={link.href} className="py-1.5 ">
                        <Link to={link.href}>{link.label}</Link>

                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <a href="#" className="text-primary   hover:text-primary/90">
              <Logo />
            </a>

          </div>
        </div>
        {/* <div className="flex-1 max-w-md hidden md:block mx-4">
          <ProductSearch
            onSearch={handleSearch}
            initialValue={searchTerm}
          />
        </div> */}
        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">

            <Heart className="hidden md:block" />
            <Link className="flex items-center relative" to="/cart">
              <ShoppingCartIcon className="text-[#FF781A]" />
              <Badge className="bg-primary border-none absolute top-0 -right-5   rounded-full   tabular-nums  transform -translate-x-1/2 -translate-y-1/2" variant="outline">
                {
                  isLoading || isFetching || cartData.status == "Shipped" ? <Spinner /> : cartData?.orderedItems.length ? cartData?.orderedItems.length : cartData?.orderedItems.length
                }
              </Badge>
            </Link>
            <ModeToggle />
            {/* Info menu */}
            {
              isLoading || isFetching ? <Spinner /> : data?.data?.email && (
                <>
                  <UserMenu userData={data?.data} />
                </>
              )

            }
            {
              !data?.data?.email
              &&
              <Button asChild className="text-sm">
                <Link to="/login">Login</Link>
              </Button>
            }
            {/* <InfoMenu /> */}
            {/* Notification */}
            {/* <NotificationMenu /> */}
          </div>
          {/* User menu */}


        </div>
      </div>
      <div>
        <div className=" container mx-auto  py-2 max-md:hidden flex justify-around" >
          {/* Navigation menu */}
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {navigationLinks.map((link, index) => {
                // Determine if the link is active by comparing the current pathname
                const isActive = location.pathname === link.href;

                return (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      // Pass the dynamic isActive state here
                      active={isActive}
                      asChild
                      className={`text-muted-foreground hover:text-primary py-1.5 font-medium data-[active]:text-primary`}
                    >
                      <Link to={link.href}>
                        <span className="flex gap-3 text-base items-center">
                          {link.icon && <link.icon size={16} />}
                          {link.label}
                        </span>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
          {/* <Button>Category <ArrowDown /> </Button> */}
        </div>
      </div>
    </header>
  )
}
