// EditProduct.tsx - আপনার API response অনুযায়ী ফিক্সড
"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, Image, Plus, Trash2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  usePricestockDetailsQuery,
  useUpdateProductMutation,
} from "@/redux/features/product/product.api";

// ✅ API থেকে আসা ভেরিয়েন্ট টাইপ
interface IProductVariant {
  skuId: string;
  combo?: string | null;
  price: number;
  specialPrice?: number;
  quantity: number;
  status: 'active' | 'inactive';
  image?: string | null;
}

interface IFormVariant {
  skuId: string;
  combo: string;
  price: number;
  specialPrice?: number;
  quantity: number;
  status: 'active' | 'inactive';
  image?: string;
}

interface IProductForm {
  title: string;          // 👈 API response এ 'title', 'name' নয়
  nameBn: string;
  category: string;
  description: string;
  shortDescription: string; // 👈 'highlights' নয়
  price: number;
  discountPrice: number;
  stock: number;
  brand: string;
  variants: IFormVariant[];
  images: string[];
  isActive: boolean;      // 👈 'status' নয়
}

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { 
    data: product, 
    isLoading, 
    isError,
  } = usePricestockDetailsQuery(id || '', {
    skip: !id,
  });

  const [updateProduct, { isLoading: isSaving }] = useUpdateProductMutation();

  const [images, setImages] = useState<string[]>([]);

  console.log("📦 Product Data:", product);

  const form = useForm<IProductForm>({
    defaultValues: {
      title: "",
      nameBn: "",
      category: "",
      description: "",
      shortDescription: "",
      price: 0,
      discountPrice: 0,
      stock: 0,
      brand: "Generic",
      variants: [],
      images: [],
      isActive: true,
    },
  });

  // ✅ Populate form when product loads
  useEffect(() => {
    if (product) {
      console.log("📝 Populating form with:", product);

      // ✅ API থেকে আসা variants কে ফর্মের variants এ convert করুন
      const formVariants: IFormVariant[] = (product.variants || []).map((v: IProductVariant) => ({
        skuId: v.skuId,
        combo: v.combo || '',
        price: v.price,
        specialPrice: v.specialPrice,
        quantity: v.quantity,
        status: v.status,
        image: v.image || '',
      }));

      form.reset({
        title: product.title || "",
        nameBn: product.nameBn || "",
        category: product.category || "",
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        price: product.price || 0,
        discountPrice: product.discountPrice || 0,
        stock: product.stock || 0,
        brand: product.brand || "Generic",
        variants: formVariants,
        images: product.images || [],
        isActive: product.isActive ?? true,
      });
      
      setImages(product.images || []);
    }
  }, [product, form]);

