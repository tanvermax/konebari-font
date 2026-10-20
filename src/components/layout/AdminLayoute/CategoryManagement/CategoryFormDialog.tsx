// components/layout/AdminLayoute/CategoryManagement/CategoryFormDialog.tsx
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
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/redux/features/category/category.api";

interface CategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  category?: any | null;
}

interface IFormData {
  name: string;
  description?: string;
}

export default function CategoryFormDialog({
  open,
  onClose,
  category,
}: CategoryFormDialogProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const isEdit = !!category?._id;
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const isProcessing = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (open) {
      if (isEdit) {
        reset({
          name: category.name || "",
          description: category.description || "",
        });
        setPreview(category.image || null);
      } else {
        reset({ name: "", description: "" });
        setPreview(null);
      }
      setFile(null);
    }
  }, [open, category, isEdit, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const removeFile = () => {
    setFile(null);
    setPreview(isEdit ? category?.image || null : null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = async (data: IFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      // ⚠️ Backend multer field = "file"
      if (file) formData.append("file", file);

      if (isEdit) {
        await updateCategory({ id: category._id, formData }).unwrap();
        toast.success("Category updated successfully");
      } else {
        await createCategory(formData).unwrap();
        toast.success("Category created successfully");
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
          <DialogTitle>{isEdit ? "Edit Category" : "Add Category"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Image */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Category Image</Label>
            <div className="flex items-center gap-3">
              {preview ? (
                <div className="relative w-24 h-16 rounded-lg border border-border bg-stone-50 dark:bg-stone-900 flex items-center justify-center p-1 overflow-hidden">
                  <img
                    src={preview}
                    alt="preview"
                    className="max-w-full max-h-full object-cover"
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
                PNG / JPG, max 2MB
              </p>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Category Name *</Label>
            <Input
              {...register("name", { required: "Name is required" })}
              placeholder="e.g. Skincare"
              className="h-10"
            />
            {errors.name && (
              <p className="text-[10px] text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Description (Optional)</Label>
            <Textarea
              {...register("description")}
              placeholder="Short description..."
              rows={3}
            />
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
                "Update Category"
              ) : (
                "Create Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}