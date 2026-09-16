// components/layout/Profile/PersonalInfoTab.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, Save, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateProfileMutation } from "@/redux/features/auth/auth.api";

interface PersonalInfoTabProps {
  user: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string | number;
    address?: string;
  };
}

interface IProfileForm {
  name: string;
  phone?: string;
  address?: string;
}

export default function PersonalInfoTab({ user }: PersonalInfoTabProps) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<IProfileForm>({
      defaultValues: {
        name: user?.name || "",
        phone: user?.phone ? String(user.phone) : "",
        address: user?.address || "",
      },
    });

  const onSubmit = async (data: IProfileForm) => {
    try {
      await updateProfile({
        name: data.name,
        phone: data.phone,
        address: data.address,
      }).unwrap();

      toast.success("Profile updated successfully ✨");
      setIsEditing(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <Card className="border-border/40">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <User className="w-4 h-4 text-rose-500" />
          Personal Information
        </CardTitle>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="rounded-xl border-rose-200/60 hover:bg-rose-50 dark:hover:bg-rose-950/20"
          >
            Edit
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <User className="w-3 h-3 text-rose-500" />
              Full Name
            </Label>
            {isEditing ? (
              <>
                <Input
                  {...register("name", { required: "Name is required" })}
                  placeholder="Your name"
                  className="h-10 border-rose-200/50"
                />
                {errors.name && (
                  <p className="text-[10px] text-red-500">{errors.name.message}</p>
                )}
              </>
            ) : (
              <p className="text-sm py-2 px-3 bg-stone-50 dark:bg-stone-900/40 rounded-lg">
                {user?.name || "Not set"}
              </p>
            )}
          </div>

          {/* Email (read-only) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-rose-500" />
              Email Address
            </Label>
            <div className="relative">
              <p className="text-sm py-2 px-3 bg-stone-100 dark:bg-stone-900/60 rounded-lg text-muted-foreground flex items-center justify-between">
                {user?.email || "Not set"}
                <Lock className="w-3 h-3" />
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-rose-500" />
              Phone Number
            </Label>
            {isEditing ? (
              <Input
                {...register("phone")}
                placeholder="01XXXXXXXXX"
                className="h-10 border-rose-200/50"
              />
            ) : (
              <p className="text-sm py-2 px-3 bg-stone-50 dark:bg-stone-900/40 rounded-lg">
                {user?.phone || "Not set"}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-rose-500" />
              Address
            </Label>
            {isEditing ? (
              <Textarea
                {...register("address")}
                placeholder="Your full address"
                rows={3}
                className="border-rose-200/50 resize-none"
              />
            ) : (
              <p className="text-sm py-2 px-3 bg-stone-50 dark:bg-stone-900/40 rounded-lg min-h-[42px]">
                {user?.address || "Not set"}
              </p>
            )}
          </div>

          {/* Actions */}
          {isEditing && (
            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="rounded-xl"
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}