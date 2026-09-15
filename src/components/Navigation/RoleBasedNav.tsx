// components/Navigation/RoleBasedNav.tsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAppSelector } from "@/redux/hook";

export const useRoleBasedNavigation = () => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // ✅ 1. লোডিং হলে কিছু করবেন না
    if (isLoading) return;

    // ✅ 2. auth পেজ চেক
    const isAuthPage = 
      location.pathname === "/login" || 
      location.pathname === "/register";

    // ✅ 3. user না থাকলে
    if (!user) {
      // প্রোটেক্টেড পেজ হলে লগইনে পাঠান
      if (!isAuthPage) {
        navigate("/login", { replace: true });
      }
      return;
    }

    // ✅ 4. user থাকলে auth পেজে ঢুকলে ড্যাশবোর্ডে
    if (user && isAuthPage) {
      if (user.role === "ADMIN" ) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
      return;
    }

    // ✅ 5. USER কে admin প্যানেল থেকে আটকান
    if (user.role === "USER" && location.pathname.startsWith("/admin")) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, isLoading, navigate, location]);

  return { user, isLoading };
};