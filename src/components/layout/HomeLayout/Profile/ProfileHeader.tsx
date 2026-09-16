// components/layout/Profile/ProfileHeader.tsx
import { LogOut, Mail, CheckCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileHeaderProps {
  user: {
    _id?: string;
    name?: string;
    email?: string;
    picture?: string;
    role?: string;
    isVerified?: boolean;
    createdAt?: string;
  };
  onLogout: () => void;
}

export default function ProfileHeader({ user, onLogout }: ProfileHeaderProps) {
  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "?";

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : "";

  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  return (
    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
      {/* Gradient cover */}
      <div className="h-28 bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNjBsNjAtNjBNNjAgNjBsLTYwLTYwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=')] opacity-40" />
      </div>

      <CardContent className="p-6 relative">
        {/* Avatar */}
        <div className="flex items-end gap-4 -mt-16 mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl shadow-xl border-4 border-background">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5 border-4 border-background">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground truncate">
                {user.name || "User"}
              </h1>
              {isAdmin && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  <Shield className="w-3 h-3 mr-1" />
                  {user.role}
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <Mail className="w-3.5 h-3.5" />
              {user.email}
            </p>

            {joinedDate && (
              <p className="text-xs text-muted-foreground mt-1">
                Member since {joinedDate}
              </p>
            )}
          </div>

          {/* Logout */}
          <Button
            variant="outline"
            onClick={onLogout}
            className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-300 gap-2 w-full md:w-auto"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}