
import { useEffect, useRef, useState } from "react";
import { format, parseISO } from "date-fns";
import { Loader2, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  useAdminupdateOrderMutation,
  useAllOrderForAdminQuery,
  useDeleteOrderMutation,
} from "@/redux/features/order/Order.api";
import OrderViewModal from "./OrderViewModal";

export default function OrderTable() {
  const { data, isLoading, refetch } = useAllOrderForAdminQuery(undefined);
  const [updateOrder] = useAdminupdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const orders = data?.data || [];
  const prevCount = useRef(orders.length);

  useEffect(() => {
    if (orders.length > prevCount.current) {
      toast.success("🎉 New Order Received!");
    }
    prevCount.current = orders.length;
  }, [orders]);

  const handleUpdate = async (order: any, status: string) => {
    try {
      await updateOrder({
        id: order._id,
        status,
        trackingId: order.trackingId || "N/A",
        courierName: order.courierName || "N/A",
      }).unwrap();

      toast.success("Order updated");
      refetch(); // 🔥 FIX: force refresh
    } catch (e) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this order?")) return;

    try {
      await deleteOrder(id).unwrap();
      toast.success("Order deleted");
      refetch();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-xl font-bold mb-4">Orders ({orders.length})</h2>

      <div className="space-y-3">
        {orders.map((order: any) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 flex justify-between items-center hover:shadow"
          >
            <div>
              <p className="font-semibold">#{order._id.slice(-6)}</p>
              <p className="text-sm text-gray-500">
                {format(parseISO(order.createdAt), "PPP")}
              </p>
              <p className="text-orange-600 font-bold">
                ৳{order.grandTotal}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                defaultValue={order.status}
                onChange={(e) => handleUpdate(order, e.target.value)}
                className="border px-2 py-1 rounded"
              >
                <option>Pending</option>
                <option>Shipped</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>

              <button
                onClick={() => setSelectedOrder(order)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Eye size={16} />
              </button>

              <button
                onClick={() => handleDelete(order._id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <OrderViewModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

