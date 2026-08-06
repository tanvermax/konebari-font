import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { ShoppingBag, CheckCircle,  AlertCircle, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { useGetAdminDashboardStatsQuery } from "@/redux/features/order/Order.api";

export default function OrderviewAdmin() {
  const { data: response, isLoading, isError, refetch } = useGetAdminDashboardStatsQuery(undefined);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-[#FF6900]" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading analytical dashboard...</p>
      </div>
    );
  }

  if (isError || !response?.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
        <div className="p-4 bg-red-50 rounded-full text-red-500 mb-4">
          <AlertCircle className="h-12 w-12" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Failed to load statistics</h3>
        <p className="text-slate-500 max-w-sm mt-1">Something went wrong while fetching data from the server.</p>
        <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-[#FF6900] text-white rounded-lg font-medium shadow-md hover:bg-[#e05c00] transition-all">
          Try Again
        </button>
      </div>
    );
  }

  const stats = response.data;

  // Pie Chart-এর কালার প্যালেট (#FF6900 এর সাথে সামঞ্জস্য রেখে)
  const COLORS = {
    Pending: "#F59E0B",   // Amber
    Paid: "#3B82F6",      // Blue
    Shipped: "#8B5CF6",   // Purple
    Completed: "#10B981", // Emerald
    Cancelled: "#EF4444", // Red
  };

  const pieData = Object.keys(stats.statusCounts).map((key) => ({
    name: key,
    value: stats.statusCounts[key as keyof typeof stats.statusCounts],
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-slate-50/50 min-h-screen rounded-2xl">
      
      {/* হেডার সেকশন */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Order Analytics <span className="text-[#FF6900]">Dashboard</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Real-time business insights, sales graphs, and order tracking summaries.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border text-xs font-semibold text-slate-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          Live updates enabled
        </div>
      </div>

      {/* ৪টি টপ ওভারভিউ কার্ড (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* মোট রেভিনিউ */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 left-0 h-full w-1.5 bg-[#FF6900]" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-2xl font-black text-slate-800">৳ {stats.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl text-[#FF6900]">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* মোট অর্ডার */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 left-0 h-full w-1.5 bg-slate-800" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
              <h3 className="text-2xl font-black text-slate-800">{stats.totalOrders}</h3>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl text-slate-800">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* পেন্ডিং অর্ডার */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 left-0 h-full w-1.5 bg-[#F59E0B]" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Orders</p>
              <h3 className="text-2xl font-black text-slate-800">{stats.statusCounts.Pending}</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-[#F59E0B]">
              <AlertCircle className="h-6 w-6 animate-pulse" />
            </div>
          </div>
        </div>

        {/* সফল ডেলিভারি */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 left-0 h-full w-1.5 bg-[#10B981]" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Delivery</p>
              <h3 className="text-2xl font-black text-slate-800">{stats.statusCounts.Completed}</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-[#10B981]">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* স্ট্যাটাস ইন্ডিকেটর ছোট স্ট্রিপ */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white border p-3 rounded-xl flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div className="text-xs"><span className="font-bold text-slate-700">{stats.statusCounts.Pending}</span> Pending</div>
        </div>
        <div className="bg-white border p-3 rounded-xl flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <div className="text-xs"><span className="font-bold text-slate-700">{stats.statusCounts.Paid}</span> Paid</div>
        </div>
        <div className="bg-white border p-3 rounded-xl flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <div className="text-xs"><span className="font-bold text-slate-700">{stats.statusCounts.Shipped}</span> Shipped</div>
        </div>
        <div className="bg-white border p-3 rounded-xl flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <div className="text-xs"><span className="font-bold text-slate-700">{stats.statusCounts.Completed}</span> Completed</div>
        </div>
        <div className="bg-white border p-3 rounded-xl flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="text-xs"><span className="font-bold text-slate-700">{stats.statusCounts.Cancelled}</span> Cancelled</div>
        </div>
      </div>

      {/* গ্রাফ ও চার্ট সেকশন */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ১. ডেইলি অর্ডার এবং সেলস টাইমলাইন গ্রাফ (লাইন ও বার কম্বো) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#FF6900]" />
              <h3 className="font-bold text-slate-800">Sales & Order Volumne (Last 30 Days)</h3>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.graphTimeline} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#94a3b8" style={{ fontSize: '11px' }} />
                <YAxis yAxisId="left" tickLine={false} axisLine={false} stroke="#94a3b8" style={{ fontSize: '11px' }} />
                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} stroke="#94a3b8" style={{ fontSize: '11px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar yAxisId="left" dataKey="orders" name="Total Orders" fill="#FF6900" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar yAxisId="right" dataKey="revenue" name="Revenue (৳)" fill="#0f172a" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ২. অর্ডার স্ট্যাটাস ব্রেকডাউন পাই চার্ট */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-slate-800">Order Share by Status</h3>
            <p className="text-xs text-slate-400">Proportional representation of current milestones.</p>
          </div>
          
          <div className="h-[240px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* ডোনাটের মাঝখানে টোটাল ডাটা কাউন্ট */}
            <div className="absolute text-center">
              <p className="text-xs font-semibold text-slate-400 uppercase">Total</p>
              <p className="text-2xl font-black text-slate-800">{stats.totalOrders}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t pt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] }} />
                <span className="text-slate-500 capitalize">{item.name}:</span>
                <span className="font-bold text-slate-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ৩. আলাদা করে ক্যানসেল এবং কমপ্লিটেড অর্ডারের গ্রাফিকাল ট্রেন্ড (লাইন চার্ট) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-slate-800">Order Success vs. Cancellation Velocity</h3>
          <p className="text-xs text-slate-400">Monitoring fulfilment health against bounce rates daily.</p>
        </div>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.graphTimeline} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#94a3b8" style={{ fontSize: '10px' }} />
              <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" style={{ fontSize: '10px' }} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff" }} />
              <Legend iconType="line" />
              <Line type="monotone" dataKey="completed" name="Completed Orders" stroke="#10B981" strokeWidth={3} dot={{ r: 2 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="cancelled" name="Cancelled Orders" stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 1 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}