"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { Plus, Trash2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import type { IProductVariant } from "@/redux/features/product/Product.types";

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading, isError } = usePricestockDetailsQuery(id);
  const [updateProduct, { isLoading: isSaving }] = useUpdateProductMutation();

  const [name, setName] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [category, setCategory] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [warranty, setWarranty] = useState("");
  const [description, setDescription] = useState("");
  const [highlights, setHighlights] = useState("");
  const [variants, setVariants] = useState<IProductVariant[]>([]);

  // populate the form once the product loads
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setNameBn(product.nameBn || "");
      setCategory(product.category || "");
      setMainImage(product.mainImage || "");
      setWarranty(product.warranty || "");
      setDescription(product.description || "");
      setHighlights(product.highlights || "");
      setVariants(product.variants?.length ? product.variants : []);
    }
  }, [product]);

  const updateVariant = (index: number, field: keyof IProductVariant, value: any) => {
    setVariants(prev =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const addVariant = () => {
    setVariants(prev => [
      ...prev,
      {
        skuId: `new-${Date.now()}`,
        combo: "",
        price: 0,
        specialPrice: undefined,
        quantity: 0,
        status: "active",
      } as IProductVariant,
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!id) return;
    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (variants.length === 0) {
      toast.error("At least one variant is required");
      return;
    }

    try {
      await updateProduct({
        id,
        updateData: {
          name,
          nameBn,
          category,
          mainImage,
          warranty,
          description,
          highlights,
          variants,
        },
      }).unwrap();
      toast.success("Product updated successfully");
      navigate(-1);
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-3xl space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto p-10 text-center text-red-500 font-bold">
        Product not found
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Edit Product</h1>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name (English) *</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameBn">Product Name (Bengali)</Label>
            <Input id="nameBn" value={nameBn} onChange={e => setNameBn(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={category} onChange={e => setCategory(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warranty">Warranty</Label>
              <Input id="warranty" value={warranty} onChange={e => setWarranty(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mainImage">Main Image URL</Label>
            <Input id="mainImage" value={mainImage} onChange={e => setMainImage(e.target.value)} />
            {mainImage && (
              <img
                src={mainImage}
                alt="Preview"
                className="mt-2 h-32 w-32 object-cover rounded-lg border"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="highlights">Highlights</Label>
            <Textarea
              id="highlights"
              rows={3}
              value={highlights}
              onChange={e => setHighlights(e.target.value)}
              placeholder="Short bullet-style highlights (HTML allowed)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Full product description (HTML allowed)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Variants */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Variants ({variants.length})</CardTitle>
          <Button size="sm" variant="outline" onClick={addVariant}>
            <Plus className="h-4 w-4 mr-1" /> Add Variant
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {variants.length === 0 && (
            <p className="text-sm text-muted-foreground">কোনো variant নেই — অন্তত একটা যোগ করো।</p>
          )}
          {variants.map((variant, index) => (
            <div key={variant.skuId} className="border rounded-xl p-4 space-y-3 relative">
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 text-red-500"
                onClick={() => removeVariant(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Combo / Variant name</Label>
                  <Input
                    value={variant.combo || ""}
                    onChange={e => updateVariant(index, "combo", e.target.value)}
                    placeholder="e.g. Black, Silver"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Status</Label>
                  <Select
                    value={variant.status}
                    onValueChange={val => updateVariant(index, "status", val)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Price (৳)</Label>
                  <Input
                    type="number"
                    value={variant.price}
                    onChange={e => updateVariant(index, "price", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Special Price (৳)</Label>
                  <Input
                    type="number"
                    value={variant.specialPrice ?? ""}
                    onChange={e =>
                      updateVariant(
                        index,
                        "specialPrice",
                        e.target.value === "" ? undefined : parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Quantity</Label>
                  <Input
                    type="number"
                    value={variant.quantity}
                    onChange={e => updateVariant(index, "quantity", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Variant Image URL</Label>
                <Input
                  value={variant.image || ""}
                  onChange={e => updateVariant(index, "image", e.target.value)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate(-1)} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}