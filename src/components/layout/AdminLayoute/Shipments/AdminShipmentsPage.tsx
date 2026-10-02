// pages/admin/Shipments/AdminShipmentsPage.tsx
"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  MapPin,
  Phone,
  User,
  Copy,
  Check,
  Building2,
  AlertCircle,

  Layers,
} from "lucide-react";
import {
  Card,
  CardContent,

} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { useGetAllOrdersQuery } from "@/redux/features/order/Order.api";

// ============================================
// ✅ Animation variants
// ============================================
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

// ============================================
// ✅ SHIPMENT STATUS CONFIG
// ============================================
type ShipmentStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

const SHIPMENT_STATUS_CONFIG: Record<
  ShipmentStatus,
  {
    label: string;
    icon: any;
    bg: string;
    text: string;
    border: string;
    dot: string;
  }
> = {
  Pending: {
    label: "Pending",
    icon: Clock,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  Processing: {
    label: "Processing",
    icon: Package,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  Shipped: {
    label: "Shipped",
    icon: Truck,
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  "In Transit": {
    label: "In Transit",
    icon: Truck,
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    dot: "bg-indigo-500",
  },
  Delivered: {
    label: "Delivered",
    icon: CheckCircle,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  Cancelled: {
    label: "Cancelled",
    icon: XCircle,
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
};

// ============================================
// ✅ HELPERS
// ============================================
const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ✅ Map order status → shipment status
const mapOrderStatusToShipment = (orderStatus: string): ShipmentStatus => {
  const map: Record<string, ShipmentStatus> = {
    Pending: "Pending",
    Confirmed: "Processing",
    Processing: "Processing",
    Shipped: "Shipped",
    Completed: "Delivered",
    Cancelled: "Cancelled",
  };
  return map[orderStatus] || "Pending";
};

// ============================================
// ✅ MAIN COMPONENT
// ============================================
export default function AdminShipmentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [courierFilter, setCourierFilter] = useState("all");
  const [viewingShipment, setViewingShipment] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ✅ Fetch all orders (shipments derive from orders)
  const { data, isLoading, isError, refetch, isFetching } =
    useGetAllOrdersQuery(undefined, {
      pollingInterval: 30000, // refresh every 30s
    });

  // ✅ Extract orders
  const orders = useMemo(() => {
    const raw = data?.data || data || [];
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  // ✅ Transform orders → shipments
  const shipments = useMemo(() => {
    return orders.map((order: any) => {
      const shipmentStatus = mapOrderStatusToShipment(order.status);
      return {
        _id: order._id,
        trackingId: order.trackingId || `EK-${order._id?.slice(-8)}`,
        orderId: order._id,
        customer: order.customer || {},
        items: order.orderedItems || [],
        itemCount: (order.orderedItems || []).length,
        total: order.totalPrice || 0,
        status: shipmentStatus,
        orderStatus: order.status,
        courierName: order.courierName || "Not assigned",
        paymentMethod: order.paymentMethod || "COD",
        paymentStatus: order.paymentStatus || "Pending",
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        estimatedDelivery: order.estimatedDelivery,
        address: order.customer?.address || order.shippingAddress?.address || "",
        city: order.customer?.city || order.shippingAddress?.city || "",
        phone: order.customer?.phone || order.shippingAddress?.phone || "",
      };
    });
  }, [orders]);

  // ✅ Filter shipments
  const filteredShipments = useMemo(() => {
    let result = [...shipments];

    // Tab filter
    if (activeTab === "pending") {
      result = result.filter((s) =>
        ["Pending", "Processing"].includes(s.status)
      );
    } else if (activeTab === "in-transit") {
      result = result.filter((s) =>
        ["Shipped", "In Transit"].includes(s.status)
      );
    } else if (activeTab === "delivered") {
      result = result.filter((s) => s.status === "Delivered");
    } else if (activeTab === "cancelled") {
      result = result.filter((s) => s.status === "Cancelled");
    }

    // Courier filter
    if (courierFilter !== "all") {
      result = result.filter(
        (s) => s.courierName.toLowerCase() === courierFilter.toLowerCase()
      );
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((s) => {
        const haystack = [
          s.trackingId,
          s._id,
          s.customer?.name,
          s.customer?.phone,
          s.customer?.email,
          s.customer?.city,
          s.courierName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }

    return result;
  }, [shipments, activeTab, courierFilter, search]);

  // ✅ Stats
  const stats = useMemo(() => {
    const total = shipments.length;
    const pending = shipments.filter((s) =>
      ["Pending", "Processing"].includes(s.status)
    ).length;
    const inTransit = shipments.filter((s) =>
      ["Shipped", "In Transit"].includes(s.status)
    ).length;
    const delivered = shipments.filter((s) => s.status === "Delivered").length;
    const cancelled = shipments.filter((s) => s.status === "Cancelled").length;

    return { total, pending, inTransit, delivered, cancelled };
  }, [shipments]);

  // ✅ Get unique couriers
  const couriers = useMemo(() => {
    const set = new Set<string>();
    shipments.forEach((s) => {
      if (s.courierName && s.courierName !== "Not assigned") {
        set.add(s.courierName);
      }
    });
    return Array.from(set);
  }, [shipments]);

  // ✅ Copy tracking ID
  const handleCopyTracking = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Tracking ID copied");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ✅ LOADING
  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  // ✅ ERROR
  if (isError) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <h2 className="text-lg font-bold">Failed to Load Shipments</h2>
            <p className="text-sm text-muted-foreground">
              Something went wrong. Please try again.
            </p>
            <Button onClick={() => refetch()} className="rounded-xl">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
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
              Shipments
            </span>
            <Truck className="w-6 h-6 text-pink-500" />
          </h1>
          <p className="text-muted-foreground text-sm">
            Track and manage all product shipments
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded-xl gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </motion.div>

      {/* ============================================
          STATS CARDS
         ============================================ */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        {[
          {
            title: "Total",
            value: stats.total,
            icon: Layers,
            iconBg: "bg-pink-500",
            gradient: "from-pink-500/20 to-pink-500/5",
          },
          {
            title: "Pending",
            value: stats.pending,
            icon: Clock,
            iconBg: "bg-amber-500",
            gradient: "from-amber-500/20 to-amber-500/5",
          },
          {
            title: "In Transit",
            value: stats.inTransit,
            icon: Truck,
            iconBg: "bg-blue-500",
            gradient: "from-blue-500/20 to-blue-500/5",
          },
          {
            title: "Delivered",
            value: stats.delivered,
            icon: CheckCircle,
            iconBg: "bg-emerald-500",
            gradient: "from-emerald-500/20 to-emerald-500/5",
          },
          {
            title: "Cancelled",
            value: stats.cancelled,
            icon: XCircle,
            iconBg: "bg-rose-500",
            gradient: "from-rose-500/20 to-rose-500/5",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all rounded-2xl relative group">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                />
                <CardContent className="relative p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {stat.title}
                      </p>
                      <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
                        {stat.value}
                      </h3>
                    </div>
                    <div
                      className={`p-2.5 rounded-xl ${stat.iconBg} shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ============================================
          FILTERS
         ============================================ */}
      <motion.div variants={fadeIn} initial="initial" animate="animate">
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by tracking ID, name, phone, city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 border-pink-200/50 rounded-xl"
                />
              </div>

              {/* Courier filter */}
              <Select
                value={courierFilter}
                onValueChange={setCourierFilter}
              >
                <SelectTrigger className="h-10 border-pink-200/50 rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by courier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Couriers</SelectItem>
                  {couriers.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================
          TABS + TABLE
         ============================================ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-5 bg-stone-100 dark:bg-stone-900 p-1 rounded-xl">
          <TabsTrigger
            value="all"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs"
          >
            All ({stats.total})
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs"
          >
            Pending ({stats.pending})
          </TabsTrigger>
          <TabsTrigger
            value="in-transit"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs"
          >
            In Transit ({stats.inTransit})
          </TabsTrigger>
          <TabsTrigger
            value="delivered"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs"
          >
            Delivered ({stats.delivered})
          </TabsTrigger>
          <TabsTrigger
            value="cancelled"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs"
          >
            Cancelled ({stats.cancelled})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              {filteredShipments.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto">
                    <Truck className="w-8 h-8 text-pink-500" />
                  </div>
                  <h3 className="font-bold text-lg">No Shipments Found</h3>
                  <p className="text-sm text-muted-foreground">
                    {search || courierFilter !== "all"
                      ? "Try adjusting your filters"
                      : "No shipments in this category"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-stone-50 dark:bg-stone-900/60">
                      <TableRow>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">
                          Tracking ID
                        </TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">
                          Customer
                        </TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">
                          Destination
                        </TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">
                          Courier
                        </TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">
                          Items
                        </TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">
                          Status
                        </TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">
                          Date
                        </TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {filteredShipments.map((shipment: any, idx: number) => {
                          const config =
                            SHIPMENT_STATUS_CONFIG[shipment.status as ShipmentStatus];
                          const StatusIcon = config.icon;

                          return (
                            <motion.tr
                              key={shipment._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ delay: idx * 0.02 }}
                              className="hover:bg-pink-50/30 dark:hover:bg-zinc-900/30 transition-colors"
                            >
                              {/* Tracking ID */}
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-semibold">
                                    {shipment.trackingId}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleCopyTracking(shipment.trackingId)
                                    }
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    {copiedId === shipment.trackingId ? (
                                      <Check className="w-3 h-3 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-3 h-3 text-muted-foreground hover:text-pink-500" />
                                    )}
                                  </button>
                                </div>
                              </TableCell>

                              {/* Customer */}
                              <TableCell>
                                <div className="space-y-0.5">
                                  <p className="text-xs font-medium">
                                    {shipment.customer?.name || "Guest"}
                                  </p>
                                  {shipment.customer?.phone && (
                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                      <Phone className="w-2.5 h-2.5" />
                                      {shipment.customer.phone}
                                    </p>
                                  )}
                                </div>
                              </TableCell>

                              {/* Destination */}
                              <TableCell>
                                <div className="space-y-0.5">
                                  <p className="text-xs flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-pink-500" />
                                    {shipment.city || "—"}
                                  </p>
                                  {shipment.address && (
                                    <p className="text-[10px] text-muted-foreground line-clamp-1 max-w-[140px]">
                                      {shipment.address}
                                    </p>
                                  )}
                                </div>
                              </TableCell>

                              {/* Courier */}
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] ${
                                    shipment.courierName === "Not assigned"
                                      ? "border-zinc-300 text-zinc-500"
                                      : "border-pink-300 text-pink-600 bg-pink-50"
                                  }`}
                                >
                                  <Building2 className="w-2.5 h-2.5 mr-1" />
                                  {shipment.courierName}
                                </Badge>
                              </TableCell>

                              {/* Items */}
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Package className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs font-medium">
                                    {shipment.itemCount}
                                  </span>
                                </div>
                              </TableCell>

                              {/* Status */}
                              <TableCell>
                                <Badge
                                  className={`${config.bg} ${config.text} ${config.border} border text-[10px] gap-1`}
                                >
                                  <StatusIcon className="w-2.5 h-2.5" />
                                  {config.label}
                                </Badge>
                              </TableCell>

                              {/* Date */}
                              <TableCell>
                                <div className="space-y-0.5">
                                  <p className="text-xs font-medium">
                                    {formatDate(shipment.createdAt)}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground">
                                    {formatDateTime(shipment.updatedAt)}
                                  </p>
                                </div>
                              </TableCell>

                              {/* Actions */}
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    setViewingShipment(shipment)
                                  }
                                  className="h-7 px-2 rounded-lg text-pink-600 hover:bg-pink-50"
                                >
                                  <Eye className="w-3.5 h-3.5 mr-1" />
                                  View
                                </Button>
                              </TableCell>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results count */}
          {filteredShipments.length > 0 && (
            <p className="text-xs text-muted-foreground mt-3 px-1">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredShipments.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {shipments.length}
              </span>{" "}
              shipments
            </p>
          )}
        </TabsContent>
      </Tabs>

      {/* ============================================
          VIEW SHIPMENT DETAILS DIALOG
         ============================================ */}
      <Dialog
        open={!!viewingShipment}
        onOpenChange={() => setViewingShipment(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          {viewingShipment && (
            <>
              {/* Header */}
              <DialogHeader className="p-6 border-b bg-gradient-to-r from-pink-50 to-rose-50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                      <Truck className="w-5 h-5 text-pink-500" />
                      Shipment Details
                    </DialogTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        Tracking ID:
                      </span>
                      <span className="font-mono text-sm font-bold">
                        {viewingShipment.trackingId}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleCopyTracking(viewingShipment.trackingId)
                        }
                        className="h-6 w-6"
                      >
                        {copiedId === viewingShipment.trackingId ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Badge
                    className={`${
                      SHIPMENT_STATUS_CONFIG[viewingShipment.status as ShipmentStatus].bg
                    } ${
                      SHIPMENT_STATUS_CONFIG[viewingShipment.status as ShipmentStatus].text
                    } border`}
                  >
                    {viewingShipment.status}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="p-6 space-y-6">
                {/* Timeline */}
                <div className="p-4 rounded-xl bg-stone-50 border">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-3">
                    Shipment Progress
                  </p>
                  <div className="flex items-center gap-1">
                    {[
                      "Pending",
                      "Processing",
                      "Shipped",
                      "In Transit",
                      "Delivered",
                    ].map((step, i) => {
                      const currentIdx = [
                        "Pending",
                        "Processing",
                        "Shipped",
                        "In Transit",
                        "Delivered",
                      ].indexOf(viewingShipment.status);
                      const isDone = i <= currentIdx;
                      const isCurrent = i === currentIdx;

                      return (
                        <div
                          key={step}
                          className="flex items-center flex-1"
                        >
                          <div className="flex flex-col items-center w-full">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                isDone
                                  ? "bg-pink-500 text-white"
                                  : "bg-stone-200 text-stone-400"
                              } ${
                                isCurrent
                                  ? "ring-4 ring-pink-200 animate-pulse"
                                  : ""
                              }`}
                            >
                              {isDone ? <Check className="w-3 h-3" /> : i + 1}
                            </div>
                            <span
                              className={`text-[9px] mt-1.5 font-medium ${
                                isDone
                                  ? "text-pink-600"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                          {i < 4 && (
                            <div
                              className={`h-0.5 flex-1 -mt-5 ${
                                i < currentIdx ? "bg-pink-500" : "bg-stone-200"
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Customer info */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-xl border">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1">
                      <User className="w-3 h-3 text-pink-500" />
                      Customer
                    </p>
                    <p className="text-sm font-semibold">
                      {viewingShipment.customer?.name || "Guest"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {viewingShipment.customer?.email || "—"}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" />
                      {viewingShipment.customer?.phone || "—"}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-pink-500" />
                      Destination
                    </p>
                    <p className="text-sm">{viewingShipment.address}</p>
                    <p className="text-xs font-semibold text-pink-600 mt-1">
                      {viewingShipment.city}
                    </p>
                  </div>
                </div>

                {/* Courier + payment */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-xl border">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-pink-500" />
                      Courier
                    </p>
                    <Badge className="bg-pink-100 text-pink-700 border-0">
                      {viewingShipment.courierName}
                    </Badge>
                  </div>

                  <div className="p-4 rounded-xl border">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">
                      Payment
                    </p>
                    <p className="text-sm font-medium">
                      {viewingShipment.paymentMethod}
                    </p>
                    <Badge
                      className={`${
                        viewingShipment.paymentStatus === "Paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : viewingShipment.paymentStatus === "Failed"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                      } border-0 text-[10px] mt-1`}
                    >
                      {viewingShipment.paymentStatus}
                    </Badge>
                  </div>
                </div>

                {/* Items */}
                {viewingShipment.items.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">
                      Items ({viewingShipment.items.length})
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {viewingShipment.items.map((item: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-2 border rounded-lg"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                            <img
                              src={item.productImage || item.image}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                              {item.productName}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {item.quantity} × ৳{item.price}
                            </p>
                          </div>
                          <p className="text-xs font-bold text-pink-600">
                            ৳{item.price * item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 flex items-center justify-between">
                  <span className="text-sm font-semibold">Order Total</span>
                  <span className="text-xl font-black text-pink-600">
                    ৳{viewingShipment.total.toLocaleString()}
                  </span>
                </div>

                {/* Date info */}
                <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground block">
                      Created
                    </span>
                    {formatDateTime(viewingShipment.createdAt)}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block">
                      Last Updated
                    </span>
                    {formatDateTime(viewingShipment.updatedAt)}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}