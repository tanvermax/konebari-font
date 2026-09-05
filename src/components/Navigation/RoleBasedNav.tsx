// components/Navigation/RoleBasedNav.tsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAppSelector } from "@/redux/hook";

export const useRoleBasedNavigation = () => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  console.log(user);

  useEffect(() => {
    if (isLoading) return;

    // লগইন বা রেজিস্টার পেজে থাকলে যেন রিডাইরেক্ট লুপ না হয়
    const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

    if (!user) {
      if (!isAuthPage) {
        navigate("/login");
      }
      return;
    }

    // ইউজার যদি অলরেডি লগইন থাকে আর /login পেজে ঢোকে, তবে তাকে ড্যাশবোর্ডে পাঠাবে
    if (user && isAuthPage) {
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
      return;
    }

    // অ্যাডমিন ফ্রন্টএন্ড/ইউজার প্যানেল এবং অ্যাডমিন প্যানেল দুটোই দেখতে পারবে
    if (user.role === "USER" && location.pathname.startsWith("/admin")) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate, location]);

  return { user, isLoading };
};