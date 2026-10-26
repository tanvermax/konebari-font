// components/layout/Cart/CheckoutDialog.tsx
import { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  ShoppingBag,
  User,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Coins,
} from "lucide-react";

import { clearGuestCart } from "@/lib/guestStorage";
import { useSessionId } from "@/redux/hooks/useSessionId";
import {
  useCreateOrderMutation,
  useInitiatePaymentMutation,
} from "@/redux/features/order/Order.api";
// ✅ Coin API Import
import { useGetMyCoinsQuery } from "@/redux/features/coin/coin.api";

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  cartItems: any[];
  subtotal: number;
}

type DeliveryLocation = "INSIDE_DHAKA" | "OUTSIDE_DHAKA";

interface ICheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  paymentMethod: "COD" | "SSLCOMMERZ";
  deliveryLocation: DeliveryLocation;
}

// ✅ Coin Configuration
const REDEEM_RATE = 10;      // 10 coin = ৳1
const MIN_REDEEM_COINS = 100; // minimum 100 coin = ৳10

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

  // ============================================
  // ✅ Coin Balance Fetch
  // ============================================
  const { data: coinData } = useGetMyCoinsQuery(
    { limit: 1 },
    { skip: !isLoggedIn || !open }
  );

  const coinBalance = coinData?.balance || 0;

  // ============================================
  // ✅ Coin State
  // ============================================
  const [useCoins, setUseCoins] = useState(false);
  const [coinsToUse, setCoinsToUse] = useState(0);

  // ============================================
  // ✅ Payment Eligibility
  // ============================================
  let canUseCOD = true;
  let canUseOnline = true;

  cartItems.forEach((item: any) => {
    const product =
      typeof item.productId === "object" ? item.productId : null;
    const allowCOD =
      item.allowCashOnDelivery ?? product?.allowCashOnDelivery ?? true;
    const allowOnline =
      item.allowOnlinePayment ?? product?.allowOnlinePayment ?? true;

    if (allowCOD === false) canUseCOD = false;
    if (allowOnline === false) canUseOnline = false;
  });

  const defaultPaymentMethod: "COD" | "SSLCOMMERZ" = canUseCOD
    ? "COD"
    : "SSLCOMMERZ";

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
      paymentMethod: defaultPaymentMethod,
      deliveryLocation: "INSIDE_DHAKA",
    },
  });

  const paymentMethod = watch("paymentMethod");
  const deliveryLocation = watch("deliveryLocation");

  const shipping = deliveryLocation === "INSIDE_DHAKA" ? 60 : 120;
  const baseTotal = subtotal + shipping;

  // ============================================
  // ✅ Coin Calculation
  // ============================================
  // Max coin use korte parbe = min(balance, total * rate)
  const maxUsableCoins = Math.min(
    coinBalance,
    Math.floor(baseTotal * REDEEM_RATE)
  );

  // Aplicable coin discount = coinsToUse / 10
  const coinDiscount = useCoins ? coinsToUse / REDEEM_RATE : 0;
  const finalTotal = Math.max(0, baseTotal - coinDiscount);

  // ============================================
  // ✅ Coin Toggle Handler
  // ============================================
  const handleCoinToggle = (checked: boolean) => {
    setUseCoins(checked);
    if (checked) {
      // Default: max usable coin set korbo
      setCoinsToUse(maxUsableCoins);
    } else {
      setCoinsToUse(0);
    }
  };

  // ============================================
  // ✅ Reset & Payment Method Adjust
  // ============================================
  useEffect(() => {
    if (!open) {
      reset();
      setUseCoins(false);
      setCoinsToUse(0);
      return;
    }

    if (!canUseCOD && canUseOnline) {
      setValue("paymentMethod", "SSLCOMMERZ", { shouldValidate: true });
    } else if (!canUseOnline && canUseCOD) {
      setValue("paymentMethod", "COD", { shouldValidate: true });
    }
  }, [open, canUseCOD, canUseOnline, setValue, reset]);

  // ✅ Coin balance update hole coinsToUse recalculate
  useEffect(() => {
    if (useCoins && coinBalance > 0) {
      setCoinsToUse(Math.min(coinsToUse, maxUsableCoins));
    }
  }, [coinBalance, useCoins, maxUsableCoins]);

  // ============================================
  // ✅ Submit Handler
  // ============================================
  const onSubmit = async (data: ICheckoutForm) => {
    try {
      if (data.paymentMethod === "COD" && !canUseCOD) {
        toast.error("Cash on Delivery is not available for items in your cart.");
        return;
      }
      if (data.paymentMethod === "SSLCOMMERZ" && !canUseOnline) {
        toast.error("Online payment is not available for items in your cart.");
        return;
      }

      // ✅ Final coin value (only if valid)
      const finalCoinsUsed =
        useCoins && coinsToUse >= MIN_REDEEM_COINS ? coinsToUse : 0;

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
        deliveryLocation: data.deliveryLocation,
        total: finalTotal,
        totalPrice: finalTotal,
        grandTotal: finalTotal,

        // ✅ Coin fields
        coinsUsed: finalCoinsUsed,
        coinDiscount: finalCoinsUsed / REDEEM_RATE,

        paymentMethod: data.paymentMethod,
        isGuest: !isLoggedIn,
        userId: userId || null,
      };

      console.log("📦 Order payload with coins:", orderPayload);

      const res = await createOrder(orderPayload).unwrap();
      const orderId = res?.data?._id;
      if (!orderId) throw new Error("Order creation failed");

      // SSLCommerz
      if (data.paymentMethod === "SSLCOMMERZ") {
        const payRes = await initiatePayment({ orderId }).unwrap();
        const gatewayUrl = payRes?.data?.GatewayPageURL;
        if (!gatewayUrl) throw new Error("Payment initiation failed");

        if (!isLoggedIn) clearGuestCart();
        window.location.href = gatewayUrl;
        return;
      }

      // COD success
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

          {/* Delivery Location */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Truck className="w-3 h-3 text-rose-500" /> Delivery Location *
            </Label>
            <Select
              value={deliveryLocation}
              onValueChange={(v) =>
                setValue("deliveryLocation", v as DeliveryLocation)
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INSIDE_DHAKA">
                  🏙️ Inside Dhaka — ৳60
                </SelectItem>
                <SelectItem value="OUTSIDE_DHAKA">
                  🚚 Outside Dhaka — ৳120
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <CreditCard className="w-3 h-3 text-rose-500" /> Payment Method *
            </Label>

            {(canUseCOD && !canUseOnline) || (!canUseCOD && canUseOnline) ? (
              <div className="space-y-2">
                {canUseCOD && !canUseOnline && (
                  <div className="flex items-center gap-3 p-3 border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
                    <Truck className="w-5 h-5 text-emerald-600" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-emerald-700">
                        Cash on Delivery
                      </p>
                      <p className="text-[10px] text-emerald-600/70">
                        Pay when you receive
                      </p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                )}

                {!canUseCOD && canUseOnline && (
                  <div className="flex items-center gap-3 p-3 border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-700">
                        Online Payment
                      </p>
                      <p className="text-[10px] text-blue-600/70">
                        bKash / Nagad / Card
                      </p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </div>
                )}

                {!canUseCOD && (
                  <p className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Advance payment required for items in your cart.
                  </p>
                )}
              </div>
            ) : (
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
            )}

            {paymentMethod === "SSLCOMMERZ" && canUseOnline && (
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 rounded-xl p-3 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Secure Payment</p>
                  <p className="mt-0.5">
                    You'll be redirected to SSLCommerz.
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

          {/* ============================================
              ✅ COIN REDEMPTION SECTION
             ============================================ */}
          {isLoggedIn && coinBalance >= MIN_REDEEM_COINS && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20">
                    <Coins className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                      Use My Coins
                    </p>
                    <p className="text-[10px] text-amber-600/80">
                      Balance: {coinBalance} coins (max ৳
                      {Math.floor(coinBalance / REDEEM_RATE)} discount)
                    </p>
                  </div>
                </div>
                <Checkbox
                  checked={useCoins}
                  onCheckedChange={handleCoinToggle}
                  className="border-amber-500 data-[state=checked]:bg-amber-500"
                />
              </div>

              {useCoins && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-medium text-amber-700">
                    <span>{MIN_REDEEM_COINS} coin min</span>
                    <span className="font-bold text-amber-900 dark:text-amber-300">
                      -৳{coinDiscount.toFixed(0)} off
                    </span>
                    <span>{maxUsableCoins} coin max</span>
                  </div>

                  <input
                    type="range"
                    min={MIN_REDEEM_COINS}
                    max={maxUsableCoins}
                    step={10}
                    value={coinsToUse}
                    onChange={(e) => setCoinsToUse(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />

                  <div className="flex items-center justify-between bg-white/60 dark:bg-black/20 rounded-lg px-2.5 py-1.5">
                    <span className="text-[10px] text-amber-700">
                      Coins to use:
                    </span>
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                      {coinsToUse} coins = ৳{coinDiscount.toFixed(0)} off
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================
              ✅ TOTAL SECTION
             ============================================ */}
          <div className="bg-rose-50 dark:bg-rose-950/30 rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Shipping (
                {deliveryLocation === "INSIDE_DHAKA"
                  ? "Inside Dhaka"
                  : "Outside Dhaka"}
                )
              </span>
              <span>৳{shipping}</span>
            </div>

            {/* Coin discount row */}
            {useCoins && coinsToUse >= MIN_REDEEM_COINS && (
              <div className="flex justify-between text-xs text-amber-600 font-semibold">
                <span className="flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  Coin Discount ({coinsToUse} coins)
                </span>
                <span>-৳{coinDiscount.toFixed(0)}</span>
              </div>
            )}

            <div className="border-t border-rose-200/50 pt-2 flex justify-between font-semibold text-sm">
              <span>Total</span>
              <span className="text-rose-600">৳{finalTotal.toFixed(0)}</span>
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