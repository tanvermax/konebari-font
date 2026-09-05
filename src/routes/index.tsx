import App from "@/App";
import DashbordLayout from "@/components/layout/DashbordLayout";
import About from "@/pages/About";
import Home from "@/pages/Home/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Veryfy from "@/pages/Veryfy";
import { genarateRoutes } from "@/utils/genarateRoutes";
import { createBrowserRouter } from "react-router";
import { adminSidebarItem } from "./adminSideberitem";
import { userSidebarItem } from "./userSIdebarItem";
import ProductDetails from "@/components/layout/HomeLayout/ProductCard/ProductDetails";
import CartPage from "@/components/layout/HomeLayout/Cart/Cart";
import OrderTrack from "@/pages/User/OrderTrack/Ordertack";
import Help from "@/pages/Help/Help";
import HomeShope from "@/components/layout/HomeShope/HomeShope";
import OrderSuccessPage from "@/components/layout/OrderSuccess/OrderSuccessPage";
import EditProduct from "@/components/layout/AdminLayoute/AddProduct/EditProduct";
import { AdminRouteGuard } from "@/components/RouteGuard/AdminRouteGuard";
import { UserRouteGuard } from "@/components/RouteGuard/UserRouteGuard";


// c// router/index.tsx - ফিক্সড ভার্সন
// import App from "@/App";
// import DashbordLayout from "@/components/layout/DashbordLayout";
// import { AdminRouteGuard } from "@/components/RouteGuard/AdminRouteGuard";
// import { UserRouteGuard } from "@/components/RouteGuard/UserRouteGuard";
// import Home from "@/pages/Home/Home";
// import Login from "@/pages/Login";
// import Register from "@/pages/Register";
// import Veryfy from "@/pages/Veryfy";
// import { genarateRoutes } from "@/utils/genarateRoutes";
// import { createBrowserRouter } from "react-router";
// import { adminSidebarItem } from "./adminSideberitem";
// import { userSidebarItem } from "./userSIdebarItem";
// // ... অন্যান্য ইমপোর্ট

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { path: "/", Component: Home },
      { path: "about", Component: About },
      { path: "shop", Component: HomeShope },
      { path: "cart", Component: CartPage },
      { path: "thankyou", Component: OrderSuccessPage },
      { path: "alldata/:id", Component: ProductDetails },
      { path: "ordertrack", Component: OrderTrack },
      { path: "help", Component: Help },
      { path: "admin/products/edit/:id", Component: EditProduct },
    ],
  },
  {
    path: "/admin",
    Component: AdminRouteGuard, // Admin guard
    children: [
      {
        Component: DashbordLayout,
        children: [...genarateRoutes(adminSidebarItem)],
      },
    ],
  },
  {
    path: "/user",
    Component: UserRouteGuard, // User guard
    children: [
      {
        Component: DashbordLayout,
        children: [...genarateRoutes(userSidebarItem)],
      },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/verify",
    Component: Veryfy,
  },
]);




export default router;