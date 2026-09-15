// components/layout/AdminLayoute/UserManagement/UserManagementPage.tsx
import { useState } from "react";
import { toast } from "sonner";
import { Search, Users, UserCheck, UserX, Shield, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
  useChangeUserRoleMutation,
} from "@/redux/features/user/user.api";
import type { IUser } from "@/types/user.types";
import UserCard from "./UserCard";
import EditUserDialog from "./EditUserDialog";

const PAGE_SIZE = 12;

export default function UserManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  // ✅ Query
  const { data, isLoading, isError, refetch } = useGetAllUsersQuery({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    role: roleFilter === "all" ? undefined : roleFilter,
    isActive: statusFilter === "all" ? undefined : statusFilter,
  });

  const [deleteUser] = useDeleteUserMutation();
  const [toggleStatus] = useToggleUserStatusMutation();
  const [changeRole] = useChangeUserRoleMutation();

  const users: IUser[] = data?.data || [];
  const totalPages = data?.meta?.totalPage || 1;
  const totalUsers = data?.meta?.total || 0;

  // ✅ Handlers
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setDeletingIds((prev) => new Set(prev).add(id));
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete user");
    } finally {
      setDeletingIds((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    if (!window.confirm(`Are you sure you want to ${newStatus === "BLOCKED" ? "block" : "unblock"} this user?`)) return;

    try {
      await toggleStatus({ id, isActive: newStatus }).unwrap();
      toast.success(`User ${newStatus === "BLOCKED" ? "blocked" : "unblocked"} successfully`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const handleChangeRole = async (id: string, currentRole: string) => {
    const roleOrder = ["USER", "ADMIN", "SUPER_ADMIN"];
    const currentIdx = roleOrder.indexOf(currentRole);
    const nextRole = roleOrder[(currentIdx + 1) % roleOrder.length];

    if (!window.confirm(`Change role from ${currentRole} to ${nextRole}?`)) return;

    try {
      await changeRole({ id, role: nextRole }).unwrap();
      toast.success(`Role changed to ${nextRole}`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change role");
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage all users, roles, and permissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 bg-gradient-to-br from-pink-50 to-rose-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-500/10">
                <Users className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-pink-600">{totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-500/10">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter((u) => u.isActive === "ACTIVE").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-red-50 to-rose-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-500/10">
                <UserX className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Blocked</p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter((u) => u.isActive === "BLOCKED").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-blue-600">
                  {users.filter((u) => u.role === "ADMIN" || u.role === "SUPER_ADMIN").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 border-pink-200/50"
              />
            </div>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
              <SelectTrigger className="border-pink-200/50">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="border-pink-200/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Failed to load users</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-pink-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onEdit={setEditingUser}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              onChangeRole={handleChangeRole}
              isDeleting={deletingIds.has(user._id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({totalUsers} total)
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <EditUserDialog
        user={editingUser}
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
      />
    </div>
  );
}