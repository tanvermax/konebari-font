// components/layout/AdminLayoute/AddProduct/ProductAddForm.tsx
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import {
  useCreateProductMutation,
  useBrandsQuery,
} from "@/redux/features/product/product.api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  Plus,
  Layers,
  Truck,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

// ============================================
// ✅ TYPES
// ============================================

interface IVariant {
  skuId: string;
  combo: string;
  price: number;
  specialPrice?: number;
  quantity: number;
  status: "active" | "inactive";
  image?: string;
}

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
  variants: IVariant[];
  images: string[];
  isActive: boolean;
  allowCashOnDelivery: boolean;
  allowOnlinePayment: boolean;
}

const CATEGORIES = [
  "Skincare",
  "Makeup",
  "Hair Care",
  "Body Care",
  "Jewelry",
  "Perfume",
  "Accessories",
  "Combo",
];

export default function ProductAddForm() {
  const navigate = useNavigate();
  const [addProduct, { isLoading }] = useCreateProductMutation();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const isSubmitting = useRef(false);

  // ✅ Dynamic brands
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
      allowCashOnDelivery: true,
      allowOnlinePayment: true,
    },
  });

  // ✅ Variants array management
  const {
    fields: variantFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  // ✅ Watch for live preview
  const watchPrice = form.watch("price");
  const watchDiscount = form.watch("discountPrice");
  const hasDiscount = watchDiscount > 0 && watchDiscount < watchPrice;
  const discountPercent = hasDiscount
    ? Math.round(((watchPrice - watchDiscount) / watchPrice) * 100)
    : 0;

  // ============================================
  // ✅ IMAGE HANDLERS
  // ============================================

  const handleImageUpload = useCallback((file: File | null) => {
    if (!file) return;
    setImageFiles((prev) => [...prev, file]);
    const preview = URL.createObjectURL(file);
    setImagePreviews((prev) => [...prev, preview]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ============================================
  // ✅ ADD VARIANT
  // ============================================
  const addVariant = () => {
    append({
      skuId: `sku-${Date.now()}`,
      combo: "",
      price: 0,
      specialPrice: undefined,
      quantity: 0,
      status: "active",
      image: "",
    });
  };

  // ============================================
  // ✅ SUBMIT
  // ============================================

  const onSubmit = async (data: IProductForm) => {
    if (isSubmitting.current) return;

    if (!data.title) {
      toast.error("Product title is required");
      return;
    }

    if (data.variants.length === 0 && (!data.price || data.price <= 0)) {
      toast.error("Product price is required (or add variants)");
      return;
    }

    if (!data.allowCashOnDelivery && !data.allowOnlinePayment) {
      toast.error("At least one payment method must be enabled");
      return;
    }

    isSubmitting.current = true;

    try {
      // ✅ Prepare variants
      const apiVariants = data.variants.map((v) => ({
        skuId: v.skuId || `sku-${Date.now()}`,
        combo: v.combo || null,
        price: Number(v.price) || 0,
        specialPrice: v.specialPrice ? Number(v.specialPrice) : undefined,
        quantity: Number(v.quantity) || 0,
        status: v.status || "active",
        image: v.image || null,
      }));

      // ✅ Price calculations
      const variantPrices =
        apiVariants.length > 0
          ? apiVariants.map((v) => v.price)
          : [Number(data.price) || 0];

      const minPrice = Math.min(...variantPrices);
      const maxPrice = Math.max(...variantPrices);

      const totalStock =
        apiVariants.length > 0
          ? apiVariants.reduce((sum, v) => sum + v.quantity, 0)
          : Number(data.stock) || 0;

      const hasDiscountCalc =
        apiVariants.length > 0
          ? apiVariants.some((v) => v.specialPrice && v.specialPrice < v.price)
          : Number(data.discountPrice) > 0 &&
            Number(data.discountPrice) < Number(data.price);

      // ✅ Build payload
      const payload = {
        title: data.title,
        name: data.title,
        nameBn: data.nameBn || data.title,
        category: data.category || "Uncategorized",
        brand: data.brand || "Generic",
        description: data.description || "",
        shortDescription: data.shortDescription || "",
        highlights: data.shortDescription || "",

        price: minPrice,
        discountPrice: Number(data.discountPrice) || 0,
        minPrice,
        maxPrice,
        stock: totalStock,
        totalStock,
        hasDiscount: hasDiscountCalc,

        variants: apiVariants,

        status: data.isActive ? "active" : "inactive",
        isActive: data.isActive,

        // ✅ Payment options
        allowCashOnDelivery: data.allowCashOnDelivery,
        allowOnlinePayment: data.allowOnlinePayment,

        images: [],
      };

      console.log("📝 Payload:", payload);

      // ✅ FormData
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      imageFiles.forEach((file) => {
        formData.append("files", file);
      });

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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* ============ HEADER ============ */}
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

              {/* ============ BASIC INFORMATION ============ */}
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
                        <FormLabel className="font-semibold">
                          Product Title *
                        </FormLabel>
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
                        <FormLabel className="font-semibold">
                          Product Name (Bengali)
                        </FormLabel>
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
                        <FormLabel className="font-semibold">
                          Category *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-pink-200/50">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
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

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Description
                      </FormLabel>
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

                {/* Short description */}
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Short Description
                      </FormLabel>
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

              {/* ============ PRICING & STOCK ============ */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Tag className="w-4 h-4 text-pink-500" />
                  Base Pricing & Stock
                </h4>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl text-xs text-blue-800 dark:text-blue-300">
                  💡 If you add variants (sizes/options below), base price is
                  ignored. Otherwise fill base price for a single-size product.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Regular Price (৳)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1000"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value) || 0)
                            }
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
                        <FormLabel className="font-semibold">
                          Special/Discount Price (৳)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="900 (optional)"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value) || 0)
                            }
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
                        <FormLabel className="font-semibold">
                          Stock Quantity
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="50"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value) || 0)
                            }
                            className="border-pink-200/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Live preview */}
                {watchPrice > 0 && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border border-rose-100">
                    <p className="text-[10px] uppercase font-bold text-rose-600 tracking-wider mb-2">
                      👁️ Base Price Preview
                    </p>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-2xl font-bold text-rose-600">
                        ৳
                        {(hasDiscount
                          ? watchDiscount
                          : watchPrice
                        ).toLocaleString()}
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

              {/* ============ VARIANTS SECTION ============ */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-pink-500" />
                    Product Variants (Sizes / Options)
                  </h4>
                  <Button
                    type="button"
                    size="sm"
                    onClick={addVariant}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl gap-1.5 h-8"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Variant
                  </Button>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                  💡 Example: 10ml → ৳500, 20ml → ৳800, 30ml → ৳1000. Customer
                  will pick a size and pay the matching price.
                </div>

                {variantFields.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                    <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No variants added</p>
                    <p className="text-xs">
                      Click "Add Variant" to add sizes/options
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {variantFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-4 border rounded-xl space-y-3 relative bg-gradient-to-br from-pink-50/30 to-rose-50/30"
                      >
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase">
                              Size/Name *
                            </label>
                            <Input
                              {...form.register(`variants.${index}.combo`)}
                              placeholder="10ml, 20ml, Small..."
                              className="h-9 text-sm"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase">
                              Price (৳) *
                            </label>
                            <Input
                              type="number"
                              {...form.register(`variants.${index}.price`, {
                                valueAsNumber: true,
                              })}
                              placeholder="500"
                              className="h-9 text-sm"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase">
                              Special Price (৳)
                            </label>
                            <Input
                              type="number"
                              {...form.register(
                                `variants.${index}.specialPrice`,
                                {
                                  valueAsNumber: true,
                                  setValueAs: (v) =>
                                    v === "" || isNaN(v) ? undefined : v,
                                },
                              )}
                              placeholder="Optional"
                              className="h-9 text-sm"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase">
                              Stock Qty *
                            </label>
                            <Input
                              type="number"
                              {...form.register(`variants.${index}.quantity`, {
                                valueAsNumber: true,
                              })}
                              placeholder="50"
                              className="h-9 text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase">
                              Variant Image URL
                            </label>
                            <Input
                              {...form.register(`variants.${index}.image`)}
                              placeholder="Optional"
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase">
                              Status
                            </label>
                            <Select
                              value={form.watch(`variants.${index}.status`)}
                              onValueChange={(val) =>
                                form.setValue(
                                  `variants.${index}.status`,
                                  val as any,
                                )
                              }
                            >
                              <SelectTrigger className="h-9 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                  Inactive
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ============ IMAGES ============ */}
              <div className="space-y-4 border-t pt-6">
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

              {/* ============ PAYMENT OPTIONS ============ */}
              <div className="space-y-4 border-t pt-6">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-pink-500" />
                  Payment Options
                </h4>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                  💡 Choose which payment methods customers can use when buying
                  this product.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* COD */}
                  <FormField
                    control={form.control}
                    name="allowCashOnDelivery"
                    render={({ field }) => (
                      <div
                        onClick={() => field.onChange(!field.value)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          field.value
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                            : "border-stone-200 dark:border-stone-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              field.value
                                ? "border-emerald-500 bg-emerald-500"
                                : "border-stone-300"
                            }`}
                          >
                            {field.value && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-emerald-600" />
                            <span className="font-semibold text-sm">
                              Cash on Delivery
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 ml-8">
                          Customer pays cash when delivered
                        </p>
                      </div>
                    )}
                  />

                  {/* Online */}
                  <FormField
                    control={form.control}
                    name="allowOnlinePayment"
                    render={({ field }) => (
                      <div
                        onClick={() => field.onChange(!field.value)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          field.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                            : "border-stone-200 dark:border-stone-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              field.value
                                ? "border-blue-500 bg-blue-500"
                                : "border-stone-300"
                            }`}
                          >
                            {field.value && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-sm">
                              Online Payment
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 ml-8">
                          bKash / Nagad / Card (SSLCommerz)
                        </p>
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* ============ STATUS ============ */}
              <div className="space-y-4 border-t pt-6">
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

              {/* ============ ACTIONS ============ */}
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
