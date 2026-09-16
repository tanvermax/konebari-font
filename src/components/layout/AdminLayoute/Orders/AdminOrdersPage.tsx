// components/layout/AdminLayoute/Orders/AdminOrdersPage.tsx
"use client";
import { useMemo, useState } from "react";
import {
  ShoppingBag,
  Eye,
  Pencil,
  Trash2,
  User,
  Phone,
  Package,

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  useGetAllOrdersQuery,
  useDeleteOrderMutation,
} from "@/redux/features/order/Order.api";
import OrderStats from "./OrderStats";
import OrderFilters from "./OrderFilters";
import OrderDetailDialog from "./OrderDetailDialog";
import EditOrderDialog from "./EditOrderDialog";

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

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [orderType, setOrderType] = useState("all");

  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  // ✅ Fetch all orders
  const { data, isLoading, refetch } = useGetAllOrdersQuery(undefined, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
  });

  const [deleteOrder] = useDeleteOrderMutation();

  // ✅ Normalize orders array
  const allOrders: any[] = useMemo(() => {
    const raw = data?.data || data || [];
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  // ✅ Filter orders
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order: any) => {
      // Status filter
      if (status !== "all" && order.status !== status) return false;

      // Payment filter
      if (paymentStatus !== "all" && order.paymentStatus !== paymentStatus) return false;

      // Order type filter
      const isGuest = order.isGuest ?? !order.userId;
      if (orderType === "guest" && !isGuest) return false;
      if (orderType === "user" && isGuest) return false;

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const customer = order.customer || order.shippingAddress || {};
        const haystack = [
          order.trackingId,
          order._id,
          customer.name,
          customer.phone,
          customer.email,
          customer.city,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [allOrders, search, status, paymentStatus, orderType]);

  // ✅ Delete order
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    setDeletingIds((prev) => new Set(prev).add(id));
    try {
      await deleteOrder(id).unwrap();
      toast.success("Order deleted");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete");
    } finally {
      setDeletingIds((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
          Order Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage all customer orders, update status, and track shipments
        </p>
      </div>

      {/* Stats */}
      <OrderStats orders={allOrders} />

      {/* Filters */}
      <OrderFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        paymentStatus={paymentStatus}
        setPaymentStatus={setPaymentStatus}
        orderType={orderType}
        setOrderType={setOrderType}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-bold text-foreground">{filteredOrders.length}</span> of{" "}
          <span className="font-bold text-foreground">{allOrders.length}</span> orders
        </p>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-rose-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
            <p className="text-sm text-muted-foreground">
              {search || status !== "all"
                ? "Try adjusting your search or filters"
                : "No orders yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order: any) => {
            const customer = order.customer || order.shippingAddress || {};
            const items = order.orderedItems || order.items || [];
            const isGuest = order.isGuest ?? !order.userId;
            const isDeleting = deletingIds.has(order._id);

            return (
              <Card
                key={order._id}
                className="border border-border/40 hover:shadow-lg hover:border-rose-200/60 transition-all overflow-hidden"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Left: Order Info */}
                    <div className="flex-1 space-y-3">
                      {/* Top row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          #{order.trackingId || order._id?.slice(-8)}
                        </Badge>
                        <Badge className={`${getStatusStyle(order.status)} border text-[10px]`}>
                          {order.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            order.paymentStatus === "Success"
                              ? "border-emerald-300 text-emerald-600"
                              : order.paymentStatus === "Failed"
                              ? "border-red-300 text-red-600"
                              : "border-amber-300 text-amber-600"
                          }`}
                        >
                          💰 {order.paymentStatus}
                        </Badge>
                        {isGuest ? (
                          <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700">
                            👤 Guest
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] border-emerald-300 text-emerald-700">
                            🎯 Registered
                          </Badge>
                        )}
                      </div>

                      {/* Customer */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="font-medium truncate">
                            {customer.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{customer.phone || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2">
                          <Package className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">
                            {items.length} item{items.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {/* First item preview */}
                      {items.length > 0 && (
                        <div className="flex items-center gap-2">
                          {items.slice(0, 3).map((item: any, i: number) => (
                            <div
                              key={i}
                              className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-900 flex-shrink-0"
                            >
                              <img
                                src={item.productImage || item.image || "https://via.placeholder.com/50"}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {items.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{items.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Price + Actions */}
                    <div className="lg:w-64 flex lg:flex-col justify-between lg:justify-start gap-3 lg:border-l lg:pl-4 border-border/40">
                      {/* Price */}
                      <div className="lg:text-right">
                        <p className="text-[10px] text-muted-foreground uppercase">
                          Total
                        </p>
                        <p className="text-xl font-bold text-rose-600">
                          ৳{(order.totalPrice || order.grandTotal || 0).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : ""}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex lg:flex-col gap-2 lg:mt-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setViewingOrder(order)}
                          className="flex-1 lg:w-full h-8 text-xs rounded-lg gap-1.5"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingOrder(order)}
                          className="flex-1 lg:w-full h-8 text-xs rounded-lg gap-1.5 border-blue-200 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(order._id)}
                          disabled={isDeleting}
                          className="flex-1 lg:w-full h-8 text-xs rounded-lg gap-1.5 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="w-3 h-3" />
                          {isDeleting ? "..." : "Delete"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialogs */}
      <OrderDetailDialog
        order={viewingOrder}
        open={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
      />
      <EditOrderDialog
        order={editingOrder}
        open={!!editingOrder}
        onClose={() => {
          setEditingOrder(null);
          refetch();
        }}
      />
    </div>
  );
}