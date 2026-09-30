// components/layout/OrderSuccess/OrderSuccessPage.tsx
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Package,
  Truck,
  ShoppingBag,
  MapPin,
  CreditCard,
  Phone,
  Clock,
  Sparkles,
  Copy,
  Check,
  Home,
  Headphones,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrderByIdQuery } from "@/redux/features/order/Order.api";
import { toast } from "sonner";

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const paymentStatus = searchParams.get("payment"); // "success" | "failed" | "cancelled" | null
  const [copied, setCopied] = useState(false);

  // ✅ Fetch order
  const {
    data: orderData,
    isLoading,
    
  } = useGetOrderByIdQuery(orderId || "", {
    skip: !orderId,
    // Poll until payment status updates (SSLCommerz IPN delay)
    pollingInterval: paymentStatus === "success" ? 3000 : 0,
  });

  const order = orderData?.data || orderData;

  // ✅ Show toast based on payment status
  useEffect(() => {
    if (paymentStatus === "success") {
      toast.success("Payment successful! 🎉");
    } else if (paymentStatus === "failed") {
      toast.error("Payment failed. Please try again.");
    } else if (paymentStatus === "cancelled") {
      toast.warning("Payment cancelled.");
    }
  }, [paymentStatus]);

  // ✅ Copy order ID
  const handleCopy = () => {
    if (!order?.trackingId && !orderId) return;
    const id = order?.trackingId || order?._id || orderId || "";
    navigator.clipboard.writeText(id);
    setCopied(true);
    toast.success("Order ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ No order ID
  if (!orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50/30 via-white to-purple-50/30 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-0 shadow-2xl rounded-3xl">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
              <Package className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold">No Order Found</h2>
            <p className="text-sm text-muted-foreground">
              We couldn't find your order. Please check your order confirmation.
            </p>
            <Link to="/shop">
              <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50/30 via-white to-purple-50/30 flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full border-0 shadow-2xl rounded-3xl">
          <Skeleton className="h-40 w-full rounded-t-3xl" />
          <CardContent className="p-8 space-y-4">
            <Skeleton className="h-6 w-2/3 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <div className="grid grid-cols-2 gap-4 pt-6">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ Order values
  const displayOrderId = order?.trackingId || order?._id || orderId || "N/A";

  const estimatedDelivery =
    order?.estimatedDelivery ||
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
      "en-GB",
      { day: "numeric", month: "short", year: "numeric" }
    );

  const total = order?.totalPrice || order?.total || 0;
  const subtotal = order?.subtotal || order?.subTotal || 0;
  const shipping = order?.shippingFee || order?.shipping || 0;
  const items = order?.orderedItems || order?.items || [];
  const customer = order?.customer || {};
  const paymentMethod = order?.paymentMethod || "COD";
  const orderPaymentStatus = order?.paymentStatus || "Pending";

  // ✅ Payment method label
  const paymentLabel =
    paymentMethod === "COD"
      ? "Cash on Delivery"
      : paymentMethod === "SSLCOMMERZ"
      ? "Online Payment"
      : paymentMethod;

  // ✅ Determine UI state based on payment status
  const isPaymentSuccess = paymentStatus === "success" || orderPaymentStatus === "Paid";
  const isPaymentFailed = paymentStatus === "failed";
  const isPaymentCancelled = paymentStatus === "cancelled";
  const isCOD = paymentMethod === "COD";

  // ✅ Header config
  const headerConfig = (() => {
    if (isPaymentFailed) {
      return {
        gradient: "from-red-500 via-rose-500 to-pink-500",
        icon: <XCircle className="h-14 w-14 text-white" />,
        title: "Payment Failed ❌",
        subtitle: "Your payment could not be completed. Please try again.",
      };
    }
    if (isPaymentCancelled) {
      return {
        gradient: "from-amber-500 via-orange-500 to-red-500",
        icon: <XCircle className="h-14 w-14 text-white" />,
        title: "Payment Cancelled",
        subtitle: "You cancelled the payment. Your order is still pending.",
      };
    }
    if (isCOD) {
      return {
        gradient: "from-rose-500 via-pink-500 to-purple-500",
        icon: <CheckCircle2 className="h-14 w-14 text-white" />,
        title: `Thank You${customer.name ? `, ${customer.name.split(" ")[0]}` : ""}! 🎉`,
        subtitle: "Your order has been confirmed and is being prepared with love.",
      };
    }
    return {
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      icon: <CheckCircle2 className="h-14 w-14 text-white" />,
      title: `Payment Successful! 🎉`,
      subtitle: "Thank you for your payment. Your order is confirmed.",
    };
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/40 via-white to-purple-50/40 py-8 md:py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="overflow-hidden rounded-3xl border-0 shadow-2xl shadow-rose-500/10">

            {/* ✅ Success/Error Header */}
            <div
              className={`relative bg-gradient-to-br ${headerConfig.gradient} p-8 md:p-10 text-center text-white overflow-hidden`}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />

              <div className="relative z-10">
                {/* Animated icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  className="flex justify-center mb-5"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse" />
                    <div className="relative bg-white/20 backdrop-blur-sm p-4 rounded-full border border-white/30">
                      {headerConfig.icon}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    {headerConfig.title}
                  </h1>
                  <p className="text-white/90 text-sm md:text-base max-w-md mx-auto">
                    {headerConfig.subtitle}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* ✅ Order Details */}
            <CardContent className="p-6 md:p-8 space-y-6">

              {/* Payment Status Banner */}
              {!isCOD && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className={`rounded-2xl p-4 border-2 ${
                    isPaymentSuccess
                      ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40"
                      : isPaymentFailed
                      ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40"
                      : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isPaymentSuccess ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    ) : isPaymentFailed ? (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    ) : (
                      <Clock className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p
                        className={`text-sm font-bold ${
                          isPaymentSuccess
                            ? "text-emerald-700 dark:text-emerald-400"
                            : isPaymentFailed
                            ? "text-red-700 dark:text-red-400"
                            : "text-amber-700 dark:text-amber-400"
                        }`}
                      >
                        {isPaymentSuccess
                          ? "Payment Verified ✅"
                          : isPaymentFailed
                          ? "Payment Failed ❌"
                          : "Payment Processing..."}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isPaymentSuccess
                          ? "Your payment has been successfully processed."
                          : isPaymentFailed
                          ? "Your payment was not completed. Please try again or contact support."
                          : "Verifying your payment. This may take a moment..."}
                      </p>
                    </div>
                    {!isPaymentSuccess && !isPaymentFailed && (
                      <Loader2 className="w-5 h-5 animate-spin text-amber-600 flex-shrink-0" />
                    )}
                  </div>
                </motion.div>
              )}

              {/* Order ID Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl p-5"
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-rose-500 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      Order Number
                    </p>
                    <p className="text-lg md:text-xl font-bold text-foreground font-mono">
                      #{displayOrderId}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="rounded-xl border-rose-200 hover:bg-rose-50 gap-1.5 text-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy ID
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>

              {/* Delivery + Payment Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {/* Estimated Delivery */}
                <div className="flex items-start gap-3 p-4 bg-stone-50 dark:bg-stone-900/40 rounded-2xl border border-border/40">
                  <div className="p-2 rounded-xl bg-rose-500/10 flex-shrink-0">
                    <Truck className="h-5 w-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Estimated Delivery
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {estimatedDelivery}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      We'll message you soon
                    </p>
                  </div>
                </div>

                {/* Payment */}
                <div className="flex items-start gap-3 p-4 bg-stone-50 dark:bg-stone-900/40 rounded-2xl border border-border/40">
                  <div className="p-2 rounded-xl bg-emerald-500/10 flex-shrink-0">
                    <CreditCard className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Payment Method
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {paymentLabel}
                    </p>
                    <Badge
                      variant="outline"
                      className={`mt-1 text-[9px] ${
                        orderPaymentStatus === "Paid"
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 border-emerald-200"
                          : orderPaymentStatus === "Failed"
                          ? "bg-red-50 dark:bg-red-950/30 text-red-700 border-red-200"
                          : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 border-amber-200"
                      }`}
                    >
                      {orderPaymentStatus}
                    </Badge>
                  </div>
                </div>
              </motion.div>

              {/* Order Items */}
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-3"
                >
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Package className="w-4 h-4 text-rose-500" />
                    Order Items ({items.length})
                  </h3>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-900/40 rounded-xl border border-border/40"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-800 flex-shrink-0">
                          <img
                            src={
                              item.productImage ||
                              item.image ||
                              item.images?.[0] ||
                              "https://via.placeholder.com/100"
                            }
                            alt={item.productName || item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium truncate">
                            {item.productName || item.title || "Product"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Qty: {item.quantity} × ৳
                            {(item.price || 0).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-rose-600 flex-shrink-0">
                          ৳
                          {(
                            (item.price || 0) * (item.quantity || 1)
                          ).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Order Total */}
              {total > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl p-5 space-y-2"
                >
                  {subtotal > 0 && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Subtotal</span>
                      <span>৳{subtotal.toLocaleString()}</span>
                    </div>
                  )}
                  {shipping > 0 && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Shipping</span>
                      <span>৳{shipping.toLocaleString()}</span>
                    </div>
                  )}
                  {shipping === 0 && subtotal > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-emerald-600 font-medium">Free</span>
                    </div>
                  )}
                  <div className="border-t border-rose-200/60 dark:border-rose-900/40 pt-2 flex justify-between items-center">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="text-xl font-bold text-rose-600">
                      ৳{total.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Customer Address */}
              {customer.address && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 }}
                  className="flex items-start gap-3 p-4 bg-stone-50 dark:bg-stone-900/40 rounded-2xl border border-border/40"
                >
                  <div className="p-2 rounded-xl bg-blue-500/10 flex-shrink-0">
                    <MapPin className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">
                      Delivery Address
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {customer.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {customer.address}
                      {customer.city && `, ${customer.city}`}
                    </p>
                    {customer.phone && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Support Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-100 dark:border-amber-900/40 rounded-2xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 flex-shrink-0">
                    <Headphones className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 mb-0.5">
                      Need help with your order?
                    </p>
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                      Our support team is here 24/7. Reach us at{" "}
                      <a
                        href="tel:+8801674986600"
                        className="font-bold underline decoration-dotted"
                      >
                        +880 1674-986600
                      </a>
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 py-2">
                <div className="text-center space-y-1">
                  <ShieldCheck className="w-4 h-4 mx-auto text-emerald-500" />
                  <p className="text-[10px] text-muted-foreground">
                    100% Authentic
                  </p>
                </div>
                <div className="text-center space-y-1">
                  <Truck className="w-4 h-4 mx-auto text-rose-500" />
                  <p className="text-[10px] text-muted-foreground">
                    Fast Delivery
                  </p>
                </div>
                <div className="text-center space-y-1">
                  <Clock className="w-4 h-4 mx-auto text-blue-500" />
                  <p className="text-[10px] text-muted-foreground">
                    24/7 Support
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row gap-3 pt-2"
              >
                <Link to="/ordertrack" className="flex-1">
                  <Button className="w-full h-11 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-lg shadow-rose-500/25 gap-2">
                    <Truck className="h-4 w-4" />
                    Track My Order
                  </Button>
                </Link>
                <Link to="/shop" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-xl border-rose-200/60 hover:bg-rose-50 gap-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </motion.div>

              {/* Home link */}
              <div className="text-center pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-rose-500 transition-colors"
                >
                  <Home className="w-3 h-3" />
                  Back to Home
                </Link>
              </div>
            </CardContent>

            {/* Footer */}
            <div className="border-t border-border/40 p-4 bg-gradient-to-r from-rose-50/50 to-pink-50/50 dark:from-rose-950/10 dark:to-pink-950/10 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3 text-rose-500" />
                Konebari — Beauty Redefined
                <Sparkles className="w-3 h-3 text-rose-500" />
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center text-[11px] text-muted-foreground mt-6"
        >
          A confirmation email has been sent to your registered email address.
        </motion.p>
      </div>
    </div>
  );
}