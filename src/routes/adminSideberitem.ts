// adminSideberitem.ts (Fully Updated)
import AddProduct from "@/components/layout/AdminLayoute/AddProduct/AddProduct";
// import AdminQuotationManagement from "@/components/layout/AdminLayoute/AdminQuotationManagement/AdminQuotationManagement";
// import AdminShipmentTracking from "@/components/layout/AdminLayoute/AdminShipmentTracking/AdminShipmentTracking";
import Allproduct from "@/components/layout/AdminLayoute/Allproduct";
import AdminAnalyticsPage from "@/components/layout/AdminLayoute/Analytics/AdminAnalyticsPage";
import AdminReportsPage from "@/components/layout/AdminLayoute/Analytics/AdminReportsPage";
import AdminOrdersPage from "@/components/layout/AdminLayoute/Orders/AdminOrdersPage";
import AdminOverviewPage from "@/components/layout/AdminLayoute/Overview/Adminoverviewpage";
import AdminShipmentsPage from "@/components/layout/AdminLayoute/Shipments/AdminShipmentsPage";
import UserManagementPage from "@/components/layout/AdminLayoute/UserManagement/UserManagementPage";

// 🔥 নতুন ইমপোর্ট - যেগুলো তৈরি করতে হবে
// import AdminOrderTrack from "@/components/layout/AdminLayoute/AdminOrderTrack/AdminOrderTrack";
// import AdminShipmentsPage from "@/components/layout/AdminLayoute/Shipment/AdminShipmentsPage";
// import AdminReportsPage from "@/components/layout/AdminLayoute/Reports/AdminReportsPage";
// import AdminCreateShipmentPage from "@/components/layout/AdminLayoute/Shipment/AdminCreateShipmentPage";
// import AdminFleetManagementPage from "@/components/layout/AdminLayoute/Fleet/AdminFleetManagementPage";
// import AdminRFQDetailsPage from "@/components/layout/AdminLayoute/RFQ/AdminRFQDetailsPage";
// import AdminRFQAnalyticsPage from "@/components/layout/AdminLayoute/RFQ/AdminRFQAnalyticsPage";
// import AdminQuotationTemplatesPage from "@/components/layout/AdminLayoute/RFQ/AdminQuotationTemplatesPage";
// import AdminRouteOptimizationPage from "@/components/layout/AdminLayoute/Fleet/AdminRouteOptimizationPage";

// ✅ আনকমেন্ট করা হলো (এখন এগুলো কাজ করবে)
// import AdminCategoriesPage from "@/pages/admin/Products/AdminCategoriesPage";
// import AdminInventoryPage from "@/pages/admin/Products/AdminInventoryPage";
// import AdminUserDetailsPage from "@/pages/admin/Users/AdminUserDetailsPage";
// import AdminCorporateBuyersPage from "@/pages/admin/Users/AdminCorporateBuyersPage";
// import AdminPaymentsPage from "@/pages/admin/Payments/AdminPaymentsPage";
// import AdminInvoicesPage from "@/pages/admin/Payments/AdminInvoicesPage";
// import AdminSettingsPage from "@/pages/admin/Settings/AdminSettingsPage";
// import AdminDiscountsPage from "@/pages/admin/Marketing/AdminDiscountsPage";
// import AdminPromotionsPage from "@/pages/admin/Marketing/AdminPromotionsPage";

// // ✅ নিউ ইমপোর্ট (যেগুলো আগে ছিল না)
// import AdminAnalyticsPage from "@/pages/admin/Analytics/AdminAnalyticsPage";
// import AdminBulkOrdersPage from "@/pages/admin/Orders/AdminBulkOrdersPage";
// import AdminBulkImportPage from "@/pages/admin/Products/AdminBulkImportPage";
// import AdminReviewsPage from "@/pages/admin/Products/AdminReviewsPage";
// import AdminRolesPage from "@/pages/admin/Users/AdminRolesPage";
// import AdminRefundsPage from "@/pages/admin/Payments/AdminRefundsPage";
// import AdminShippingSettingsPage from "@/pages/admin/Settings/AdminShippingSettingsPage";
// import AdminTaxSettingsPage from "@/pages/admin/Settings/AdminTaxSettingsPage";
// import AdminSecurityPage from "@/pages/admin/Settings/AdminSecurityPage";

import type { ISidebarItem } from "@/types";

import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  ClipboardList,
  Truck,
  // FileSpreadsheet,
  Users,
  // UserCog,
  // Building2,
  // FileText,
  BarChart3,
  // Settings,
  // Package,
  // MapPin,
  // Route,
  // Eye,
  // Database,
  FileBarChart,
  // ShieldCheck,
  // MessageSquare,
  // TrendingUp,
  // Store,
  // CreditCard,
  // Receipt,
  // RefreshCw,
  // Tag,
  // Megaphone,
  // Image,
  // Mail,
  // BellRing,
  // Layers,
  // Boxes,
} from "lucide-react";

// মন্তব্য করা ইমপোর্টগুলো সরিয়ে ফেলা হয়েছে কারণ উপরে আলাদা করে আনা হয়েছে

