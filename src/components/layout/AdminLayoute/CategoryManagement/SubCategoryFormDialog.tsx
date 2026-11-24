// components/layout/AdminLayoute/CategoryManagement/SubCategoryFormDialog.tsx
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetCategoriesQuery } from "@/redux/features/category/category.api";
import { useCreateSubCategoryMutation } from "@/redux/features/subcategory/subcategory.api";

interface IFormData {
  name: string;
  categoryId: string;
}

export default function SubCategoryFormDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const { data: mainCategories } = useGetCategoriesQuery(undefined);
  const [createSubCategory, { isLoading: isCreating }] = useCreateSubCategoryMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormData>({
    defaultValues: { name: "", categoryId: "" },
  });

  useEffect(() => {
    if (open) {
      reset({ name: "", categoryId: "" });
      setPreview(null);
      setFile(null);
    }
  }, [open, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (data: IFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("categoryId", data.categoryId);
      if (file) formData.append("file", file);

      await createSubCategory(formData).unwrap();
      toast.success("Sub-Category created successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Sub-Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* ✅ Parent Category Select */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Select Main Category *</Label>
            <select
              {...register("categoryId", { required: "Please select a main category" })}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">-- Choose Main Category --</option>
              {Array.isArray(mainCategories) && mainCategories.map((cat: any) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-[10px] text-red-500">{errors.categoryId.message}</p>}
          </div>

          {/* Sub Category Image */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Sub-Category Icon / Image</Label>
            <div className="flex items-center gap-3">
              {preview ? (
                <div className="relative w-20 h-20 rounded-full border border-border bg-stone-50 flex items-center justify-center p-1 overflow-hidden">
                  <img src={preview} alt="preview" className="max-w-full max-h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-20 h-20 rounded-full border-2 border-dashed border-border hover:border-rose-400 flex flex-col items-center justify-center text-muted-foreground transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-[9px] mt-1">Upload</span>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
          </div>

          {/* Sub Category Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Sub-Category Name *</Label>
            <Input
              {...register("name", { required: "Name is required" })}
              placeholder="e.g. Face Wash, Lipstick"
              className="h-10"
            />
            {errors.name && <p className="text-[10px] text-red-500">{errors.name.message}</p>}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating} className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
              {isCreating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Sub-Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}