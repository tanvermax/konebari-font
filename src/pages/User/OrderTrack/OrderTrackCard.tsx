import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order } from "@/types/cart";
import { Clock, Truck, CheckCircle } from "lucide-react";

interface OrderTrackCardProps {
  order: Order;
}

const statusSteps = [
  { label: "Pending", icon: Clock },
  { label: "Shipped", icon: Truck },
  { label: "Completed", icon: CheckCircle },
];

export function OrderTrackCard({ order }: OrderTrackCardProps) {
  const currentStep = statusSteps.findIndex((step) => step.label === order.status);

  // Safely calculate total quantity across all items
  const totalQuantity = order.orderedItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

  return (
    <Card className="rounded-2xl border-2 p-2">
      {/* Header */}
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-xs md:text-lg">
          Order #{order._id.slice(-6).toUpperCase()}
        </CardTitle>
        <Badge variant={order.status === "Completed" ? "default" : "secondary"}>
          {order.status}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timeline */}
        <div className="relative flex justify-between items-center px-4">
          {/* Timeline Background Line */}
          <div className="absolute top-4 left-10 right-10 h-[2px] bg-muted -z-10" />
          
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const active = index <= currentStep;

            return (
              <div key={step.label} className="flex flex-col items-center z-10 bg-background px-2">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors
                    ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  <Icon size={16} />
                </div>
                <span className={`text-xs mt-1 font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Payment Status Info */}
        <div className="flex flex-row justify-between items-center pt-2 border-t">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
            Payment Method: Cash On Delivery
          </CardTitle>
          <Badge variant="outline">{order.paymentStatus}</Badge>
        </div>

        {/* Ordered Items List */}
        <div className="space-y-4 border-t border-b py-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Items Ordered
          </p>
          <div className="space-y-3">
            {order.orderedItems.map((item, idx) => {
              const product = item.product;
              // Extract fallback fields due to unusual characters in backend keys (*Price, *Product Name...)
              const productName = product?.["*Product Name(English)"] || "Unknown Product";
              const productImg = product?.images || "/placeholder-image.jpg";
              const variation = product?.["Variations Combo"];

              return (
                <div key={idx} className="flex items-center gap-3 bg-muted/30 p-2 rounded-xl">
                  {/* Product Image */}
                  <img
                    src={productImg}
                    alt={productName}
                    className="w-14 h-14 object-cover rounded-lg border bg-white flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Product";
                    }}
                  />
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate text-foreground">
                      {productName}
                    </h4>
                    <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                      {variation && <span>Combo: {variation}</span>}
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>

                  {/* Pricing Subtotal */}
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-semibold text-foreground">
                      ৳{item.price * item.quantity}
                    </span>
                    <p className="text-[10px] text-muted-foreground">৳{item.price} each</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total Cost Summary */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Quantity</span>
            <span>{totalQuantity} {totalQuantity > 1 ? "items" : "item"}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Grand Total</span>
            {/* Show order.totalPrice if grandTotal from your backend structure is null */}
            <span className="text-primary">৳{order.grandTotal || order.totalPrice}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}