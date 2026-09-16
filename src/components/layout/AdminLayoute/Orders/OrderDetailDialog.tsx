// components/layout/AdminLayoute/Orders/OrderDetailDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  Copy,
  Check,
  Printer,
  Truck,
  CreditCard,
  Calendar,
  Sparkles,
  UserCheck,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface OrderDetailDialogProps {
  order: any;
  open: boolean;
  onClose: () => void;
}

const getStatusStyle = (status: string) => {
  const styles: any = {
    Pending: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40",
    Paid: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/40",
    Shipped: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/40",
    Completed: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40",
    Cancelled: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/40",
  };
  return styles[status] || "bg-gray-100 text-gray-700";
};

const getPaymentStyle = (status: string) => {
  const styles: any = {
    Pending: "bg-amber-100 text-amber-700",
    Success: "bg-emerald-100 text-emerald-700",
    Failed: "bg-red-100 text-red-700",
  };
  return styles[status] || "bg-gray-100 text-gray-700";
};

export default function OrderDetailDialog({
  order,
  open,
  onClose,
}: OrderDetailDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const customer = order.customer || order.shippingAddress || {};
  const items = order.orderedItems || order.items || [];
  const isGuest = order.isGuest ?? !order.userId;

  const handleCopy = () => {
    navigator.clipboard.writeText(order.trackingId || order._id);
    setCopied(true);
    toast.success("Order ID copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border/40 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Package className="w-5 h-5 text-rose-500" />
                Order Details
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">
                  Order ID:
                </span>
                <span className="text-sm font-mono font-semibold">
                  #{order.trackingId || order._id?.slice(-8)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="h-6 w-6"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Badge className={`${getStatusStyle(order.status)} border`}>
                {order.status}
              </Badge>
              <Badge className={`${getPaymentStyle(order.paymentStatus)} border-0`}>
                💰 {order.paymentStatus}
              </Badge>
              {isGuest ? (
                <Badge variant="outline" className="border-amber-300 text-amber-700 gap-1">
                  <UserX className="w-3 h-3" />
                  Guest
                </Badge>
              ) : (
                <Badge variant="outline" className="border-emerald-300 text-emerald-700 gap-1">
                  <UserCheck className="w-3 h-3" />
                  Registered
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Order Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-stone-50 dark:bg-stone-900/40 rounded-xl p-3 border border-border/40">
              <p className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Date
              </p>
              <p className="text-xs font-medium mt-1">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div className="bg-stone-50 dark:bg-stone-900/40 rounded-xl p-3 border border-border/40">
              <p className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                <Truck className="w-3 h-3" />
                Courier
              </p>
              <p className="text-xs font-medium mt-1">
                {order.courierName || "Not assigned"}
              </p>
            </div>

            <div className="bg-stone-50 dark:bg-stone-900/40 rounded-xl p-3 border border-border/40">
              <p className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                Payment
              </p>
              <p className="text-xs font-medium mt-1">
                {order.paymentMethod || "COD"}
              </p>
            </div>

            <div className="bg-stone-50 dark:bg-stone-900/40 rounded-xl p-3 border border-border/40">
              <p className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Total
              </p>
              <p className="text-xs font-bold text-rose-600 mt-1">
                ৳{(order.totalPrice || order.grandTotal || 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/40">
            <h3 className="text-xs font-bold uppercase text-blue-600 mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Name</p>
                <p className="font-medium">{customer.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone
                </p>
                <p className="font-medium">{customer.phone || "N/A"}</p>
              </div>
              {customer.email && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              )}
              {customer.city && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">City</p>
                  <p className="font-medium">{customer.city}</p>
                </div>
              )}
            </div>
            {customer.address && (
              <div className="mt-3">
                <p className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Address
                </p>
                <p className="text-sm mt-1">{customer.address}</p>
              </div>
            )}
            {customer.note && (
              <div className="mt-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg p-2.5 border border-amber-100 dark:border-amber-900/40">
                <p className="text-[10px] text-amber-700 uppercase font-semibold">
                  📝 Note
                </p>
                <p className="text-xs text-amber-700 mt-0.5">{customer.note}</p>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-xs font-bold uppercase text-rose-500 mb-3 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              Order Items ({items.length})
            </h3>
            <div className="space-y-2">
              {items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-card border border-border/40 rounded-xl"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-900 flex-shrink-0">
                    <img
                      src={item.productImage || item.image || "https://via.placeholder.com/100"}
                      alt={item.productName || item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.productName || item.title || "Product"}
                    </p>
                    {item.category && (
                      <p className="text-[10px] text-muted-foreground">
                        {item.category}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.size && item.size !== "N/A" && (
                        <Badge variant="outline" className="text-[9px] h-5">
                          Size: {item.size}
                        </Badge>
                      )}
                      {item.color && (
                        <Badge variant="outline" className="text-[9px] h-5">
                          Color: {item.color}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-muted-foreground">
                      ৳{item.price} × {item.quantity}
                    </p>
                    <p className="text-sm font-bold text-rose-600">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-2xl p-4 border border-rose-100 dark:border-rose-900/40 space-y-2">
            {order.subTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">৳{order.subTotal.toLocaleString()}</span>
              </div>
            )}
            {order.shippingFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">৳{order.shippingFee.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-rose-200/60 dark:border-rose-900/40 pt-2 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-lg font-bold text-rose-600">
                ৳{(order.totalPrice || order.grandTotal || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border/40 p-4 flex gap-2 justify-end flex-wrap bg-stone-50/50 dark:bg-stone-900/30">
          <Button variant="outline" onClick={handlePrint} className="rounded-xl">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-rose-200/60 hover:bg-rose-50"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}