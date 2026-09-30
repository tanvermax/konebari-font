// components/layout/Cart/CheckoutDialog.tsx
import { useEffect } from "react";
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
import {
  Loader2,
  ShoppingBag,
  User,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  ShieldCheck,
} from "lucide-react";

import { clearGuestCart } from "@/lib/guestStorage";
import { useSessionId } from "@/redux/hooks/useSessionId";
import {
  useCreateOrderMutation,
  useInitiatePaymentMutation,
} from "@/redux/features/order/Order.api";

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
  paymentMethod: "COD" | "SSLCOMMERZ";
}

export default function CheckoutDialog({
  open,
  onClose,
  cartItems,
  subtotal,
}: CheckoutDialogProps) {
  const { isLoggedIn, userId } = useSessionId();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [initiatePayment, { isLoading: isPaymentLoading }] =
    useInitiatePaymentMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ICheckoutForm>({
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

  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  // ============================================
  // ✅ SUBMIT HANDLER
  // ============================================
  const onSubmit = async (data: ICheckoutForm) => {
    try {
      const shipping = subtotal > 1000 ? 0 : 60;
      const totalPrice = subtotal + shipping;

      // ✅ Order payload
      const orderPayload = {
        customer: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          note: data.note || "",
        },
        items: cartItems.map((i: any) => {
          const productId =
            typeof i.productId === "object" ? i.productId._id : i.productId;
          return {
            productId,
            variantId: i.variantId || null,
            quantity: i.quantity,
            price: i.priceSnapshot ?? i.price ?? 0,
            title: i.title || "",
            image: i.image || i.images?.[0] || "",
          };
        }),
        subtotal,
        shipping,
        total: totalPrice,
        totalPrice,
        grandTotal: totalPrice,
        paymentMethod: data.paymentMethod,
        isGuest: !isLoggedIn,
        userId: userId || null,
      };

      console.log("📦 Creating order:", orderPayload);

      // ✅ STEP 1: Create Order
      const res = await createOrder(orderPayload).unwrap();
      const orderId = res?.data?._id;

      if (!orderId) {
        throw new Error("Order creation failed: no order ID");
      }

      console.log("✅ Order created:", orderId);

      // ✅ STEP 2: Handle Payment
      if (data.paymentMethod === "SSLCOMMERZ") {
        // Online payment
        try {
          const payRes = await initiatePayment({ orderId }).unwrap();
          const gatewayUrl = payRes?.data?.GatewayPageURL;

          if (!gatewayUrl) {
            throw new Error("Payment initiation failed");
          }

          console.log("🚀 Redirecting to SSLCommerz:", gatewayUrl);

          // Clear guest cart BEFORE redirect
          if (!isLoggedIn) clearGuestCart();

          // ✅ Redirect to SSLCommerz payment page
          window.location.href = gatewayUrl;
          return;
        } catch (paymentError: any) {
          console.error("❌ Payment init failed:", paymentError);
          toast.error(
            paymentError?.data?.message ||
              "Payment failed. Please try again."
          );
          return;
        }
      }

      // ✅ STEP 3: COD - Clear cart & redirect
      if (!isLoggedIn) clearGuestCart();

      toast.success("Order placed successfully! 🎉");
      onClose();

      window.location.href = `/thankyou?orderId=${orderId}`;
    } catch (error: any) {
      console.error("❌ Order error:", error);
      toast.error(
        error?.data?.message || error?.message || "Failed to place order"
      );
    }
  };

  // ✅ Loading state
  const isProcessing = isLoading || isPaymentLoading;

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
          {/* Guest notice */}
          {!isLoggedIn && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300">
              💡 আপনি Guest হিসেবে order করছেন। Login করে order করলে history
              save হবে।
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <User className="w-3 h-3 text-rose-500" /> Full Name *
            </Label>
            <Input
              {...register("name", { required: "Name is required" })}
              placeholder="Your name"
              className="h-10"
            />
            {errors.name && (
              <p className="text-[10px] text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email *</Label>
              <Input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="you@example.com"
                className="h-10"
              />
              {errors.email && (
                <p className="text-[10px] text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-rose-500" /> Phone *
              </Label>
              <Input
                {...register("phone", { required: "Phone is required" })}
                placeholder="01XXXXXXXXX"
                className="h-10"
              />
              {errors.phone && (
                <p className="text-[10px] text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-rose-500" /> Full Address *
            </Label>
            <Textarea
              {...register("address", { required: "Address is required" })}
              placeholder="House, Road, Area..."
              rows={2}
            />
            {errors.address && (
              <p className="text-[10px] text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">City *</Label>
            <Input
              {...register("city", { required: "City is required" })}
              placeholder="Dhaka"
              className="h-10"
            />
            {errors.city && (
              <p className="text-[10px] text-red-500">{errors.city.message}</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <CreditCard className="w-3 h-3 text-rose-500" /> Payment Method *
            </Label>
            <Select
              value={paymentMethod}
              onValueChange={(v) => setValue("paymentMethod", v as any)}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COD">💵 Cash on Delivery</SelectItem>
                <SelectItem value="SSLCOMMERZ">
                  💳 Online Payment (bKash/Nagad/Card)
                </SelectItem>
              </SelectContent>
            </Select>

            {/* SSLCommerz info */}
            {paymentMethod === "SSLCOMMERZ" && (
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 rounded-xl p-3 text-xs text-blue-800 dark:text-blue-300 mt-2 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Secure Payment</p>
                  <p className="mt-0.5">
                    You'll be redirected to SSLCommerz to pay securely via
                    bKash, Nagad, Rocket, or Card.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Order Note (Optional)
            </Label>
            <Textarea
              {...register("note")}
              rows={2}
              placeholder="Any special instruction..."
            />
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

          {/* Submit */}
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
                  {paymentMethod === "SSLCOMMERZ"
                    ? "Redirecting..."
                    : "Placing Order..."}
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4 mr-2" />
                  {paymentMethod === "SSLCOMMERZ" ? "Pay Now" : "Place Order"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}