// EditProduct.tsx - onSubmit
const onSubmit = async (data: IProductForm) => {
    if (!id) {
        toast.error("Product ID is missing");
        return;
    }

    try {
        // ✅ updateData তৈরি
        const updateData = {
            title: data.title,
            nameBn: data.nameBn,
            category: data.category,
            description: data.description,
            shortDescription: data.shortDescription,
            price: Number(data.price) || 0,
            discountPrice: Number(data.discountPrice) || 0,
            stock: Number(data.stock) || 0,
            brand: data.brand,
            variants: data.variants,
            images: data.images,
            isActive: data.isActive,
        };

        console.log('📤 Sending updateData:', updateData);

        // ✅ FormData তৈরি করুন
        const formData = new FormData();
        formData.append('data', JSON.stringify(updateData));

        // ✅ FormData চেক করুন
        console.log('📤 FormData entries:');
        for (let pair of formData.entries()) {
            console.log('  -', pair[0], ':', pair[1]);
        }

        // ✅ API কল
        const res = await updateProduct({
            id,
            updateData: formData,   // 👈 FormData পাঠান
        }).unwrap();

        console.log('✅ Update Success:', res);
        toast.success("Product updated successfully ✨");
        navigate(-1);

    } catch (error: any) {
        console.error('❌ Update error:', error);
        toast.error(error?.data?.message || "Failed to update product");
    }
};

  // ✅ Add variant
  const addVariant = () => {
    const currentVariants = form.getValues('variants') || [];
    const newVariant: IFormVariant = {
      skuId: `sku-${Date.now()}`,
      combo: '',
      price: 0,
      quantity: 0,
      status: 'active',
      image: '',
    };
    form.setValue('variants', [...currentVariants, newVariant]);
  };

  // ✅ Remove variant
  const removeVariant = (index: number) => {
    const variants = form.getValues('variants') || [];
    form.setValue('variants', variants.filter((_, i) => i !== index));
  };

  // ✅ Update variant
  const updateVariant = (index: number, field: keyof IFormVariant, value: any) => {
    const variants = form.getValues('variants') || [];
    variants[index] = { ...variants[index], [field]: value };
    form.setValue('variants', variants);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto p-10 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">😕</span>
          </div>
          <h2 className="text-2xl font-bold text-red-500 mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/admin/products')} className="bg-gradient-to-r from-pink-500 to-rose-500">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-4 md:p-6 max-w-4xl space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Edit Product
          </h1>
          <p className="text-sm text-muted-foreground">Update product information</p>
        </div>
        <Badge className="ml-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
          <Sparkles className="w-3 h-3 mr-1" />
          {product.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <Card className="border-0 shadow-xl rounded-2xl">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold">Product Title *</Label>
                <Input
                  {...form.register('title')}
                  className="border-pink-200/50 focus-visible:ring-pink-400"
                  placeholder="Enter product title"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Product Name (Bengali)</Label>
                <Input
                  {...form.register('nameBn')}
                  className="border-pink-200/50 focus-visible:ring-pink-400"
                  placeholder="বাংলা নাম"
                />
              </div>
            </div>

            {/* Category & Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold">Category *</Label>
                <Input
                  {...form.register('category')}
                  className="border-pink-200/50 focus-visible:ring-pink-400"
                  placeholder="e.g. Skincare, Makeup"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Brand</Label>
                <Input
                  {...form.register('brand')}
                  className="border-pink-200/50 focus-visible:ring-pink-400"
                  placeholder="Generic"
                />
              </div>
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold">Price (৳) *</Label>
                <Input
                  type="number"
                  {...form.register('price', { valueAsNumber: true })}
                  className="border-pink-200/50 focus-visible:ring-pink-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Discount Price (৳)</Label>
                <Input
                  type="number"
                  {...form.register('discountPrice', { valueAsNumber: true })}
                  className="border-pink-200/50 focus-visible:ring-pink-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Stock</Label>
                <Input
                  type="number"
                  {...form.register('stock', { valueAsNumber: true })}
                  className="border-pink-200/50 focus-visible:ring-pink-400"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="font-semibold">Description</Label>
              <Textarea
                {...form.register('description')}
                rows={4}
                className="border-pink-200/50 focus-visible:ring-pink-400 resize-none"
                placeholder="Full product description"
              />
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <Label className="font-semibold">Short Description</Label>
              <Textarea
                {...form.register('shortDescription')}
                rows={3}
                className="border-pink-200/50 focus-visible:ring-pink-400 resize-none"
                placeholder="Key features and benefits"
              />
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label className="font-semibold flex items-center gap-2">
                <Image className="w-4 h-4 text-pink-500" />
                Product Images
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-pink-100/50">
                    <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = images.filter((_, i) => i !== index);
                        setImages(newImages);
                        form.setValue('images', newImages);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <div className="aspect-square rounded-xl border-2 border-dashed border-pink-200/50 flex items-center justify-center hover:border-pink-400 transition-colors">
                  <div className="text-center">
                    <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Add Image</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="font-semibold">Status</Label>
              <Select
                value={form.watch('isActive') ? 'active' : 'inactive'}
                onValueChange={(value) => form.setValue('isActive', value === 'active')}
              >
                <SelectTrigger className="border-pink-200/50 focus-visible:ring-pink-400">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Variants */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Variants ({form.watch('variants')?.length || 0})</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addVariant}
                  className="border-pink-200 hover:bg-pink-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Variant
                </Button>
              </div>

              {form.watch('variants')?.map((variant, index) => (
                <div key={variant.skuId || index} className="p-4 border rounded-xl space-y-3 relative bg-pink-50/10">
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Combo</Label>
                      <Input
                        value={variant.combo || ''}
                        onChange={(e) => updateVariant(index, 'combo', e.target.value)}
                        className="text-sm h-9"
                        placeholder="Variant name"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Price (৳)</Label>
                      <Input
                        type="number"
                        value={variant.price || 0}
                        onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                        className="text-sm h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Special Price</Label>
                      <Input
                        type="number"
                        value={variant.specialPrice || ''}
                        onChange={(e) => updateVariant(index, 'specialPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="text-sm h-9"
                        placeholder="Optional"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Quantity</Label>
                      <Input
                        type="number"
                        value={variant.quantity || 0}
                        onChange={(e) => updateVariant(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="text-sm h-9"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Status</Label>
                      <Select
                        value={variant.status}
                        onValueChange={(value: 'active' | 'inactive') => updateVariant(index, 'status', value)}
                      >
                        <SelectTrigger className="text-sm h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Image URL</Label>
                      <Input
                        value={variant.image || ''}
                        onChange={(e) => updateVariant(index, 'image', e.target.value)}
                        className="text-sm h-9"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {(!form.watch('variants') || form.watch('variants').length === 0) && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                  <p className="text-sm">No variants added yet</p>
                  <p className="text-xs">Click "Add Variant" to add product options</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-pink-100/50">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/25 rounded-xl px-8 py-6"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Update Product
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="rounded-xl px-8 py-6 border-pink-200/50 hover:bg-pink-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}