import { useState, useEffect } from "react";
import { useAllOrderQuery } from "@/redux/features/order/Order.api";
import { OrderTrackCard } from "./OrderTrackCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Order } from "@/types/cart";

export default function OrderTrack() {
  const { data: response, isLoading } = useAllOrderQuery(undefined);
  const [localOrders, setLocalOrders] = useState<Order[]>([]);

  // 1. Component mount hobar sathe sathe localStorage-er data load hobe (Guest User-er jonno)
  useEffect(() => {
    const savedData = localStorage.getItem("guestCart"); // check standard key name
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // Aponar deya guest object list-ke main Order structural standard-e format kora hocche
        const formattedOrders = parsedData.map((gItem: any) => ({
          _id: gItem._id || `guest_${Date.now()}`,
          status: "Pending", // Guest order automatically initially 'Pending' thakbe
          paymentStatus: "Pending",
          orderedItems: [
            {
              product: {
                _id: gItem.product,
                "*Product Name(English)": gItem.title,
                images: gItem.images,
                "Variations Combo": ""
              },
              quantity: gItem.quantity,
              price: gItem.price
            }
          ],
          totalPrice: gItem.price * gItem.quantity,
          grandTotal: gItem.price * gItem.quantity,
          createdAt: new Date().toISOString()
        }));

        setLocalOrders(formattedOrders as unknown as Order[]);
      } catch (error) {
        console.error("Error parsing localStorage guest orders:", error);
      }
    }
  }, []);

  // 2. Handle loading state
  if (isLoading) {
    return (
      <div className="space-y-4 max-w-5xl mx-auto">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  // 3. Main Logic: API array khali thakle direct localStorage-er array execute hobe
  const apiOrders: Order[] = response?.data ?? [];
  const ordersToDisplay = apiOrders.length > 0 ? apiOrders : localOrders;

  // 4. Status filter logic
  const trackedOrders = ordersToDisplay.filter(
    (order) => order.status === "Shipped" || order.status === "Pending"
  );

  // 5. Khali thakle runtime dynamic screen show korbe
  if (trackedOrders.length === 0) {
    return (
      <p className="text-center text-muted-foreground mt-10">
        No orders found in database or your local session.
      </p>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      {/* Jodi backend array empty thake kintu locally paowa jay, ekta visual badge deya bhalo */}
      {apiOrders.length === 0 && localOrders.length > 0 && (
        <div className="bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-xl p-3 text-xs text-center font-medium">
          ⚠️ Showing unsaved guest orders from your device.
        </div>
      )}

      {trackedOrders.map((order) => (
        <OrderTrackCard key={order._id} order={order} />
      ))}
    </div>
  );
}