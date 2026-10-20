// components/layout/Profile/CoinCard.tsx
"use client";
import { motion } from "framer-motion";
import { Coins, TrendingUp, Gift, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetMyCoinsQuery } from "@/redux/features/coin/coin.api";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoinCard() {
  const { data, isLoading } = useGetMyCoinsQuery({ limit: 5 });

  if (isLoading) {
    return <Skeleton className="h-40 w-full rounded-3xl" />;
  }

  const balance = data?.balance || 0;
  const totalEarned = data?.totalEarned || 0;

  return (
    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-500 opacity-90" />
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/20 blur-3xl" />

      <CardContent className="relative p-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-90">
                My Coins
              </p>
              <p className="text-xs opacity-75">Loyalty Rewards</p>
            </div>
          </div>
          <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </div>

        {/* Balance */}
        <div className="mb-5">
          <p className="text-xs opacity-80 mb-1">Available Balance</p>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-baseline gap-2"
          >
            <span className="text-5xl font-black tracking-tight">
              {balance.toLocaleString()}
            </span>
            <Coins className="w-6 h-6 mb-2" />
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider opacity-80 mb-1">
              <TrendingUp className="w-3 h-3" />
              Total Earned
            </div>
            <p className="text-lg font-bold">{totalEarned.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider opacity-80 mb-1">
              <Gift className="w-3 h-3" />
              Rate
            </div>
            <p className="text-lg font-bold">৳1 = 1</p>
          </div>
        </div>

        {/* Info */}
        <p className="text-[11px] opacity-80 text-center bg-white/10 rounded-lg py-2 px-3 backdrop-blur-sm">
          💡 প্রতি ৳1 কেনাকাটায় 1 coin পাবেন। Order Complete হলে coin add হবে।
        </p>
      </CardContent>
    </Card>
  );
}