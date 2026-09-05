// adminSideberitem.ts - ফিক্সড ভার্সন
import AddProduct from "@/components/layout/AdminLayoute/AddProduct/AddProduct";
import AdminOrderTrack from "@/components/layout/AdminLayoute/AdminOrderTrack/AdminOrderTrack";
import Allproduct from "@/components/layout/AdminLayoute/Allproduct";
import OrderviewAdmin from "@/components/layout/AdminLayoute/OrderviewAdmin/OrderviewAdmin";
import AdminOverviewPage from "@/components/layout/AdminLayoute/Overview/Adminoverviewpage";
import type { ISidebarItem } from "@/types";

import { 
  LayoutDashboard, 
  ChartArea,
  ShoppingBag, 
  PlusCircle, 
  ClipboardList,
  Sparkles,
  Gem
} from "lucide-react";

export const adminSidebarItem: ISidebarItem[] = [
  {
    title: "✨ Admin Dashboard",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        component: AdminOverviewPage,
        icon: LayoutDashboard,
      },
      {
        title: "Order Overview",
        url: "/admin/order-overview",
        component: OrderviewAdmin,
        icon: ChartArea,
      },
      {
        title: "All Products",
        url: "/admin/all-products", // Changed from /admin/users
        component: Allproduct,
        icon: ShoppingBag,
      },
      {
        title: "Orders",
        url: "/admin/order",
        component: AdminOrderTrack,
        icon: ClipboardList,
      },
      {
        title: "Add Product",
        url: "/admin/add-product",
        component: AddProduct,
        icon: PlusCircle,
      },
      {
        title: "Beauty Collection",
        url: "/admin/beauty",
        component: Allproduct, // বা আলাদা কম্পোনেন্ট
        icon: Sparkles,
      },
      {
        title: "Jewelry Collection",
        url: "/admin/jewelry",
        component: Allproduct, // বা আলাদা কম্পোনেন্ট
        icon: Gem,
      },
    ],
  },
];