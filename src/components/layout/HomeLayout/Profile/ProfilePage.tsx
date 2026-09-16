// components/layout/Profile/ProfilePage.tsx
"use client";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useUserInfoQuery, useLogoutMutation } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { logout as logoutAction } from "@/redux/features/auth/auth.slice";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import GuestProfileView from "./GuestProfileView";

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: userData, isLoading } = useUserInfoQuery(undefined);
  const [logoutApi] = useLogoutMutation();

  // ✅ User data
  const user = userData?.data || userData;

  // ✅ Loading
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-5">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  // ✅ Not logged in → Guest view
  if (!user || !user.email) {
    return <GuestProfileView />;
  }

  // ✅ Logout handler
  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;

    try {
      await logoutApi(undefined).unwrap().catch(() => {});
    } catch (err) {
      // Ignore logout API errors
    }

    // Clear Redux
    dispatch(logoutAction());

    // Clear localStorage (guest data)
    localStorage.removeItem("guest_cart_v2");
    localStorage.removeItem("guest_favorites_v2");

    toast.success("Logged out successfully 👋");
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 max-w-4xl space-y-5">
      {/* Header */}
      <ProfileHeader user={user} onLogout={handleLogout} />

      {/* Tabs */}
      <ProfileTabs user={user} />
    </div>
  );
}