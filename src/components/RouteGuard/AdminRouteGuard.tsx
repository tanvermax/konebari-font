// components/RouteGuard/AdminRouteGuard.tsx
import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/redux/hook";

export const AdminRouteGuard = () => {
  // ✅ Redux store থেকে user নিন (API কল নয়)
  const { user, isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  console.log("🔐 AdminRouteGuard - User:", user);
  console.log("🔐 AdminRouteGuard - isLoading:", isLoading);
  console.log("🔐 AdminRouteGuard - isAuthenticated:", isAuthenticated);

  // ⏳ লোডিং হলে অপেক্ষা করুন
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // ❌ user না থাকলে লগইনে পাঠান
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ ADMIN না হলে ড্যাশবোর্ডে পাঠান
  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};