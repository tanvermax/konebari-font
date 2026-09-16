// components/layout/Cart/CartPage.tsx
"use client";
import { useState } from "react";
import { Link } from "react-router";
import { ShoppingBag, ArrowLeft, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import CheckoutDialog from "./CheckoutDialog";
import { useCartActions } from "@/redux/hooks/useCartActions";

export default function CartPage() {
  const { cart, isLoading, removeItem, updateQuantity, clearCart } = useCartActions();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  const cartItems = cart.items || [];
  const totalItems = cart.totalItems || 0;
  const subtotal = cart.subtotal || 0;

  const handleUpdate = async (
    productId: string,
    variantId: string | null,
    qty: number
  ) => {
    setUpdatingIds((prev) => new Set(prev).add(productId));
    try {
      await updateQuantity(productId, variantId, qty);
    } finally {
      setUpdatingIds((prev) => {
        const s = new Set(prev);
        s.delete(productId);
        return s;
      });
    }
  };

  const handleRemove = async (productId: string, variantId: string | null) => {
    if (!window.confirm("Remove this item?")) return;
    await removeItem(productId, variantId);
  };

  const handleClear = async () => {
    if (!window.confirm("Clear entire cart?")) return;
    await clearCart();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-950/30 dark:to-pink-950/30 flex items-center justify-center mb-5">
          <ShoppingBag className="w-10 h-10 text-rose-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Explore our collection and add your favorites!
        </p>
        <Link to="/shop">
          <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white">
            <Sparkles className="w-4 h-4 mr-2" />
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/shop"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Shopping Cart</h1>
            <p className="text-xs text-muted-foreground">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={handleClear}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1.5 text-xs"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-border/40">
            <CardContent className="p-4 sm:p-5">
              {cartItems.map((item: any, idx: number) => {
                const productId =
                  typeof item.productId === "object"
                    ? item.productId._id
                    : item.productId;

                return (
                  <CartItem
                    key={`${productId}-${item.variantId || "default"}-${idx}`}
                    item={item}
                    onUpdateQuantity={handleUpdate}
                    onRemove={handleRemove}
                    isUpdating={updatingIds.has(productId)}
                  />
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <CartSummary
            subtotal={subtotal}
            totalItems={totalItems}
            onCheckout={() => setCheckoutOpen(true)}
            disabled={cartItems.length === 0}
          />
        </div>
      </div>

      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        subtotal={subtotal}
      />
    </div>
  );
}