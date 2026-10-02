// pages/admin/Analytics/AdminAnalyticsPage.tsx
"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  ShoppingBag,
  Package,
  DollarSign,
  Calendar,
  ArrowUp,
  ArrowDown,
  Eye,
  RefreshCw,
  Sparkles,
  Activity,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAdminOverviewQuery,
  useGetUserStatsQuery,
  useGetOrderStatsQuery,
} from "@/redux/features/admin/admin.api";

// ============================================
// ✅ ANIMATION VARIANTS
// ============================================
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

// ✅ Chart colors
const CHART_COLORS = [
  "#f43f5e",
  "#fb7185",
  "#fda4af",
  "#fecdd3",
  "#fce7f3",
  "#a855f7",
  "#8b5cf6",
  "#6366f1",
];

const AdminAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState("7d");
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("area");

  // ✅ Fetch data
  const { data: overviewData, isLoading: loadingOverview, refetch } =
    useGetAdminOverviewQuery(undefined);
  const { data: userData, isLoading: loadingUsers } = useGetUserStatsQuery(
    undefined,
    { skip: false }
  );
  const { data: orderData, isLoading: loadingOrders } = useGetOrderStatsQuery(
    undefined,
    { skip: false }
  );

  const isLoading = loadingOverview || loadingUsers || loadingOrders;

  // ✅ Extract data safely
  const overview = overviewData?.overview || {};
  const categories = overviewData?.categories || [];
  const lowStock = overviewData?.lowStock || [];
  const userStats = userData || {};
  const orderStats = orderData || {};

  // ============================================
  // ✅ STATS CARDS
  // ============================================
  const statsCards = [
    {
      title: "Total Products",
      value: overview.totalProducts ?? 0,
      icon: Package,
      change: overview.totalActive
        ? `+${Math.round(
            (overview.totalActive / overview.totalProducts) * 100
          )}%`
        : "0%",
      trend: "up",
      gradient: "from-pink-500/20 via-rose-500/10 to-pink-500/5",
      iconBg: "bg-pink-500",
    },
    {
      title: "Total Orders",
      value: orderStats.totalOrders ?? 0,
      icon: ShoppingBag,
      change: orderStats.completedOrders
        ? `+${Math.round(
            (orderStats.completedOrders / orderStats.totalOrders) * 100
          )}%`
        : "0%",
      trend: "up",
      gradient: "from-blue-500/20 via-sky-500/10 to-blue-500/5",
      iconBg: "bg-blue-500",
    },
    {
      title: "Total Users",
      value: userStats.totalUsers ?? 0,
      icon: Users,
      change: userStats.totalAdmins ? `+${userStats.totalAdmins} admin` : "—",
      trend: "up",
      gradient: "from-purple-500/20 via-violet-500/10 to-purple-500/5",
      iconBg: "bg-purple-500",
    },
    {
      title: "Revenue",
      value: `৳${(orderStats.totalRevenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
      change: "+12.5%",
      trend: "up",
      gradient: "from-emerald-500/20 via-green-500/10 to-emerald-500/5",
      iconBg: "bg-emerald-500",
    },
  ];

  // ============================================
  // ✅ CHART DATA
  // ============================================

  // ✅ Sales trend (mock — backend এ real data থাকলে replace করুন)
  const salesTrendData = useMemo(() => {
    const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
    const base = orderStats.totalRevenue
      ? orderStats.totalRevenue / days
      : 1000;

    return Array.from({ length: days }).map((_, i) => ({
      date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000)
        .toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      sales: Math.round(base * (0.6 + Math.random() * 0.8)),
      orders: Math.round(5 + Math.random() * 20),
    }));
  }, [dateRange, orderStats.totalRevenue]);

  // ✅ Category distribution
  const categoryData = categories.map((c: any) => ({
    name: c._id || "Uncategorized",
    value: c.productCount || 0,
    stock: c.totalStock || 0,
  }));

  // ✅ Stock health
  const stockHealthData = [
    { name: "In Stock", value: overview.totalInStock ?? 0, color: "#10b981" },
    { name: "Out of Stock", value: overview.totalOutOfStock ?? 0, color: "#f43f5e" },
    { name: "Inactive", value: overview.totalInactive ?? 0, color: "#71717a" },
  ].filter((d) => d.value > 0);

  // ✅ User role distribution
  const userRoleData = [
    { name: "Regular Users", value: (userStats.totalUsers ?? 0) - (userStats.totalAdmins ?? 0), color: "#6366f1" },
    { name: "Admins", value: userStats.totalAdmins ?? 0, color: "#f43f5e" },
    { name: "Blocked", value: userStats.totalBlocked ?? 0, color: "#71717a" },
  ].filter((d) => d.value > 0);

  // ✅ Render loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-80 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  // ✅ Render chart helper
  const renderSalesChart = () => {
    const ChartComponent =
      chartType === "line" ? LineChart : chartType === "bar" ? BarChart : AreaChart;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={salesTrendData}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="date"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            stroke="#888888"
          />
          <YAxis
            fontSize={11}
            tickLine={false}
            axisLine={false}
            stroke="#888888"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "12px",
              border: "1px solid #f43f5e",
              backdropFilter: "blur(8px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            }}
          />
          {chartType === "line" && (
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#f43f5e"
              strokeWidth={3}
              dot={{ fill: "#f43f5e", r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
          {chartType === "bar" && (
            <Bar dataKey="sales" fill="#f43f5e" radius={[8, 8, 0, 0]} />
          )}
          {chartType === "area" && (
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#f43f5e"
              strokeWidth={3}
              fill="url(#salesGradient)"
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* ============================================
          HEADER
         ============================================ */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">
              Analytics
            </span>
            <Sparkles className="w-6 h-6 text-pink-500" />
          </h1>
          <p className="text-muted-foreground text-sm">
            Deep insights into your store performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="h-10 w-[140px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            className="h-10 w-10"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* ============================================
          STATS CARDS
         ============================================ */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {statsCards.map((card) => {
          const Icon = card.icon;
          const isUp = card.trend === "up";
          return (
            <motion.div
              key={card.title}
              variants={fadeIn}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Card className="overflow-hidden border-0 shadow-lg rounded-2xl bg-gradient-to-br from-white to-pink-50/30 dark:from-zinc-900 dark:to-zinc-900/50 relative group">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <CardContent className="relative p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {card.title}
                      </p>
                      <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100">
                        {card.value}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <Badge
                          className={`text-[10px] px-2 py-0 h-5 ${
                            isUp
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          } border-0`}
                        >
                          {isUp ? (
                            <ArrowUp className="w-2.5 h-2.5" />
                          ) : (
                            <ArrowDown className="w-2.5 h-2.5" />
                          )}
                          {card.change}
                        </Badge>
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-2xl ${card.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ============================================
          SALES TREND CHART
         ============================================ */}
      <motion.div variants={fadeIn} initial="initial" animate="animate">
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-pink-50/20 dark:from-zinc-900 dark:to-zinc-900/50">
          <CardHeader className="border-b border-pink-100/50 dark:border-zinc-800/50 bg-pink-50/30 dark:bg-zinc-900/30 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-pink-500" />
              Sales Trend
            </CardTitle>
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900 p-0.5 rounded-lg">
              {(["line", "bar", "area"] as const).map((type) => (
                <Button
                  key={type}
                  size="sm"
                  variant={chartType === type ? "default" : "ghost"}
                  onClick={() => setChartType(type)}
                  className={`h-7 text-[10px] uppercase px-2.5 rounded-md ${
                    chartType === type
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                      : ""
                  }`}
                >
                  {type}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="h-[320px] pt-6">
            {renderSalesChart()}
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================
          CATEGORY + STOCK CHARTS
         ============================================ */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Bar Chart */}
        <motion.div variants={fadeIn} initial="initial" animate="animate">
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-pink-50/30">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-pink-500" />
                Products by Category
                <Badge
                  variant="outline"
                  className="ml-auto text-[10px] text-pink-600"
                >
                  {categoryData.length} categories
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] pt-6">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      stroke="#888"
                    />
                    <YAxis
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      stroke="#888"
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #f43f5e",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {categoryData.map((_: any, idx: number) => (
                        <Cell
                          key={idx}
                          fill={CHART_COLORS[idx % CHART_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <BarChart3 className="w-8 h-8 opacity-30" />
                  <span className="text-sm">No categories</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Stock Health Pie Chart */}
        <motion.div variants={fadeIn} initial="initial" animate="animate">
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-pink-50/30">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-pink-500" />
                Stock Health
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] pt-6">
              {stockHealthData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stockHealthData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {stockHealthData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #f43f5e",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      iconSize={10}
                      formatter={(value) => (
                        <span className="text-xs text-muted-foreground">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  No stock data
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ============================================
          USER ROLE DISTRIBUTION + LOW STOCK
         ============================================ */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Roles */}
        <motion.div variants={fadeIn} initial="initial" animate="animate">
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-purple-50/30">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                User Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[280px] pt-6">
              {userRoleData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userRoleData}
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}
                    >
                      {userRoleData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #a855f7",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  No user data
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Categories by Stock */}
        <motion.div variants={fadeIn} initial="initial" animate="animate">
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-amber-50/30">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" />
                Stock by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 max-h-[280px] overflow-y-auto">
              {categoryData.length > 0 ? (
                <div className="space-y-3">
                  {categoryData
                    .sort((a: any, b: any) => b.stock - a.stock)
                    .slice(0, 6)
                    .map((cat: any, idx: number) => {
                      const maxStock = Math.max(
                        ...categoryData.map((c: any) => c.stock)
                      );
                      const pct = (cat.stock / maxStock) * 100;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium">{cat.name}</span>
                            <span className="font-mono text-muted-foreground">
                              {cat.stock}
                            </span>
                          </div>
                          <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, delay: idx * 0.1 }}
                              className="h-full rounded-full"
                              style={{
                                background:
                                  CHART_COLORS[idx % CHART_COLORS.length],
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  No data
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ============================================
          QUICK INSIGHTS
         ============================================ */}
      <motion.div variants={fadeIn} initial="initial" animate="animate">
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-pink-50/50 to-purple-50/50">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Eye className="w-4 h-4 text-pink-500" />
              Quick Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Insight 1: Stock health */}
              <div className="p-4 rounded-xl border border-border/60 space-y-2">
                <div className="flex items-center gap-2">
                  {overview.totalOutOfStock > 0 ? (
                    <TrendingDown className="w-4 h-4 text-rose-500" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Stock Health
                  </span>
                </div>
                <p className="text-sm">
                  {overview.totalOutOfStock > 0
                    ? `${overview.totalOutOfStock} products out of stock — restock now`
                    : "All products are in stock! 🎉"}
                </p>
              </div>

              {/* Insight 2: Discounts */}
              <div className="p-4 rounded-xl border border-border/60 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Discounts Active
                  </span>
                </div>
                <p className="text-sm">
                  {overview.totalWithDiscount ?? 0} products on discount
                </p>
              </div>

              {/* Insight 3: Users */}
              <div className="p-4 rounded-xl border border-border/60 space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Users
                  </span>
                </div>
                <p className="text-sm">
                  {userStats.totalUsers ?? 0} total · {userStats.totalBlocked ?? 0} blocked
                </p>
              </div>

              {/* Insight 4: Orders */}
              <div className="p-4 rounded-xl border border-border/60 space-y-2">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Pending Orders
                  </span>
                </div>
                <p className="text-sm">
                  {orderStats.pendingOrders ?? 0} orders awaiting action
                </p>
              </div>

              {/* Insight 5: Low Stock */}
              <div className="p-4 rounded-xl border border-border/60 space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Low Stock
                  </span>
                </div>
                <p className="text-sm">
                  {lowStock.length} products need restocking
                </p>
              </div>

              {/* Insight 6: Revenue */}
              <div className="p-4 rounded-xl border border-border/60 space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Revenue
                  </span>
                </div>
                <p className="text-sm">
                  ৳{(orderStats.totalRevenue ?? 0).toLocaleString()} earned
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminAnalyticsPage;