// components/layout/AdminLayoute/Overview/Adminoverviewpage.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Package,
  CheckCircle,
  XCircle,
  Layers,
  Percent,
  Boxes,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  ShoppingBag,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Gem,
  BarChart3,
  Activity,
  Store,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  CartesianGrid,
} from "recharts";
import { useGetAdminOverviewQuery } from "@/redux/features/admin/admin.api";

// ============================================
// ✅ Animation variants
// ============================================
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } },
};

// ============================================
// ✅ Dynamic helper functions
// ============================================

/**
 * Calculate a "health score" percentage
 * Useful to represent trend-like behavior dynamically
 */
const calcTrend = (
  value: number,
  total: number,
  invert = false
): { trend: string; trendUp: boolean } => {
  if (!total || total === 0) return { trend: "0%", trendUp: true };
  const pct = Math.round((value / total) * 100);
  // if invert=true (e.g., inactive/outOfStock), higher is worse
  const trendUp = invert ? pct < 20 : pct > 50;
  return { trend: `${pct}%`, trendUp };
};

/**
 * Format currency nicely
 */
const formatPrice = (n: number | undefined | null) => {
  if (n === undefined || n === null) return "0";
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

/**
 * Format relative time — "2h ago", "3d ago"
 */
const relativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// ============================================
// ✅ MAIN COMPONENT
// ============================================
const AdminOverviewPage = () => {
  const { data, isLoading, isError } = useGetAdminOverviewQuery(undefined);

  // -------------------- LOADING --------------------
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="w-16 h-16 rounded-full border-4 border-pink-200 border-t-pink-500" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
        </motion.div>
        <p className="text-muted-foreground text-sm font-medium animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  // -------------------- ERROR --------------------
  if (isError) {
    return (
      <div className="flex items-center justify-center py-40">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <XCircle className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-lg font-bold">Failed to Load Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Please refresh the page or try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // -------------------- DATA --------------------
  const overview = data?.overview;

  // If overview missing entirely
  if (!overview) {
    return (
      <Card className="border-0 shadow-lg rounded-2xl">
        <CardContent className="p-16 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto">
            <Store className="w-8 h-8 text-pink-500" />
          </div>
          <h2 className="text-xl font-bold">No Data Available</h2>
          <p className="text-sm text-muted-foreground">
            Start adding products to see dashboard analytics.
          </p>
        </CardContent>
      </Card>
    );
  }

  // ============================================
  // ✅ DYNAMIC CARDS — from real data
  // ============================================
  const totalProducts = overview.totalProducts || 0;
  const totalActive = overview.totalActive || 0;
  const totalInactive = overview.totalInactive || 0;
  const totalInStock = overview.totalInStock || 0;
  const totalOutOfStock = overview.totalOutOfStock || 0;
  const totalVariants = overview.totalVariants || 0;
  const totalWithDiscount = overview.totalWithDiscount || 0;
  const totalStockQuantity = overview.totalStockQuantity || 0;

  const cards = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      gradient:
        "from-pink-500/20 via-rose-500/10 to-pink-500/5",
      iconBg: "bg-pink-500",
      iconColor: "text-white",
      ...calcTrend(totalActive, totalProducts),
    },
    {
      title: "Active Products",
      value: totalActive,
      icon: CheckCircle,
      gradient:
        "from-emerald-500/20 via-emerald-500/10 to-emerald-500/5",
      iconBg: "bg-emerald-500",
      iconColor: "text-white",
      ...calcTrend(totalActive, totalProducts),
    },
    {
      title: "Inactive Products",
      value: totalInactive,
      icon: XCircle,
      gradient:
        "from-zinc-500/20 via-zinc-500/10 to-zinc-500/5",
      iconBg: "bg-zinc-500",
      iconColor: "text-white",
      ...calcTrend(totalInactive, totalProducts, true),
    },
    {
      title: "In Stock Types",
      value: totalInStock,
      icon: Layers,
      gradient:
        "from-sky-500/20 via-sky-500/10 to-sky-500/5",
      iconBg: "bg-sky-500",
      iconColor: "text-white",
      ...calcTrend(totalInStock, totalProducts),
    },
    {
      title: "Out Of Stock",
      value: totalOutOfStock,
      icon: AlertTriangle,
      gradient:
        "from-amber-500/20 via-amber-500/10 to-amber-500/5",
      iconBg: "bg-amber-500",
      iconColor: "text-white",
      ...calcTrend(totalOutOfStock, totalProducts, true),
    },
    {
      title: "Total Variants",
      value: totalVariants,
      icon: Boxes,
      gradient:
        "from-purple-500/20 via-purple-500/10 to-purple-500/5",
      iconBg: "bg-purple-500",
      iconColor: "text-white",
      ...calcTrend(totalVariants, totalProducts * 2),
    },
    {
      title: "With Discount",
      value: totalWithDiscount,
      icon: Percent,
      gradient:
        "from-rose-400/20 via-pink-400/10 to-rose-400/5",
      iconBg: "bg-rose-400",
      iconColor: "text-white",
      ...calcTrend(totalWithDiscount, totalProducts),
    },
    {
      title: "Total Stock Qty",
      value: totalStockQuantity.toLocaleString(),
      icon: TrendingUp,
      gradient:
        "from-indigo-500/20 via-indigo-500/10 to-indigo-500/5",
      iconBg: "bg-indigo-500",
      iconColor: "text-white",
      ...calcTrend(totalInStock, totalProducts),
    },
  ];

  // ============================================
  // ✅ DYNAMIC CHART DATA
  // ============================================
  const chartData =
    data?.categories?.map((cat: any) => ({
      name: cat._id || "Unknown",
      products: cat.productCount || 0,
      stock: cat.totalStock || 0,
    })) || [];

  // ✅ Pie chart for active vs inactive vs out of stock
  const pieData = [
    { name: "Active", value: totalActive, color: "#10b981" },
    { name: "Inactive", value: totalInactive, color: "#71717a" },
    { name: "Out of Stock", value: totalOutOfStock, color: "#f59e0b" },
  ].filter((d) => d.value > 0);

  // ✅ Dynamic colors based on data length
  const COLORS = [
    "#f43f5e",
    "#fb7185",
    "#fda4af",
    "#fecdd3",
    "#fce7f3",
    "#fbcfe8",
    "#f9a8d4",
    "#ec4899",
    "#db2777",
    "#be185d",
  ];

  // ============================================
  // ✅ Empty state check for tables
  // ============================================
  const hasCategories = (data?.categories?.length || 0) > 0;
  const hasLowStock = (data?.lowStock?.length || 0) > 0;
  const hasOutOfStock = (data?.outOfStock?.length || 0) > 0;
  const hasRecentlyUpdated = (data?.recentlyUpdated?.length || 0) > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
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
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
          >
            <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </span>
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-pink-500" />
            </motion.span>
          </motion.h2>
          <p className="text-muted-foreground text-sm">
            Real-time inventory & store performance insights
          </p>
        </div>
        <Badge className="w-fit bg-gradient-to-r from-pink-500 to-rose-500 text-white border-none px-4 py-1.5 text-xs font-semibold uppercase tracking-wider shadow-lg shadow-pink-500/20">
          Live Dashboard
        </Badge>
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
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              variants={fadeIn}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative group"
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-white to-pink-50/30 dark:from-zinc-900 dark:to-zinc-900/50">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <CardContent className="relative p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {item.title}
                      </p>
                      <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                        {item.value ?? 0}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <Badge
                          className={`text-[10px] px-2 py-0 h-5 ${
                            item.trendUp
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          } border-0`}
                        >
                          {item.trendUp ? (
                            <ArrowUp className="w-2.5 h-2.5" />
                          ) : (
                            <ArrowDown className="w-2.5 h-2.5" />
                          )}
                          {item.trend}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          of total
                        </span>
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-2xl ${item.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                  </div>
                  <motion.div
                    className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{ scale: [0.8, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Sparkles className="w-3 h-3 text-pink-400" />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ============================================
          CHARTS SECTION
         ============================================ */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ✅ Category Distribution Bar Chart */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-pink-50/20 dark:from-zinc-900 dark:to-zinc-900/50">
            <CardHeader className="border-b border-pink-100/50 dark:border-zinc-800/50 bg-pink-50/30 dark:bg-zinc-900/30">
              <CardTitle className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-pink-500" />
                Category Distribution
                <Badge
                  variant="outline"
                  className="ml-auto text-[10px] bg-pink-50/50 dark:bg-pink-950/20 text-pink-600 border-pink-200"
                >
                  {chartData.length} categories
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[280px] pt-6">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
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
                      cursor={{ fill: "rgba(244, 63, 94, 0.08)" }}
                    />
                    <Bar dataKey="products" radius={[8, 8, 0, 0]}>
                      {chartData.map((_: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm gap-2">
                  <BarChart3 className="w-8 h-8 opacity-30" />
                  <span>No category data available</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ✅ Status Pie Chart + Price Summary */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {/* Pie Chart */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-pink-50/20 dark:from-zinc-900 dark:to-zinc-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-pink-500" />
                Product Status
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[180px] pb-4">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
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
                      iconSize={8}
                      formatter={(value) => (
                        <span className="text-[11px] text-muted-foreground">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                  No data
                </div>
              )}
            </CardContent>
          </Card>

          {/* Price cards */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-pink-50/20 dark:from-zinc-900 dark:to-zinc-900/50 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-500" />
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-pink-500" />
                    Avg Min Price
                  </p>
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-baseline">
                    <span className="text-pink-500 mr-1.5 text-lg font-bold">
                      ৳
                    </span>
                    {formatPrice(overview.avgMinPrice)}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-pink-50/20 dark:from-zinc-900 dark:to-zinc-900/50 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-1">
                    <Gem className="w-3.5 h-3.5 text-purple-500" />
                    Avg Max Price
                  </p>
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-baseline">
                    <span className="text-purple-500 mr-1.5 text-lg font-bold">
                      ৳
                    </span>
                    {formatPrice(overview.avgMaxPrice)}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ============================================
          CATEGORY STATISTICS TABLE
         ============================================ */}
      <motion.div variants={fadeIn} initial="initial" animate="animate">
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-50/50 to-rose-50/50 dark:from-zinc-900/50 dark:to-zinc-900/50 border-b border-pink-100/50 dark:border-zinc-800/50">
            <CardTitle className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-pink-500" />
              Category Statistics
              <Badge
                variant="outline"
                className="ml-auto text-[10px] bg-pink-50/50 text-pink-600 border-pink-200"
              >
                {data?.categories?.length || 0} total
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {hasCategories ? (
              <Table>
                <TableHeader className="bg-zinc-50/80 dark:bg-zinc-900/50">
                  <TableRow>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">
                      Category
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">
                      Products
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">
                      Stock
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">
                      Avg Price
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.categories?.map((category: any, index: number) => (
                    <motion.tr
                      key={category._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-pink-50/30 dark:hover:bg-zinc-900/30 transition-colors group"
                    >
                      <TableCell>
                        <Badge className="bg-pink-500/10 text-pink-600 border-none hover:bg-pink-500/20 font-medium px-3 py-1 text-xs rounded-full">
                          {category._id}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-sm">
                        {category.productCount}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`font-bold px-3 py-1 text-xs rounded-full ${
                            category.totalStock > 10
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          } border-0`}
                        >
                          {category.totalStock}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                        ৳ {formatPrice(category.avgPrice)}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6 text-pink-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No categories yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================
          LOW STOCK + OUT OF STOCK
         ============================================ */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* LOW STOCK */}
        <motion.div variants={fadeIn} initial="initial" animate="animate">
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-50/50 to-amber-100/30 dark:from-amber-950/20 dark:to-amber-950/10 border-b border-amber-100/50 dark:border-zinc-800/50">
              <CardTitle className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Low Stock Warning
                <Badge
                  variant="outline"
                  className="ml-auto text-[10px] bg-amber-50 text-amber-600 border-amber-200"
                >
                  {data?.lowStock?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {hasLowStock ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-semibold">
                        Product
                      </TableHead>
                      <TableHead className="text-xs font-semibold">
                        Stock
                      </TableHead>
                      <TableHead className="text-xs font-semibold">
                        Price
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.lowStock?.map((item: any, index: number) => (
                      <motion.tr
                        key={item._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-amber-50/20 transition-colors"
                      >
                        <TableCell className="font-medium text-sm max-w-[180px] truncate">
                          {item.name}
                        </TableCell>
                        <TableCell>
                          <Badge className="border-amber-300 bg-amber-50 text-amber-700 text-xs font-bold rounded-full px-3 py-1">
                            {item.totalStock} left
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-sm">
                          ৳ {formatPrice(item.minPrice)}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-14 text-center space-y-2">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                  </motion.div>
                  <p className="text-muted-foreground text-sm">
                    Stock levels are healthy! ✨
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* OUT OF STOCK */}
        <motion.div variants={fadeIn} initial="initial" animate="animate">
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-rose-50/50 to-red-50/30 dark:from-rose-950/20 dark:to-red-950/10 border-b border-rose-100/50 dark:border-zinc-800/50">
              <CardTitle className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-rose-500" />
                Out Of Stock
                <Badge
                  variant="outline"
                  className="ml-auto text-[10px] bg-rose-50 text-rose-600 border-rose-200"
                >
                  {data?.outOfStock?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {hasOutOfStock ? (
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {data?.outOfStock?.map((item: any, index: number) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border border-rose-100 dark:border-zinc-800 bg-rose-50/30 dark:bg-rose-950/20 rounded-xl p-3 flex items-center justify-between group hover:shadow-md transition-all"
                    >
                      <p className="font-medium text-sm text-zinc-700 dark:text-zinc-300 truncate pr-2">
                        {item.name}
                      </p>
                      <Badge className="bg-rose-500 text-white text-xs font-bold rounded-full px-3 py-1 border-0 shadow-sm shadow-rose-500/20">
                        Out
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                  </motion.div>
                  <p className="text-muted-foreground font-medium">
                    All items are in stock! 🎉
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ============================================
          RECENTLY UPDATED
         ============================================ */}
      <motion.div variants={fadeIn} initial="initial" animate="animate">
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50/50 to-indigo-50/30 dark:from-purple-950/20 dark:to-indigo-950/10 border-b border-purple-100/50 dark:border-zinc-800/50">
            <CardTitle className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              Recently Updated Products
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {hasRecentlyUpdated ? (
              <Table>
                <TableHeader className="bg-zinc-50/80 dark:bg-zinc-900/50">
                  <TableRow>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">
                      Product
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">
                      Last Updated
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.recentlyUpdated?.map((item: any, index: number) => (
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-purple-50/20 transition-colors"
                    >
                      <TableCell className="font-medium text-sm">
                        {item.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`font-semibold border-0 px-3 py-1 text-xs rounded-full ${
                            item.status?.toLowerCase() === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-muted-foreground">
                        {relativeTime(item.updatedAt)}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6 text-purple-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No recently updated products
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminOverviewPage;