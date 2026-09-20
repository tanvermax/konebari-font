// components/layout/AdminLayoute/AddProduct/ProductAddForm.tsx
import { useForm } from "react-hook-form";
import { useCreateProductMutation, useBrandsQuery } from "@/redux/features/product/product.api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useCallback, useRef } from "react";
import SingleImageUploader from "./SingleImageUploader";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
   
  Trash2, 
  Image, 
  Package, 
  Info,
  Loader2,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

interface IProductForm {
  title: string;
  nameBn: string;
  category: string;
  brand: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice: number;
  stock: number;
  variants: {
    skuId: string;
    combo: string;
    price: number;
    specialPrice?: number;
    quantity: number;
    status: 'active' | 'inactive';
    image?: string;
  }[];
  images: string[];
  isActive: boolean;
}

const CATEGORIES = ["Skincare", "Makeup", "Hair Care", "Body Care", "Jewelry", "Perfume", "Accessories", "Combo"];

export default function ProductAddForm() {
  const navigate = useNavigate();
  const [addProduct, { isLoading }] = useCreateProductMutation();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const isSubmitting = useRef(false);

  // ✅ Fetch dynamic brands
  const { data: brandsData } = useBrandsQuery(undefined);
  const brands = Array.isArray(brandsData) ? brandsData : [];
  const brandNames = brands
    .map((b: any) => (typeof b === "string" ? b : b.name || b._id))
    .filter(Boolean);

  const form = useForm<IProductForm>({
    defaultValues: {
      title: "",
      nameBn: "",
      category: "",
      brand: "",
      description: "",
      shortDescription: "",
      price: 0,
      discountPrice: 0,
      stock: 0,
      variants: [],
      images: [],
      isActive: true,
    },
  });

  // Watch price & discountPrice for preview
  const watchPrice = form.watch("price");
  const watchDiscount = form.watch("discountPrice");
  const hasDiscount = watchDiscount > 0 && watchDiscount < watchPrice;
  const discountPercent = hasDiscount
    ? Math.round(((watchPrice - watchDiscount) / watchPrice) * 100)
    : 0;

  const handleImageUpload = useCallback((file: File | null) => {
    if (!file) return;
    setImageFiles(prev => [...prev, file]);
    const preview = URL.createObjectURL(file);
    setImagePreviews(prev => [...prev, preview]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  }, []);

  const onSubmit = async (data: IProductForm) => {
    if (isSubmitting.current) return;

    if (!data.title) {
      toast.error("Product title is required");
      return;
    }
    if (!data.price || data.price <= 0) {
      toast.error("Regular price is required");
      return;
    }

    isSubmitting.current = true;

    try {
      // ✅ Auto-calculate hasDiscount
      const regularPrice = Number(data.price) || 0;
      const specialPrice = Number(data.discountPrice) || 0;
      const hasDiscount = specialPrice > 0 && specialPrice < regularPrice;
  

      // ✅ Build payload matching backend
      const payload = {
        title: data.title,
        name: data.title,
        nameBn: data.nameBn || data.title,
        category: data.category || "Uncategorized",
        brand: data.brand || "Generic",
        description: data.description || "",
        shortDescription: data.shortDescription || "",
        highlights: data.shortDescription || "",

        // ✅ Prices
        price: regularPrice,                          // 1000
        discountPrice: hasDiscount ? specialPrice : 0, // 900 or 0

        // ✅ Stock
        stock: Number(data.stock) || 0,
        totalStock: Number(data.stock) || 0,

        // ✅ Status
        status: data.isActive ? "active" : "inactive",
        isActive: data.isActive,

        // ✅ NO VARIANTS (unless user adds)
        variants: [],

        // ✅ Images will be added via FormData files
        images: [],
      };

      console.log("📝 Payload:", payload);

      // ✅ FormData
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      // ✅ Image files
      imageFiles.forEach((file) => {
        formData.append("files", file);
      });

      console.log("📤 FormData:");
      for (let pair of formData.entries()) {
        console.log("  -", pair[0], ":", pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]);
      }

      // ✅ API call
      const result = await addProduct(formData).unwrap();
      console.log("✅ Success:", result);

      toast.success("Product created successfully! ✨");

      // Reset
      form.reset();
      setImageFiles([]);
      setImagePreviews([]);
      navigate("/admin/products");

    } catch (error: any) {
      console.error("❌ API Error:", error);
      toast.error(error?.data?.message || "Failed to create product");
    } finally {
      isSubmitting.current = false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10">
                    <Sparkles className="w-6 h-6 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Add New Product</h3>
                    <p className="text-xs text-muted-foreground">
                      Fill in the details below
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
                  New
                </Badge>
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Package className="w-4 h-4 text-pink-500" />
                  Basic Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Product Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Hydrating Rose Serum"
                            {...field}
                            className="border-pink-200/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nameBn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Product Name (Bengali)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="বাংলা নাম"
                            {...field}
                            className="border-pink-200/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Category + Brand */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Category *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-pink-200/50">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-pink-500" />
                          Brand
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Generic, Glow Beauty"
                            {...field}
                            list="brands-list"
                            className="border-pink-200/50"
                          />
                        </FormControl>
                        {/* ✅ Datalist for autocomplete */}
                        <datalist id="brands-list">
                          {brandNames.map((brand: string) => (
                            <option key={brand} value={brand} />
                          ))}
                        </datalist>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Detailed product description..."
                          {...field}
                          className="border-pink-200/50 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Short Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Key highlights..."
                          {...field}
                          className="border-pink-200/50 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Pricing Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Tag className="w-4 h-4 text-pink-500" />
                  Pricing & Stock
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Regular Price (৳) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1000"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                            className="border-pink-200/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discountPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Special/Discount Price (৳)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="900 (optional)"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                            className="border-pink-200/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Stock Quantity *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="50"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                            className="border-pink-200/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ✅ Live Preview */}
                {watchPrice > 0 && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border border-rose-100 dark:border-rose-900/40">
                    <p className="text-[10px] uppercase font-bold text-rose-600 tracking-wider mb-2">
                      👁️ Live Preview
                    </p>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-2xl font-bold text-rose-600">
                        ৳{(hasDiscount ? watchDiscount : watchPrice).toLocaleString()}
                      </span>
                      {hasDiscount && (
                        <>
                          <span className="text-sm text-muted-foreground line-through">
                            ৳{watchPrice.toLocaleString()}
                          </span>
                          <Badge className="bg-rose-100 text-rose-700 border-0 text-[10px]">
                            -{discountPercent}%
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Image className="w-4 h-4 text-pink-500" />
                  Product Images
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {imagePreviews.map((preview, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group aspect-square"
                      >
                        <div className="w-full h-full rounded-xl overflow-hidden border-2 border-pink-100/50">
                          <img
                            src={preview}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {imagePreviews.length < 5 && (
                    <div className="aspect-square rounded-xl border-2 border-dashed border-pink-200/50 flex items-center justify-center hover:border-pink-400 transition-colors">
                      <SingleImageUploader onChange={handleImageUpload} />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload up to 5 images. First image will be the main image.
                </p>
              </div>

              {/* Status */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4 text-pink-500" />
                  Status
                </h4>
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        value={field.value ? "active" : "inactive"}
                        onValueChange={(v) => field.onChange(v === "active")}
                      >
                        <FormControl>
                          <SelectTrigger className="border-pink-200/50">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  type="submit"
                  disabled={isLoading || isSubmitting.current}
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl px-8 py-6"
                >
                  {isLoading || isSubmitting.current ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Product
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setImageFiles([]);
                    setImagePreviews([]);
                  }}
                  className="rounded-xl px-8 py-6"
                >
                  Reset Form
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}