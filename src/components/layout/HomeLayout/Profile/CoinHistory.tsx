// components/layout/Profile/CoinHistory.tsx
"use client";
import { Coins, Plus, Gift, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyCoinsQuery } from "@/redux/features/coin/coin.api";

const typeIconMap: Record<string, any> = {
  EARN: Plus,
  BONUS: Gift,
  REFUND: RefreshCw,
};

const typeColorMap: Record<string, string> = {
  EARN: "bg-emerald-100 text-emerald-700",
  BONUS: "bg-purple-100 text-purple-700",
  REFUND: "bg-rose-100 text-rose-700",
};

const relativeTime = (dateStr: string) => {
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

export default function CoinHistory() {
  const { data, isLoading } = useGetMyCoinsQuery({ limit: 20 });

  const transactions = data?.transactions || [];

  if (isLoading) {
    return (
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-500" />
            Coin History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Coins className="w-4 h-4 text-amber-500" />
          Coin History
          <Badge variant="outline" className="ml-auto text-[10px]">
            {transactions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
              <Coins className="w-6 h-6 text-amber-500" />
            </div>
            <p className="text-sm font-medium">No coins yet</p>
            <p className="text-xs text-muted-foreground">
              Order complete করলে এখানে coin দেখতে পাবেন
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx: any) => {
              const Icon = typeIconMap[tx.type] || Plus;
              const colorClass =
                typeColorMap[tx.type] || "bg-stone-100 text-stone-700";
              const isPositive = tx.coins > 0;

              return (
                <div
                  key={tx._id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:bg-stone-50 dark:hover:bg-zinc-900/40 transition-colors"
                >
                  <div
                    className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {tx.description || tx.type}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {relativeTime(tx.createdAt)}
                      {tx.orderId?.trackingId &&
                        ` • #${tx.orderId.trackingId.slice(-8)}`}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className={`text-sm font-bold ${
                        isPositive ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {tx.coins}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      bal: {tx.newBalance}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}