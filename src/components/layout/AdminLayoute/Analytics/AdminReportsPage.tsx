// pages/admin/Analytics/AdminReportsPage.tsx
"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText,

  Calendar,

  Package,
  Users,
  ShoppingBag,
  DollarSign,
  
  BarChart3,
  RefreshCw,
  FileSpreadsheet,
  Printer,
  Mail,
  Sparkles,

  Clock,

  XCircle,
  FileBarChart,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  useGetAdminOverviewQuery,
  useGetUserStatsQuery,
  useGetOrderStatsQuery,
} from "@/redux/features/admin/admin.api";

// ============================================
// ✅ Animation Variants
// ============================================
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};



export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  // ✅ Fetch data
  const { data: overviewData, isLoading: loadingOverview, refetch } =
    useGetAdminOverviewQuery(undefined);
  const { data: userData, isLoading: loadingUsers } = useGetUserStatsQuery(
    undefined
  );
  const { data: orderData, isLoading: loadingOrders } = useGetOrderStatsQuery(
    undefined
  );

  const isLoading = loadingOverview || loadingUsers || loadingOrders;

  // ✅ Data extraction
  const overview = overviewData?.overview || {};
  const categories = overviewData?.categories || [];
  const lowStock = overviewData?.lowStock || [];
  const outOfStock = overviewData?.outOfStock || [];
  const recentlyUpdated = overviewData?.recentlyUpdated || [];
  const userStats = userData || {};
  const orderStats = orderData || {};

  // ============================================
  // ✅ CSV Export Helper
  // ============================================
  const downloadCSV = (filename: string, rows: any[]) => {
    if (!rows || rows.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((h) => {
            const val = row[h];
            const str = val === null || val === undefined ? "" : String(val);
            return `"${str.replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success(`${filename} exported successfully ✨`);
  };

  // ============================================
  // ✅ Export Handlers
  // ============================================
  const handleExportSales = () => {
    const salesData = [
      {
        metric: "Total Revenue",
        value: `৳${orderStats.totalRevenue ?? 0}`,
      },
      { metric: "Total Orders", value: orderStats.totalOrders ?? 0 },
      { metric: "Completed Orders", value: orderStats.completedOrders ?? 0 },
      { metric: "Pending Orders", value: orderStats.pendingOrders ?? 0 },
    ];
    downloadCSV("sales_report", salesData);
  };

  const handleExportProducts = () => {
    const productData = categories.map((c: any) => ({
      category: c._id,
      products: c.productCount,
      stock: c.totalStock,
      avg_price: c.avgPrice,
    }));
    downloadCSV("product_report", productData);
  };

  const handleExportUsers = () => {
    const userData = [
      { metric: "Total Users", value: userStats.totalUsers ?? 0 },
      { metric: "Total Admins", value: userStats.totalAdmins ?? 0 },
      { metric: "Blocked Users", value: userStats.totalBlocked ?? 0 },
    ];
    downloadCSV("user_report", userData);
  };

  const handleExportOrders = () => {
    const orderData = [
      { metric: "Total Orders", value: orderStats.totalOrders ?? 0 },
      { metric: "Pending", value: orderStats.pendingOrders ?? 0 },
      { metric: "Completed", value: orderStats.completedOrders ?? 0 },
      { metric: "Revenue", value: `৳${orderStats.totalRevenue ?? 0}` },
    ];
    downloadCSV("order_report", orderData);
  };

  const handlePrintReport = () => {
    window.print();
    toast.success("Preparing print view...");
  };

  const handleEmailReport = () => {
    toast.info("Email report feature coming soon");
  };

  // ============================================
  // ✅ Summary Stats
  // ============================================
  const summaryStats = [
    {
      title: "Total Revenue",
      value: `৳${(orderStats.totalRevenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
      iconBg: "bg-emerald-500",
      gradient: "from-emerald-500/20 to-emerald-500/5",
    },
    {
      title: "Products Listed",
      value: overview.totalProducts ?? 0,
      icon: Package,
      iconBg: "bg-pink-500",
      gradient: "from-pink-500/20 to-pink-500/5",
    },
    {
      title: "Active Users",
      value: userStats.totalUsers ?? 0,
      icon: Users,
      iconBg: "bg-purple-500",
      gradient: "from-purple-500/20 to-purple-500/5",
    },
    {
      title: "Total Orders",
      value: orderStats.totalOrders ?? 0,
      icon: ShoppingBag,
      iconBg: "bg-blue-500",
      gradient: "from-blue-500/20 to-blue-500/5",
    },
  ];

  // ============================================
  // ✅ Recent Activity Report
  // ============================================
  const recentActivity = useMemo(() => {
    const activities: Array<{
      id: string;
      type: string;
      title: string;
      time: string;
      status: string;
      icon: any;
      color: string;
    }> = [];

    recentlyUpdated.slice(0, 5).forEach((p: any) => {
      activities.push({
        id: p._id,
        type: "product",
        title: `${p.name} — ${p.status}`,
        time: new Date(p.updatedAt).toLocaleString(),
        status: p.status,
        icon: Package,
        color: p.status === "Active" ? "emerald" : "zinc",
      });
    });

    if (lowStock.length > 0) {
      activities.push({
        id: "low-stock",
        type: "alert",
        title: `${lowStock.length} products low on stock`,
        time: "Just now",
        status: "Warning",
        icon: Clock,
        color: "amber",
      });
    }

    if (outOfStock.length > 0) {
      activities.push({
        id: "out-of-stock",
        type: "alert",
        title: `${outOfStock.length} products out of stock`,
        time: "Just now",
        status: "Urgent",
        icon: XCircle,
        color: "rose",
      });
    }

    return activities;
  }, [recentlyUpdated, lowStock, outOfStock]);

  // ============================================
  // ✅ LOADING
  // ============================================
  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

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
              Reports
            </span>
            <FileBarChart className="w-6 h-6 text-pink-500" />
          </h1>
          <p className="text-muted-foreground text-sm">
            Generate, export & analyze your store data
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
              <SelectItem value="1y">Last 1 year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
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
          SUMMARY STATS
         ============================================ */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {summaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="border-0 shadow-lg rounded-2xl overflow-hidden relative group hover:shadow-xl transition-all"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
              />
              <CardContent className="relative p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                      {stat.value}
                    </h3>
                  </div>
                  <div
                    className={`p-3 rounded-2xl ${stat.iconBg} shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* ============================================
          TABS
         ============================================ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-stone-100 dark:bg-stone-900 p-1 rounded-xl">
          <TabsTrigger
            value="overview"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Clock className="w-4 h-4 mr-2" />
            Activity
          </TabsTrigger>
        </TabsList>

        {/* ============================================
            TAB 1: OVERVIEW
           ============================================ */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Category Table */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-pink-50/30">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Package className="w-4 h-4 text-pink-500" />
                Products by Category
                <Badge
                  variant="outline"
                  className="ml-auto text-[10px] text-pink-600"
                >
                  {categories.length} categories
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {categories.length > 0 ? (
                <Table>
                  <TableHeader className="bg-stone-50">
                    <TableRow>
                      <TableHead className="text-xs font-semibold uppercase">
                        Category
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase">
                        Products
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase">
                        Stock
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase">
                        Avg Price
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((cat: any, idx: number) => (
                      <motion.tr
                        key={cat._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="hover:bg-pink-50/20"
                      >
                        <TableCell>
                          <Badge className="bg-pink-500/10 text-pink-600 border-none">
                            {cat._id}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-sm">
                          {cat.productCount}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              cat.totalStock > 10
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            } border-0 text-xs`}
                          >
                            {cat.totalStock}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          ৳ {cat.avgPrice?.toFixed(2)}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  No category data
                </div>
              )}
            </CardContent>
          </Card>

          {/* Low Stock + Out of Stock */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="border-b bg-amber-50/30">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Low Stock
                  <Badge variant="outline" className="ml-auto text-[10px]">
                    {lowStock.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 max-h-[280px] overflow-y-auto space-y-2">
                {lowStock.length > 0 ? (
                  lowStock.map((item: any) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-3 bg-amber-50/40 rounded-xl border border-amber-100/60"
                    >
                      <span className="text-sm font-medium truncate pr-2">
                        {item.name}
                      </span>
                      <Badge className="bg-amber-500 text-white border-0 text-xs">
                        {item.totalStock} left
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground text-sm">
                    All good! 🎉
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="border-b bg-rose-50/30">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  Out of Stock
                  <Badge variant="outline" className="ml-auto text-[10px]">
                    {outOfStock.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 max-h-[280px] overflow-y-auto space-y-2">
                {outOfStock.length > 0 ? (
                  outOfStock.map((item: any) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-3 bg-rose-50/40 rounded-xl border border-rose-100/60"
                    >
                      <span className="text-sm font-medium truncate pr-2">
                        {item.name}
                      </span>
                      <Badge className="bg-rose-500 text-white border-0 text-xs">
                        Out
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground text-sm">
                    No items out of stock! ✨
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================================
            TAB 2: GENERATE REPORTS
           ============================================ */}
        <TabsContent value="reports" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Sales Report */}
            <motion.div variants={fadeIn} initial="initial" animate="animate">
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden group hover:shadow-2xl transition-all relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="relative p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-emerald-500 shadow-lg shrink-0">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">Sales Report</h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        Revenue, orders & transaction history
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleExportSales}
                          className="bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl gap-1.5"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          Excel (CSV)
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handlePrintReport}
                          className="rounded-xl gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Print
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Product Report */}
            <motion.div variants={fadeIn} initial="initial" animate="animate">
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden group hover:shadow-2xl transition-all relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="relative p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-pink-500 shadow-lg shrink-0">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">Product Report</h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        Inventory, stock levels & category breakdown
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleExportProducts}
                          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl gap-1.5"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          Excel (CSV)
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handlePrintReport}
                          className="rounded-xl gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Print
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* User Report */}
            <motion.div variants={fadeIn} initial="initial" animate="animate">
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden group hover:shadow-2xl transition-all relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="relative p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-purple-500 shadow-lg shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">User Report</h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        User activity, roles & account status
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleExportUsers}
                          className="bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl gap-1.5"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          Excel (CSV)
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEmailReport}
                          className="rounded-xl gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Email
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Report */}
            <motion.div variants={fadeIn} initial="initial" animate="animate">
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden group hover:shadow-2xl transition-all relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="relative p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-blue-500 shadow-lg shrink-0">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">Order Report</h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        Order status, fulfilment & delivery metrics
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleExportOrders}
                          className="bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-xl gap-1.5"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          Excel (CSV)
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handlePrintReport}
                          className="rounded-xl gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Print
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Info banner */}
          <Card className="mt-6 border-0 shadow-sm rounded-2xl bg-gradient-to-br from-pink-50/50 to-purple-50/50">
            <CardContent className="p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold mb-1">
                  Export Tips
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• CSV files open in Excel, Google Sheets & Numbers</li>
                  <li>• Print view optimizes layout for paper reports</li>
                  <li>• Email reports feature coming soon</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================
            TAB 3: RECENT ACTIVITY
           ============================================ */}
        <TabsContent value="activity" className="mt-6">
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-purple-50/30">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                Recent Activity
                <Badge variant="outline" className="ml-auto text-[10px]">
                  {recentActivity.length} events
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recentActivity.length > 0 ? (
                <div className="divide-y divide-border/40">
                  {recentActivity.map((activity, idx) => {
                    const Icon = activity.icon;
              
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center gap-4 p-4 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors"
                      >
                        <div
                          className={`p-2.5 rounded-xl ${
                            activity.color === "emerald"
                              ? "bg-emerald-100 text-emerald-700"
                              : activity.color === "amber"
                              ? "bg-amber-100 text-amber-700"
                              : activity.color === "rose"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {activity.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                        <Badge
                          className={`text-[10px] ${
                            activity.status === "Active"
                              ? "bg-emerald-100 text-emerald-700"
                              : activity.status === "Warning"
                              ? "bg-amber-100 text-amber-700"
                              : activity.status === "Urgent"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-zinc-100 text-zinc-700"
                          } border-0`}
                        >
                          {activity.status}
                        </Badge>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center text-muted-foreground text-sm">
                  No recent activity
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}