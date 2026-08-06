import AddProduct from "@/components/layout/AdminLayoute/AddProduct/AddProduct";
import AdminOrderTrack from "@/components/layout/AdminLayoute/AdminOrderTrack/AdminOrderTrack";
import Allproduct from "@/components/layout/AdminLayoute/Allproduct";
import OrderviewAdmin from "@/components/layout/AdminLayoute/OrderviewAdmin/OrderviewAdmin";
import AdminOverviewPage from "@/components/layout/AdminLayoute/Overview/Adminoverviewpage";
import type { ISidebarItem } from "@/types";

// Lucide Icons থেকে মানানসই আইকনগুলো ইমপোর্ট করা হলো
import { 
  LayoutDashboard, 
  ChartArea,
  ShoppingBag, 
  PlusCircle, 
  ClipboardList 
} from "lucide-react";



export const adminSidebarItem: ISidebarItem[] = [
  {
    title: "Admin Dashboard",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        component: AdminOverviewPage,
        icon: LayoutDashboard, // ড্যাশবোর্ডের জন্য গ্রিড আইকন
      },
      {
        title: "Order Overview",
        url: "/admin/order-overview",
        component: OrderviewAdmin,
        icon: ChartArea, // নতুন প্রোডাক্ট অ্যাড করার জন্য প্লাস আইকন
      },
      {
        title: "All Product",
        url: "/admin/users", // নোটিফিকেশন: আপনার এখানে URL এ /admin/users দেওয়া, প্রয়োজন হলে /admin/products করতে পারেন
        component: Allproduct,
        icon: ShoppingBag, // প্রোডাক্ট লিস্টের জন্য শপিং ব্যাগ আইকন
      },
      {
        title: "Order",
        url: "/admin/order",
        component: AdminOrderTrack,
        icon: ClipboardList, // অর্ডারের জন্য ক্লিপবোর্ড/লিস্ট আইকন
      },
      {
        title: "Add Product",
        url: "/admin/add-product",
        component: AddProduct,
        icon: PlusCircle, // নতুন প্রোডাক্ট অ্যাড করার জন্য প্লাস আইকন
      },
      
    ],
  },
];