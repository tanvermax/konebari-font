// components/layout/Cart/CartSummary.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";

interface CartSummaryProps {
  subtotal: number;
  totalItems: number;
  onCheckout: () => void;
  disabled?: boolean;
}

export default function CartSummary({
  subtotal,
  totalItems,
  onCheckout,
  disabled,
}: CartSummaryProps) {
  const shipping = subtotal > 1000 ? 0 : 60;
  const total = subtotal + shipping;

  return (
    <Card className="border-border/40 shadow-sm sticky top-6">
      <CardContent className="p-5 sm:p-6 space-y-4">
        <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-rose-500" />
          Order Summary
        </h2>

        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Subtotal ({totalItems} items)
            </span>
            <span className="font-medium">৳{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? (
                <span className="text-emerald-600">Free</span>
              ) : (
                `৳${shipping}`
              )}
            </span>
          </div>

          {shipping > 0 && (
            <p className="text-[11px] text-muted-foreground bg-rose-50 dark:bg-rose-950/30 p-2 rounded-lg">
              💡 Add ৳{(1000 - subtotal).toLocaleString()} more for free shipping
            </p>
          )}

          <div className="border-t border-border/40 pt-3 flex justify-between text-base font-semibold">
            <span>Total</span>
            <span className="text-rose-600">৳{total.toLocaleString()}</span>
          </div>
        </div>

        <Button
          onClick={onCheckout}
          disabled={disabled || totalItems === 0}
          className="w-full h-11 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-md"
        >
          Proceed to Checkout
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground justify-center pt-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Secure checkout • 100% Authentic</span>
        </div>
      </CardContent>
    </Card>
  );
}