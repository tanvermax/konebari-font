// App.tsx - Improved Version
import { Outlet, ScrollRestoration, useLocation } from "react-router"
import CommonLayout from "./components/layout/CommoneLayout"
import { ToastContainer } from 'react-toastify';
import { useRoleBasedNavigation } from "./components/Navigation/RoleBasedNav";

function App() {
  const location = useLocation();
  
  // ✅ শুধুমাত্র Protected Routes এ Navigation Control প্রয়োগ করুন
  const isProtectedRoute = ![
    '/', 
    '/login', 
    '/register', 
    '/verify', 
    '/about', 
    '/shop',
    '/cart',
    '/help'
  ].includes(location.pathname) && !location.pathname.startsWith('/alldata');

  // শুধুমাত্র Protected Routes এ use করবেন
  if (isProtectedRoute) {
    useRoleBasedNavigation();
  }

  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  return (
    <CommonLayout>
      <ScrollRestoration />
      <ToastContainer />
      <Outlet />
    </CommonLayout>
  )
}

export default App