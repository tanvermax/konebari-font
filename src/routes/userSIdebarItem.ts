// import Booking from "@/pages/User/Booking";
// import UserProfile from "@/pages/User/UserProfile";
// import UserOrders from "@/pages/User/UserOrders";
// import UserWishlist from "@/pages/User/UserWishlist";
// import UserAddresses from "@/pages/User/UserAddresses";
// import UserPayments from "@/pages/User/UserPayments";
// import UserShipments from "@/pages/User/UserShipments";
import FavoritePage from "@/components/layout/HomeLayout/Favorite/FavoritePage";
import OrderTrack from "@/pages/User/OrderTrack/Ordertack";
import type { ISidebarItem } from "@/types";
import { ClipboardList, Heart } from "lucide-react";
// import { Calendar, ClipboardList, CreditCard, Heart, MapPin, Truck, User } from "lucide-react";

export const userSidebarItem: ISidebarItem[] = [
  {
    title: "My Account",
    url: "#",
    items: [
      // {
      //   title: "Profile",
      //   url: "/user/profile",
      //   component: ProfilePage,
      //   icon: User,
      // },
      
      {
        title: "My Orders",
        url: "/user/orders",
        component: OrderTrack,
        icon: ClipboardList,
      },
      {
        title: "Wishlist",
        url: "/user/favorites",
        component: FavoritePage,
        icon: Heart,
      },
      
      // {
      //   title: "Addresses",
      //   url: "/user/addresses",
      //   component: UserAddresses,
      //   icon: MapPin,
      // },
      // {
      //   title: "Payments",
      //   url: "/user/payments",
      //   component: UserPayments,
      //   icon: CreditCard,
      // },
      // {
      //   title: "Shipments",
      //   url: "/user/shipments",
      //   component: UserShipments,
      //   icon: Truck,
      // },
      // {
      //   title: "Booking",
      //   url: "/user/booking",
      //   component: Booking,
      //   icon: Calendar,
      // },
    ],
  },
];