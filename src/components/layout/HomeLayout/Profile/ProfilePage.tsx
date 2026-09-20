"use client";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useUserInfoQuery, useLogoutMutation } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { logout as logoutAction } from "@/redux/features/auth/auth.slice";
import { baseApi } from "@/redux/baseApi";   // 👈 NEW
import { Skeleton } from "@/components/ui/skeleton";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import GuestProfileView from "./GuestProfileView";

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: userData, isLoading } = useUserInfoQuery(undefined);
  const [logoutApi] = useLogoutMutation();

  const user = userData?.data || userData;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-5">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!user || !user.email) {
    return <GuestProfileView />;
  }

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;

    try {
      await logoutApi(undefined).unwrap().catch(() => {});
    } catch {}

    // ✅ 1. Clear Redux auth state
    dispatch(logoutAction());

    // ✅ 2. CRITICAL: Reset RTK Query cache (fixes the "still showing user menu" issue)
    dispatch(baseApi.util.resetApiState());

    // ✅ 3. Clear guest localStorage (optional)
    localStorage.removeItem("guest_cart_v2");
    localStorage.removeItem("guest_favorites_v2");

    toast.success("Logged out successfully 👋");

    // ✅ 4. Navigate to home
    navigate("/", { replace: true });
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 max-w-4xl space-y-5">
      <ProfileHeader user={user} onLogout={handleLogout} />
      <ProfileTabs user={user} />
    </div>
  );
}