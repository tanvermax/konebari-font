// components/RouteGuard/AdminRouteGuard.tsx
import { useUserInfoQuery } from "@/redux/features/auth/auth.api"; // আপনার API hook
import { Navigate, Outlet } from "react-router";

export const AdminRouteGuard = () => {
  // 1. সরাসরি RTK Query থেকে ইউজার ডাটা এবং লোডিং স্টেট নিন
  const { data: userData, isLoading, isError } = useUserInfoQuery(undefined);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // API response থেকে আসল ইউজার অবজেক্ট বের করা
  const user = userData?.data || userData; 

  // 2. ইউজার না থাকলে বা API এরর দিলে লগইনে পাঠাবে
  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  // 3. রোল চেক (ADMIN না হলে ড্যাশবোর্ডে পাঠাবে)
  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};