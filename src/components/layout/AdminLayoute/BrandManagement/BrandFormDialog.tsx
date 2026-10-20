// components/layout/AdminLayoute/BrandManagement/BrandFormDialog.tsx
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateBrandMutation,
  useUpdateBrandMutation,
} from "@/redux/features/brand/brand.api";

interface BrandFormDialogProps {
  open: boolean;
  onClose: () => void;
  brand?: any | null;
}

interface IFormData {
  name: string;
  description?: string;
  website?: string;
  displayOrder: number;
  isActive: boolean;
}

export default function BrandFormDialog({
  open,
  onClose,
  brand,
}: BrandFormDialogProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const isEdit = !!brand?._id;
  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  const isProcessing = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: {
      name: "",
      description: "",
      website: "",
      displayOrder: 0,
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  // Reset on open/edit
  useEffect(() => {
    if (open) {
      if (isEdit) {
        reset({
          name: brand.name || "",
          description: brand.description || "",
          website: brand.website || "",
          displayOrder: brand.displayOrder ?? 0,
          isActive: brand.isActive ?? true,
        });
        setPreview(brand.logo || null);
      } else {
        reset({
          name: "",
          description: "",
          website: "",
          displayOrder: 0,
          isActive: true,
        });
        setPreview(null);
      }
      setFile(null);
    }
  }, [open, brand, isEdit, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const removeFile = () => {
    setFile(null);
    setPreview(isEdit ? brand?.logo || null : null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = async (data: IFormData) => {
    try {
      // Validation
      if (!isEdit && !file) {
        toast.error("Please upload a logo");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      if (data.website) formData.append("website", data.website);
      formData.append("displayOrder", String(data.displayOrder));
      formData.append("isActive", String(data.isActive));
      if (file) formData.append("logo", file);

      if (isEdit) {
        await updateBrand({ id: brand._id, formData }).unwrap();
        toast.success("Brand updated successfully");
      } else {
        await createBrand(formData).unwrap();
        toast.success("Brand created successfully");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Brand" : "Add New Brand"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Logo Upload */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Brand Logo {!isEdit && "*"}
            </Label>
            <div className="flex items-center gap-3">
              {preview ? (
                <div className="relative w-24 h-16 rounded-lg border border-border bg-stone-50 dark:bg-stone-900 flex items-center justify-center p-2">
                  <img
                    src={preview}
                    alt="preview"
                    className="max-w-full max-h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-24 h-16 rounded-lg border-2 border-dashed border-border hover:border-rose-400 flex flex-col items-center justify-center text-muted-foreground hover:text-rose-500 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-[9px] mt-0.5">Upload</span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-[10px] text-muted-foreground">
                PNG / SVG / JPG, max 2MB
              </p>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Brand Name *</Label>
            <Input
              {...register("name", { required: "Name is required" })}
              placeholder="e.g. Chanel"
              className="h-10"
            />
            {errors.name && (
              <p className="text-[10px] text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Website */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Website (Optional)</Label>
            <Input
              {...register("website")}
              placeholder="https://example.com"
              className="h-10"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Description (Optional)
            </Label>
            <Textarea
              {...register("description")}
              placeholder="Short description..."
              rows={2}
            />
          </div>

          {/* Display order + Active */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Display Order</Label>
              <Input
                type="number"
                {...register("displayOrder", { valueAsNumber: true })}
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Status</Label>
              <button
                type="button"
                onClick={() => setValue("isActive", !isActive)}
                className={`w-full h-10 rounded-md border text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "bg-stone-100 border-border text-muted-foreground"
                }`}
              >
                {isActive ? "✓ Active" : "Inactive"}
              </button>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Update Brand"
              ) : (
                "Create Brand"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}