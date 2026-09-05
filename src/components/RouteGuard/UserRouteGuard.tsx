// components/RouteGuard/UserRouteGuard.tsx
import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/redux/hook";

export const UserRouteGuard = () => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  console.log(user);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User can access user routes
  // Admin can also access user routes
  if (user.role === "USER" || user.role === "ADMIN") {
    return <Outlet />;
  }

  // যদি অন্য কোনো রোল থাকে
  return <Navigate to="/login" replace />;
};