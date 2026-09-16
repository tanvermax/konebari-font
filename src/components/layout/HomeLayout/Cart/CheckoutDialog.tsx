// components/layout/Cart/CheckoutDialog.tsx
import {  useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ShoppingBag, User, MapPin, Phone, CreditCard, Truck } from "lucide-react";

import {  clearGuestCart } from "@/lib/guestStorage";
import { useSessionId } from "@/redux/hooks/useSessionId";
import { useCreateOrderMutation } from "@/redux/features/order/Order.api";

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  cartItems: any[];
  subtotal: number;
}

interface ICheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  paymentMethod: "COD" | "BKASH" | "NAGAD";
}

export default function CheckoutDialog({
  open,
  onClose,
  cartItems,
  subtotal,
}: CheckoutDialogProps) {
  const { isLoggedIn, userId } = useSessionId();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<ICheckoutForm>({
      defaultValues: {
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        note: "",
        paymentMethod: "COD",
      },
    });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = async (data: ICheckoutForm) => {
    try {
      const shipping = subtotal > 1000 ? 0 : 60;

      // ✅ Prepare payload
      const orderPayload = {
        // Customer info
        customer: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          note: data.note || "",
        },
        // Items (backend can also use cart directly)
        items: cartItems.map((i: any) => {
          const productId =
            typeof i.productId === "object" ? i.productId._id : i.productId;
          return {
            productId,
            variantId: i.variantId || null,
            quantity: i.quantity,
            price: i.priceSnapshot ?? i.price ?? 0,
            title: i.title || "",
            image: i.image || "",
          };
        }),
        subtotal,
        shipping,
        total: subtotal + shipping,
        paymentMethod: data.paymentMethod,
        // Guest info
        isGuest: !isLoggedIn,
        userId: userId || null,
      };

      console.log("📤 Creating order:", orderPayload);

      const res = await createOrder(orderPayload).unwrap();
      console.log("✅ Order created:", res);

      // ✅ Clear guest cart
      if (!isLoggedIn) clearGuestCart();

      toast.success("Order placed successfully! 🎉");

      // ✅ Navigate to thank you
      const orderId = res?.data?._id || res?.data?.orderId;
      onClose();
      window.location.href = `/thankyou?orderId=${orderId}`;
    } catch (error: any) {
      console.error("❌ Order error:", error);
      toast.error(error?.data?.message || "Failed to place order");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="w-5 h-5 text-rose-500" />
            Checkout
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* ✅ Guest notice */}
          {!isLoggedIn && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300">
              💡 আপনি Guest হিসেবে order করছেন। Login করে order করলে history save হবে।
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <User className="w-3 h-3 text-rose-500" /> Full Name *
            </Label>
            <Input
              {...register("name", { required: true })}
              placeholder="Your name"
              className="h-10"
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email *</Label>
              <Input
                type="email"
                {...register("email", { required: true })}
                placeholder="you@example.com"
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-rose-500" /> Phone *
              </Label>
              <Input
                {...register("phone", { required: true })}
                placeholder="01XXXXXXXXX"
                className="h-10"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-rose-500" /> Full Address *
            </Label>
            <Textarea
              {...register("address", { required: true })}
              placeholder="House, Road, Area..."
              rows={2}
            />
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">City *</Label>
            <Input
              {...register("city", { required: true })}
              placeholder="Dhaka"
              className="h-10"
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <CreditCard className="w-3 h-3 text-rose-500" /> Payment Method *
            </Label>
            <Select
              value={watch("paymentMethod")}
              onValueChange={(v) => setValue("paymentMethod", v as any)}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COD">💵 Cash on Delivery</SelectItem>
                <SelectItem value="BKASH">📱 bKash</SelectItem>
                <SelectItem value="NAGAD">📱 Nagad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Order Note (Optional)</Label>
            <Textarea {...register("note")} rows={2} placeholder="Any special instruction..." />
          </div>

          {/* Total */}
          <div className="bg-rose-50 dark:bg-rose-950/30 rounded-xl p-3 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subtotal</span>
              <span>৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Shipping</span>
              <span>{subtotal > 1000 ? "Free" : "৳60"}</span>
            </div>
            <div className="border-t border-rose-200/50 pt-2 flex justify-between font-semibold text-sm">
              <span>Total</span>
              <span className="text-rose-600">
                ৳{(subtotal + (subtotal > 1000 ? 0 : 60)).toLocaleString()}
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4 mr-2" />
                  Place Order
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}