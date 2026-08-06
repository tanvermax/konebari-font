import App from "@/App";
// import AddProduct from "@/components/layout/AdminLayoute/AddProduct/AddProduct";
// import User from "@/components/layout/AdminLayoute/User";
import DashbordLayout from "@/components/layout/DashbordLayout";
import About from "@/pages/About";
// import Analytic from "@/pages/Admin/Analytic";
import Home from "@/pages/Home/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Veryfy from "@/pages/Veryfy";
import { genarateRoutes } from "@/utils/genarateRoutes";
import { createBrowserRouter } from "react-router";
import { adminSidebarItem } from "./adminSideberitem";
import { userSidebarItem } from "./userSIdebarItem";
import DeluxeError from "@/components/ErrorComponent/Error";
import ProductDetails from "@/components/layout/HomeLayout/ProductCard/ProductDetails";

import CartPage from "@/components/layout/HomeLayout/Cart/Cart";
import OrderTrack from "@/pages/User/OrderTrack/Ordertack";
import Help from "@/pages/Help/Help";
import HomeShope from "@/components/layout/HomeShope/HomeShope";
import OrderSuccessPage from "@/components/layout/OrderSuccess/OrderSuccessPage";
import EditProduct from "@/components/layout/AdminLayoute/AddProduct/EditProduct";
import HomePage from "@/components/layout/home/HomePage";


const router = createBrowserRouter([
    {
        Component: App,
        errorElement: <DeluxeError />,
        path: "/",
        children: [
            {
                path: "about",
                Component: About,
            },
            {
                path: "shop",
                Component: HomeShope,
            }, 
            {
                path: "cart",
                Component: CartPage,
            }, 
            {
                path: "thankyou",
                Component: OrderSuccessPage,
            }, 
            {
                path: "/",
                Component: Home,
            },
            {
                path:"alldata/:id",
                Component:ProductDetails
            },
            {
                path:"ordertrack",
                Component:OrderTrack
            },
            {
                path: "/admin/products/edit/:id",
                Component: EditProduct,
            },
            {
                path:"help",
                Component:Help
            }


        ]
    }
    ,
    {
        Component: DashbordLayout,
        path: "/admin",
        children: [...genarateRoutes(adminSidebarItem)],
        errorElement: <DeluxeError />,

    },
    {
        Component: DashbordLayout,
        path: "/user",
        children: [...genarateRoutes(userSidebarItem)],
        errorElement: <DeluxeError />,


    },
    {
        Component: Login,
        path: "/login",
        errorElement: <DeluxeError />,

    },
    {
        Component: Register,
        path: "/register",
        errorElement: <DeluxeError />,

    },
    {
        Component: Veryfy,
        path: "/verify",
        errorElement: <DeluxeError />,

    }
    ,
    

])


export default router;