export const adminSidebarItem: ISidebarItem[] = [
  // ============================================
  // 📊 SECTION 1: DASHBOARD & ANALYTICS
  // ============================================
  {
    title: "Dashboard & Analytics",
    url: "#",
    items: [
      {
        title: "Overview Stats",
        url: "/admin/dashboard",
        component: AdminOverviewPage,
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        url: "/admin/analytics",
        component: AdminAnalyticsPage, // ✅ নতুন কম্পোনেন্ট
        icon: BarChart3,
      },
      {
        title: "Reports",
        url: "/admin/reports",
        component: AdminReportsPage,
        icon: FileBarChart,
      },
    ],
  },

  // ============================================
  // 📦 SECTION 2: ORDER MANAGEMENT
  // ============================================
  {
    title: "Order Management",
    url: "#",
    items: [
    
    
      {
      title: "All Orders",
      url: "/admin/orders",
      component: AdminOrdersPage,
      icon: ClipboardList,
    },

    ],
  },

  // ============================================
  // 🚚 SECTION 3: FLEET & SHIPMENT TRACKING
  // ============================================
  {
    title: "Fleet & Logistics",
    url: "#",
    items: [
      {
        title: "Shipments",
        url: "/admin/shipments",
        component: AdminShipmentsPage,
        icon: Truck,
      },
     
    ],
  },



  // ============================================
  // 🏷️ SECTION 5: PRODUCT & INVENTORY
  // ============================================
  {
    title: "Product Management",
    url: "#",
    items: [
      {
        title: "All Products",
        url: "/admin/products",
        component: Allproduct,
        icon: ShoppingBag,
      },
      {
        title: "Add Product",
        url: "/admin/add-product",
        component: AddProduct,
        icon: PlusCircle,
      },
      // {
      //   title: "Categories",
      //   url: "/admin/categories",
      //   component: AdminCategoriesPage, // ✅ আনকমেন্ট
      //   icon: Layers,
      // },
      // {
      //   title: "Inventory",
      //   url: "/admin/inventory",
      //   component: AdminInventoryPage, // ✅ আনকমেন্ট
      //   icon: Boxes,
      // },
      // {
      //   title: "Bulk Import",
      //   url: "/admin/products/import",
      //   component: AdminBulkImportPage, // ✅ নতুন
      //   icon: Database,
      // },
      // {
      //   title: "Product Reviews",
      //   url: "/admin/reviews",
      //   component: AdminReviewsPage, // ✅ নতুন
      //   icon: MessageSquare,
      // },
    ],
  },

  // ============================================
  // 👥 SECTION 6: USER MANAGEMENT
  // ============================================
  {
    title: "User Management",
    url: "#",
    items: [
      {
        title: "All Users",
        url: "/admin/users",
        component: UserManagementPage,
        icon: Users,
      },
      // {
      //   title: "User Details",
      //   url: "/admin/users/:id",
      //   component: AdminUserDetailsPage, // ✅ আনকমেন্ট
      //   icon: UserCog,
      // },
      // {
      //   title: "Corporate Buyers",
      //   url: "/admin/corporate",
      //   component: AdminCorporateBuyersPage, // ✅ আনকমেন্ট
      //   icon: Building2,
      // },
      // {
      //   title: "Role Management",
      //   url: "/admin/roles",
      //   component: AdminRolesPage, // ✅ নতুন
      //   icon: ShieldCheck,
      // },
    ],
  },

  // ============================================
  // 💰 SECTION 7: PAYMENTS & INVOICES
  // ============================================
 

  // ============================================
  // 📊 SECTION 8: REPORTS (ডুপ্লিকেট রিমুভ করা হয়েছে)
  // ============================================

  // ============================================
  // 🎯 SECTION 9: MARKETING & PROMOTIONS
  // ============================================
  // {
  //   title: "Marketing & Promotions",
  //   url: "#",
  //   items: [
  //     {
  //       title: "Discounts & Coupons",
  //       url: "/admin/discounts",
  //       component: AdminDiscountsPage, // ✅ আনকমেন্ট
  //       icon: Tag,
  //     },
  //     {
  //       title: "Promotions",
  //       url: "/admin/promotions",
  //       component: AdminPromotionsPage, // ✅ আনকমেন্ট
  //       icon: Megaphone,
  //     },
  //     {
  //       title: "Banners",
  //       url: "/admin/banners",
  //       component: AdminPromotionsPage, // TODO: AdminBannersPage
  //       icon: Image,
  //     },
  //     {
  //       title: "Email Campaigns",
  //       url: "/admin/campaigns",
  //       component: AdminPromotionsPage, // TODO: AdminCampaignsPage
  //       icon: Mail,
  //     },
  //     {
  //       title: "Newsletter",
  //       url: "/admin/newsletter",
  //       component: AdminPromotionsPage, // TODO: AdminNewsletterPage
  //       icon: BellRing,
  //     },
  //   ],
  // },

  // // ============================================
  // // ⚙️ SECTION 10: SYSTEM SETTINGS
  // // ============================================
  // {
  //   title: "System Settings",
  //   url: "#",
  //   items: [
  //     {
  //       title: "General Settings",
  //       url: "/admin/settings",
  //       component: AdminSettingsPage, // ✅ আনকমেন্ট
  //       icon: Settings,
  //     },
  //     {
  //       title: "Shipping Settings",
  //       url: "/admin/settings/shipping",
  //       component: AdminShippingSettingsPage, // ✅ নতুন
  //       icon: Truck,
  //     },
  //     {
  //       title: "Tax Settings",
  //       url: "/admin/settings/tax",
  //       component: AdminTaxSettingsPage, // ✅ নতুন
  //       icon: Receipt,
  //     },
  //     {
  //       title: "Security",
  //       url: "/admin/settings/security",
  //       component: AdminSecurityPage, // ✅ নতুন
  //       icon: ShieldCheck,
  //     },
    // ],
  // },
];