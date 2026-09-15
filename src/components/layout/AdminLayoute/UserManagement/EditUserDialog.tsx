// components/layout/AdminLayoute/UserManagement/EditUserDialog.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { useUpdateUserMutation } from "@/redux/features/user/user.api";
import type { IUser } from "@/types/user.types";

interface EditUserDialogProps {
  user: IUser | null;
  open: boolean;
  onClose: () => void;
}

interface IEditUserForm {
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
}

export default function EditUserDialog({ user, open, onClose }: EditUserDialogProps) {
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const { register, handleSubmit, reset, setValue, watch } = useForm<IEditUserForm>({
    defaultValues: {
      name: "",
      email: "",
      role: "USER",
      isActive: "ACTIVE",
    },
  });

  // ✅ Populate form when user changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "USER",
        isActive: user.isActive || "ACTIVE",
      });
    }
  }, [user, reset]);

// EditUserDialog.tsx
const onSubmit = async (data: IEditUserForm) => {
  if (!user) return;

  console.log("📤 Sending payload to backend:", data);

  try {
    const result = await updateUser({
      id: user._id,
      updateData: {
        name: data.name,
        email: data.email,
        role: data.role,
        isActive: data.isActive,
      },
    }).unwrap();

    console.log("✅ Update success:", result);
    toast.success("User updated successfully ✨");
    onClose();
  } catch (error: any) {
    console.error("❌ Update error:", error);
    toast.error(error?.data?.message || "Failed to update user");
  }
};


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label className="font-semibold">Name</Label>
            <Input
              {...register("name")}
              placeholder="User name"
              className="border-pink-200/50"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="font-semibold">Email</Label>
            <Input
              type="email"
              {...register("email")}
              placeholder="user@example.com"
              className="border-pink-200/50"
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label className="font-semibold">Role</Label>
            <Select
              value={watch("role")}
              onValueChange={(value) => setValue("role", value as any)}
              disabled={user?.role === 'SUPER_ADMIN'}
            >
              <SelectTrigger className="border-pink-200/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="font-semibold">Status</Label>
            <Select
              value={watch("isActive")}
              onValueChange={(value) => setValue("isActive", value as any)}
              disabled={user?.role === 'SUPER_ADMIN'}
            >
              <SelectTrigger className="border-pink-200/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}