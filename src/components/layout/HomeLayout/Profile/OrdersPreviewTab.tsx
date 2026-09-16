// components/layout/Profile/OrdersPreviewTab.tsx
import { Link } from "react-router";
import { Package, ArrowRight, Truck, CheckCircle2, Clock, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyOrdersQuery } from "@/redux/features/order/Order.api";
import { useSessionId } from "@/redux/hooks/useSessionId";

export default function OrdersPreviewTab() {
  const { isLoggedIn } = useSessionId();

  // ✅ Skip query if not logged in
  const { data, isLoading, isError, error } = useGetMyOrdersQuery(undefined, {
    skip: !isLoggedIn,
  });

  // ✅ Handle response shapes
  const orders: any[] = (() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    return [];
  })();

  // ✅ Debug log
  console.log("📦 My Orders:", { data, orders, isLoading, isError, error });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-3 h-3" />;
      case "Shipped":
        return <Truck className="w-3 h-3" />;
      case "Completed":
        return <CheckCircle2 className="w-3 h-3" />;
      default:
        return <Package className="w-3 h-3" />;
    }
  };

  const getStatusStyle = (status: string) => {
    const styles: any = {
      Pending:
        "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
      Paid: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300",
      Shipped:
        "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
      Completed:
        "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
      Cancelled:
        "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  // ✅ Not logged in
  if (!isLoggedIn) {
    return (
      <Card className="border-border/40">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center mb-3">
            <UserX className="w-8 h-8 text-amber-600" />
          </div>
          <p className="text-sm font-semibold mb-1">Login Required</p>
          <p className="text-xs text-muted-foreground mb-4">
            Please login to see your order history
          </p>
          <Link to="/login">
            <Button
              size="sm"
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl"
            >
              Login Now
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // ✅ Loading
  if (isLoading) {
    return (
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="w-4 h-4 text-rose-500" />
            My Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  // ✅ Error
  if (isError) {
    return (
      <Card className="border-border/40">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-3">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-sm font-semibold mb-1">Failed to Load Orders</p>
          <p className="text-xs text-muted-foreground">
            {(error as any)?.data?.message || "Something went wrong"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Package className="w-4 h-4 text-rose-500" />
          My Orders ({orders.length})
        </CardTitle>
        {orders.length > 0 && (
          <Link to="/orders">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-rose-500 hover:text-rose-600 gap-1"
            >
              View All
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        )}
      </CardHeader>

      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/30 flex items-center justify-center mb-3">
              <Package className="w-8 h-8 text-rose-500" />
            </div>
            <p className="text-sm font-semibold mb-1">No Orders Yet</p>
            <p className="text-xs text-muted-foreground mb-4">
              Start shopping to see your orders here
            </p>
            <Link to="/shop">
              <Button
                size="sm"
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl"
              >
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order: any) => (
              <Link
                key={order._id}
                to={`/ordertrack?id=${order._id}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:border-rose-200/60 hover:bg-rose-50/30 dark:hover:bg-rose-950/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-rose-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">
                    #{order.trackingId || order._id?.slice(-8)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {order.orderedItems?.length || order.items?.length || 0}{" "}
                    item(s) •{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <Badge
                    className={`${getStatusStyle(order.status)} text-[9px] gap-1`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </Badge>
                  <p className="text-xs font-bold text-rose-600 mt-0.5">
                    ৳
                    {(
                      order.totalPrice ||
                      order.grandTotal ||
                      0
                    ).toLocaleString()}
                  </p>
                </div>

                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}