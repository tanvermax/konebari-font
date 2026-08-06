import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAdminOverviewQuery } from "@/redux/features/product/product.api";
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
} from "lucide-react";
// চার্ট তৈরি করার জন্য recharts ব্যবহার করা হয়েছে (যদি ইনস্টল না থাকে: npm i recharts)
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const AdminOverviewPage = () => {
  const { data, isLoading } = useAdminOverviewQuery(undefined);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6900]"></div>
        <p className="text-muted-foreground animate-pulse text-sm font-medium">Loading Overview Data...</p>
      </div>
    );
  }

  const overview = data?.overview;

  const cards = [
    {
      title: "Total Products",
      value: overview?.totalProducts,
      icon: Package,
      color: "from-orange-500/10 to-[#FF6900]/5",
      iconColor: "text-[#FF6900]",
    },
    {
      title: "Active Products",
      value: overview?.totalActive,
      icon: CheckCircle,
      color: "from-emerald-500/10 to-emerald-500/5",
      iconColor: "text-emerald-500",
    },
    {
      title: "Inactive Products",
      value: overview?.totalInactive,
      icon: XCircle,
      color: "from-rose-500/10 to-rose-500/5",
      iconColor: "text-rose-500",
    },
    {
      title: "In Stock Types",
      value: overview?.totalInStock,
      icon: Layers,
      color: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-500",
    },
    {
      title: "Out Of Stock",
      value: overview?.totalOutOfStock,
      icon: AlertTriangle,
      color: "from-amber-500/10 to-amber-500/5",
      iconColor: "text-amber-500",
    },
    {
      title: "Total Variants",
      value: overview?.totalVariants,
      icon: Boxes,
      color: "from-purple-500/10 to-purple-500/5",
      iconColor: "text-purple-500",
    },
    {
      title: "With Discount",
      value: overview?.totalWithDiscount,
      icon: Percent,
      color: "from-teal-500/10 to-teal-500/5",
      iconColor: "text-teal-500",
    },
    {
      title: "Total Stock Qty",
      value: overview?.totalStockQuantity,
      icon: TrendingUp,
      color: "from-indigo-500/10 to-indigo-500/5",
      iconColor: "text-indigo-500",
    },
  ];

  // চার্টের জন্য ক্যাটাগরি ডেটা ফরম্যাট করা
  const chartData = data?.categories?.map((cat: any) => ({
    name: cat._id,
    products: cat.productCount,
  })) || [];

  return (
    <div className="space-y-8 p-4 md:p-8 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Admin Dashboard</h2>
          <p className="text-muted-foreground text-sm">Real-time product inventory and store statistics.</p>
        </div>
        <Badge variant="outline" className="w-fit border-[#FF6900]/30 text-[#FF6900] bg-[#FF6900]/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          Live Overview
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="overflow-hidden border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
              <div className={`p-6 bg-gradient-to-br ${item.color} h-full flex flex-col justify-between`}>
                <div className="flex items-center justify-between space-x-4">
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                    {item.title}
                  </span>
                  <div className={`p-2 rounded-xl bg-white shadow-sm ${item.iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    {item.value ?? 0}
                  </h2>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Graphical Chart & Average Prices */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recharts Bar Chart */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200/60">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">Products by Category</CardTitle>
            <CardDescription>Visual distribution of total items per category</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] pr-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} stroke="#64748b" />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    cursor={{ fill: 'rgba(255, 105, 0, 0.04)' }}
                  />
                  <Bar dataKey="products" radius={[4, 4, 0, 0]}>
                    {chartData.map(( index:number) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#FF6900' : '#ff8533'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Pricing Info */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <Card className="shadow-sm border-slate-200/60 relative overflow-hidden bg-gradient-to-br from-white to-orange-50/20 group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6900]" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Average Min Price</CardTitle>
            </CardHeader>
            <CardContent>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-baseline">
                <span className="text-[#FF6900] mr-2 text-2xl font-bold">৳</span>
                {overview?.avgMinPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h1>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200/60 relative overflow-hidden bg-gradient-to-br from-white to-orange-50/20 group">
            <div className="absolute top-0 left-0 w-1 h-full bg-slate-800" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Average Max Price</CardTitle>
            </CardHeader>
            <CardContent>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-baseline">
                <span className="text-slate-700 mr-2 text-2xl font-bold">৳</span>
                {overview?.avgMaxPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h1>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Table */}
      <Card className="shadow-sm border-slate-200/60 overflow-hidden">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100">
          <CardTitle className="text-lg font-bold text-slate-800">Category Statistics</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-100/60">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Category</TableHead>
                  <TableHead className="font-semibold text-slate-700">Products</TableHead>
                  <TableHead className="font-semibold text-slate-700">Stock Available</TableHead>
                  <TableHead className="font-semibold text-slate-700">Avg Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.categories?.map((category: any) => (
                  <TableRow key={category._id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="font-medium">
                      <Badge className="bg-[#FF6900]/10 text-[#FF6900] border-none hover:bg-[#FF6900]/20 font-medium px-2.5 py-0.5">
                        {category._id}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">{category.productCount}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center font-semibold px-2 py-0.5 rounded text-xs ${category.totalStock > 10 ? 'text-slate-700' : 'text-amber-600 bg-amber-50'}`}>
                        {category.totalStock}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold text-slate-800">৳ {category.avgPrice?.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Grid for Low Stock & Out Of Stock */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Low Stock Table */}
        <Card className="shadow-sm border-slate-200/60 overflow-hidden">
          <CardHeader className="bg-amber-50/40 border-b border-amber-100/60 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" /> Low Stock Warning
              </CardTitle>
            </div>
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none font-bold">Action Needed</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Name</TableHead>
                  <TableHead className="font-semibold text-slate-700">Current Stock</TableHead>
                  <TableHead className="font-semibold text-slate-700">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.lowStock?.map((item: any) => (
                  <TableRow key={item._id} className="hover:bg-amber-50/10">
                    <TableCell className="font-medium text-slate-800 max-w-[200px] truncate">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 font-bold">
                        {item.totalStock} left
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">৳ {item.minPrice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Out Of Stock Grid */}
        <Card className="shadow-sm border-slate-200/60 overflow-hidden">
          <CardHeader className="bg-rose-50/40 border-b border-rose-100/60">
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-rose-500" /> Out Of Stock
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {data?.outOfStock && data.outOfStock.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {data?.outOfStock?.map((item: any) => (
                  <div key={item._id} className="border border-rose-100 bg-rose-50/30 rounded-xl p-3 flex items-center justify-between group hover:border-rose-200 transition-colors">
                    <p className="font-medium text-slate-700 text-sm truncate pr-2">{item.name}</p>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-100/60 px-2 py-0.5 rounded-full uppercase shrink-0">Empty</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-sm">All items are currently in stock! 🎉</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recently Updated Table */}
      <Card className="shadow-sm border-slate-200/60 overflow-hidden">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-500" /> Recently Updated Products
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-100/60">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Product Name</TableHead>
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700">Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.recentlyUpdated?.map((item: any) => (
                  <TableRow key={item._id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="font-medium text-slate-800">{item.name}</TableCell>
                    <TableCell>
                      <Badge className={`font-semibold border-none px-2.5 py-0.5 ${
                        item.status?.toLowerCase() === 'active' 
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm font-medium">
                      {new Date(item.updatedAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverviewPage;