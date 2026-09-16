// components/layout/AdminLayoute/Orders/OrderStats.tsx
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingBag,
  Clock,
  Package,
  CheckCircle2,
  XCircle,
  DollarSign,
} from "lucide-react";

interface OrderStatsProps {
  orders: any[];
}

export default function OrderStats({ orders }: OrderStatsProps) {
  const total = orders.length;
  const pending = orders.filter((o) => o.status === "Pending").length;
  const shipped = orders.filter((o) => o.status === "Shipped").length;
  const completed = orders.filter((o) => o.status === "Completed").length;
  const cancelled = orders.filter((o) => o.status === "Cancelled").length;
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + (o.totalPrice || o.grandTotal || 0), 0);

  const stats = [
    {
      label: "Total Orders",
      value: total,
      icon: ShoppingBag,
      gradient: "from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20",
      color: "text-rose-600",
      border: "border-rose-100 dark:border-rose-900/40",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      gradient: "from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20",
      color: "text-amber-600",
      border: "border-amber-100 dark:border-amber-900/40",
    },
    {
      label: "Shipped",
      value: shipped,
      icon: Package,
      gradient: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
      color: "text-blue-600",
      border: "border-blue-100 dark:border-blue-900/40",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      gradient: "from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
      color: "text-emerald-600",
      border: "border-emerald-100 dark:border-emerald-900/40",
    },
    {
      label: "Cancelled",
      value: cancelled,
      icon: XCircle,
      gradient: "from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20",
      color: "text-red-600",
      border: "border-red-100 dark:border-red-900/40",
    },
    {
      label: "Revenue",
      value: `৳${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20",
      color: "text-purple-600",
      border: "border-purple-100 dark:border-purple-900/40",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className={`border ${stat.border} bg-gradient-to-br ${stat.gradient} shadow-sm`}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg bg-background/60 backdrop-blur-sm`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase font-medium">
                  {stat.label}
                </p>
                <p className={`text-sm sm:text-base font-bold ${stat.color} truncate`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}