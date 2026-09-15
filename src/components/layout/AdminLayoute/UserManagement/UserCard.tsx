// components/layout/AdminLayoute/UserManagement/UserCard.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Mail,
  Shield,
  ShieldCheck,
  User as UserIcon,
  MoreVertical,
  Pencil,
  Trash2,
  Ban,
  CheckCircle,
  Crown,
} from "lucide-react";
import type { IUser } from "@/types/user.types";

interface UserCardProps {
  user: IUser;
  onEdit: (user: IUser) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onChangeRole: (id: string, currentRole: string) => void;
  isDeleting?: boolean;
}

export default function UserCard({
  user,
  onEdit,
  onDelete,
  onToggleStatus,
  onChangeRole,
  isDeleting = false,
}: UserCardProps) {
  // ✅ Role ব্যাজ
  const roleBadge = () => {
    if (user.role === 'SUPER_ADMIN') {
      return (
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <Crown className="w-3 h-3 mr-1" /> Super Admin
        </Badge>
      );
    }
    if (user.role === 'ADMIN') {
      return (
        <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
          <ShieldCheck className="w-3 h-3 mr-1" /> Admin
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-pink-300 text-pink-600">
        <UserIcon className="w-3 h-3 mr-1" /> User
      </Badge>
    );
  };

  // ✅ Status ব্যাজ
  const statusBadge = () => {
    if (user.isDeleted) {
      return <Badge variant="destructive">Deleted</Badge>;
    }
    if (user.isActive === 'BLOCKED') {
      return <Badge className="bg-red-500 text-white border-0">Blocked</Badge>;
    }
    if (user.isActive === 'INACTIVE') {
      return <Badge className="bg-gray-400 text-white border-0">Inactive</Badge>;
    }
    return <Badge className="bg-green-500 text-white border-0">Active</Badge>;
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-4 transition-all duration-300 hover:shadow-lg hover:border-pink-200/50">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              user.name?.charAt(0).toUpperCase() || '?'
            )}
          </div>
          {user.isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate" title={user.name}>
            {user.name}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 truncate mt-0.5">
            <Mail className="w-3 h-3 flex-shrink-0" />
            {user.email}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {roleBadge()}
            {statusBadge()}
          </div>
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Edit */}
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit User
            </DropdownMenuItem>

            {/* Change Role */}
            <DropdownMenuItem
              onClick={() => onChangeRole(user._id, user.role)}
              disabled={user.role === 'SUPER_ADMIN'}
            >
              <Shield className="w-4 h-4 mr-2" />
              Change Role
            </DropdownMenuItem>

            {/* Block / Unblock */}
            <DropdownMenuItem
              onClick={() => onToggleStatus(user._id, user.isActive)}
              disabled={user.role === 'SUPER_ADMIN'}
            >
              {user.isActive === 'BLOCKED' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Unblock User
                </>
              ) : (
                <>
                  <Ban className="w-4 h-4 mr-2 text-orange-500" />
                  Block User
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Delete */}
            <DropdownMenuItem
              onClick={() => onDelete(user._id)}
              disabled={user.role === 'SUPER_ADMIN' || isDeleting}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Additional Info */}
      <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
        <span className="font-mono">#{user._id.slice(-6)}</span>
      </div>
    </div>
  );
}