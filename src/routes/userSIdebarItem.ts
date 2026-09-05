// userSIdebarItem.ts - আপডেটেড
import Booking from "@/pages/User/Booking";
import type { ISidebarItem } from "@/types";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  Gem, 
  Clock,
  Gift,
  User,
  Settings
} from "lucide-react";

export const userSidebarItem: ISidebarItem[] = [
  {
    title: "💎 User Dashboard",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/user/dashboard",
        component: Booking, // অথবা আলাদা ড্যাশবোর্ড কম্পোনেন্ট
        icon: LayoutDashboard,
      },
      {
        title: "My Orders",
        url: "/user/orders",
        component: Booking,
        icon: ShoppingBag,
      },
      {
        title: "Wishlist",
        url: "/user/wishlist",
        component: Booking,
        icon: Heart,
      },
      {
        title: "My Collection",
        url: "/user/collection",
        component: Booking,
        icon: Gem,
      },
      {
        title: "Recent Views",
        url: "/user/recent",
        component: Booking,
        icon: Clock,
      },
      {
        title: "Rewards",
        url: "/user/rewards",
        component: Booking,
        icon: Gift,
      },
      {
        title: "Profile",
        url: "/user/profile",
        component: Booking,
        icon: User,
      },
      {
        title: "Settings",
        url: "/user/settings",
        component: Booking,
        icon: Settings,
      },
    ],
  },
];