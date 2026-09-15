// ProductAddForm.tsx
import { useForm } from "react-hook-form";
import { useCreateProductMutation } from "@/redux/features/product/product.api";
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
  Plus, 
  Trash2, 
  Image, 
  Package, 
  Layers,
  Info,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";

interface IProductForm {
  name: string;
  nameBn: string;
  category: string;
  description: string;
  highlights: string;
  warranty: string;
  specs: Record<string, string>;
  variants: {
    skuId: string;
    combo: string;
    price: number;
    specialPrice?: number;
    quantity: number;
    status: 'active' | 'inactive';
    image?: string;
  }[];
  mainImage: string;
  images: string[];
  status: 'active' | 'inactive';
}

const CATEGORIES = ["Skincare", "Makeup", "Hair Care", "Body Care", "Jewelry", "Perfume", "Accessories"];

export default function ProductAddForm() {
  const [addProduct, { isLoading }] = useCreateProductMutation();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const isSubmitting = useRef(false);

  const form = useForm<IProductForm>({
    defaultValues: {
      name: "",
      nameBn: "",
      category: "",
      description: "",
      highlights: "",
      warranty: "",
      specs: {},
      variants: [],
      mainImage: "",
      images: [],
      status: 'active',
    },
  });

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

  const addVariant = useCallback(() => {
    const currentVariants = form.getValues('variants') || [];
    const newVariant = {
      skuId: `sku-${Date.now()}`,
      combo: '',
      price: 0,
      quantity: 0,
      status: 'active' as const,
      image: '',
    };
    form.setValue('variants', [...currentVariants, newVariant]);
  }, [form]);

  const removeVariant = useCallback((index: number) => {
    const variants = form.getValues('variants') || [];
    form.setValue('variants', variants.filter((_, i) => i !== index));
  }, [form]);

  const updateVariant = useCallback((index: number, field: string, value: any) => {
    const variants = form.getValues('variants') || [];
    variants[index] = { ...variants[index], [field]: value };
    form.setValue('variants', variants);
  }, [form]);

  // ✅ সম্পূর্ণ ফিক্সড onSubmit - Postman এর মতো ডেটা পাঠান
  const onSubmit = async (data: IProductForm) => {
    if (isSubmitting.current) return;

    const currentVariants = form.getValues('variants') || [];

    if (currentVariants.length === 0) {
      toast.error("At least one variant is required");
      return;
    }

    isSubmitting.current = true;

    try {
      // 1. Variants প্রস্তুত করা
      const apiVariants = currentVariants.map(v => ({
        skuId: v.skuId || `sku-${Date.now()}`,
        combo: v.combo || null,
        price: Number(v.price) || 0,
        specialPrice: Number(v.specialPrice) || Number(v.price) || 0,
        quantity: Number(v.quantity) || 0,
        status: v.status || 'active',
        image: v.image || null,
      }));

      // 2. প্রাইস ক্যালকুলেশন
      const prices = apiVariants.map(v => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const totalStock = apiVariants.reduce((sum, v) => sum + v.quantity, 0);
      const hasDiscount = apiVariants.some(v => v.specialPrice && v.specialPrice < v.price);

      // 3. পেলোড তৈরি - ✅ Postman এর মতো স্ট্রাকচার
      const payload = {
        name: data.name,
        nameBn: data.nameBn || data.name,
        category: data.category,
        description: data.description || "",
        highlights: data.highlights || "",
        warranty: data.warranty || null,
        specs: {},
        variants: apiVariants,
        price: minPrice,
        minPrice: minPrice,
        maxPrice: maxPrice,
        specialPrice: apiVariants[0]?.specialPrice || minPrice,
        hasDiscount: hasDiscount,
        totalStock: totalStock,
        inStock: totalStock > 0,
        status: data.status,
        variantCount: apiVariants.length,
        images: imagePreviews.length > 0 ? imagePreviews : [],
      };

      console.log('📝 Payload:', payload);

      // 4. FormData তৈরি - ✅ Postman এর মতো
      const formData = new FormData();
      
      // ✅ JSON ডেটা 'data' ফিল্ডে
      formData.append('data', JSON.stringify(payload));
      
      // ✅ ইমেজ ফাইল 'files' ফিল্ডে (Postman এ 'file' ছিল, কিন্তু আপনার route এ 'files' আছে)
      imageFiles.forEach((file) => {
        formData.append('files', file);
      });

      // 🔍 ডিবাগ - FormData চেক করুন
      console.log('📤 FormData Debug:');
      for (let pair of formData.entries()) {
        console.log('  -', pair[0], ':', pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]);
      }
      
      // 5. API কল
      const result = await addProduct(formData).unwrap();
      console.log('✅ Success:', result);
      
      toast.success("Product created successfully! ✨");
      
      // 6. ফর্ম রিসেট এবং নেভিগেট
      // form.reset();
      // setImageFiles([]);
      // setImagePreviews([]);
      // navigate('/admin/products');

    } catch (error: any) {
      console.error('❌ API Error:', error);
      console.error('❌ Error Data:', error?.data);
      
      if (error?.data) {
        toast.error(error.data.message || "Failed to create product");
      } else {
        toast.error("Failed to create product");
      }
    } finally {
      isSubmitting.current = false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-2xl shadow-pink-500/5 rounded-3xl overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-pink-100/50 dark:border-zinc-800/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10">
                    <Sparkles className="w-6 h-6 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
                      Add New Product
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Fill in all the details about your beauty or jewelry product
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 px-3 py-1">
                  New
                </Badge>
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <Package className="w-4 h-4 text-pink-500" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Product Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Hydrating Rose Serum" 
                            {...field}
                            className="border-pink-200/50 focus-visible:ring-pink-400"
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
                            className="border-pink-200/50 focus-visible:ring-pink-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Category *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-pink-200/50 focus-visible:ring-pink-400">
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={4}
                          placeholder="Detailed product description..."
                          {...field}
                          className="border-pink-200/50 focus-visible:ring-pink-400 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="highlights"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Highlights</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={3}
                          placeholder="Key features and benefits..."
                          {...field}
                          className="border-pink-200/50 focus-visible:ring-pink-400 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warranty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Warranty</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. 1 Year, 6 Months" 
                          {...field}
                          className="border-pink-200/50 focus-visible:ring-pink-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <Image className="w-4 h-4 text-pink-500" />
                  Product Images
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                <p className="text-xs text-muted-foreground">Upload up to 5 images. First image will be the main image.</p>
              </div>

              {/* Variants */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-pink-500" />
                    Variants ({form.watch('variants')?.length || 0})
                  </h4>
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

                <AnimatePresence>
                  {form.watch('variants')?.map((variant, index) => (
                    <motion.div
                      key={variant.skuId || index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 border rounded-xl space-y-3 relative bg-pink-50/10"
                    >
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
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
                          <Label className="text-xs font-medium">Price (৳) *</Label>
                          <Input
                            type="number"
                            value={variant.price || 0}
                            onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                            className="text-sm h-9"
                            placeholder="Required"
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
                          <Label className="text-xs font-medium">Quantity *</Label>
                          <Input
                            type="number"
                            value={variant.quantity || 0}
                            onChange={(e) => updateVariant(index, 'quantity', parseInt(e.target.value) || 0)}
                            className="text-sm h-9"
                            placeholder="Required"
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
                    </motion.div>
                  ))}
                </AnimatePresence>

                {(!form.watch('variants') || form.watch('variants').length === 0) && (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                    <p className="text-sm">No variants added yet</p>
                    <p className="text-xs">Click "Add Variant" to add product options</p>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-pink-500" />
                  Status
                </h4>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-pink-200/50 focus-visible:ring-pink-400">
                            <SelectValue placeholder="Select status" />
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
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-pink-100/50">
                <Button 
                  type="submit" 
                  disabled={isLoading || isSubmitting.current}
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 rounded-xl px-8 py-6 text-sm font-semibold transition-all duration-300"
                >
                  {(isLoading || isSubmitting.current) ? (
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
                  className="rounded-xl px-8 py-6 border-pink-200/50 hover:bg-pink-50"
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