/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Package, Phone, Trash2, Edit3 } from "lucide-react";
import { toast } from "sonner";
import {
  useAdminupdateOrderMutation,
  useAllOrderForAdminQuery,
} from "@/redux/features/order/Order.api";

export default function AdminOrderTrack() {
  const { data: orderResponse, isLoading } = useAllOrderForAdminQuery(
    undefined,
    {
      pollingInterval: 30000,
      refetchOnFocus: true,
    },
  );
  const [updateOrder] = useAdminupdateOrderMutation();

  // Local states for inputs and UI control
  const [courierName, setCourierName] = useState<{ [key: string]: string }>({});
  const [trackingInfo, setTrackingInfo] = useState<{ [key: string]: string }>(
    {},
  );
  const [editingLogistics, setEditingLogistics] = useState<{
    [key: string]: boolean;
  }>({});
  const [localUpdating, setLocalUpdating] = useState<{
    [key: string]: boolean;
  }>({});

  const ordersList = orderResponse?.data || [];

  const handleStatusChange = async (
    orderId: string,
    newStatus: string,
    isDelete: boolean = false,
  ) => {
    setLocalUpdating((prev) => ({ ...prev, [orderId]: true }));

    const updatedData = {
      id: orderId,
      status: newStatus,
      trackingId: isDelete ? "N/A" : trackingInfo[orderId] || "N/A",
      courierName: isDelete ? "N/A" : courierName[orderId] || "N/A",
    };

    try {
      const res = await updateOrder(updatedData).unwrap();
      if (res.success) {
        toast.success(
          isDelete ? "Logistics Reset" : `Order #${orderId.slice(-4)} Synced`,
        );
        setEditingLogistics((prev) => ({ ...prev, [orderId]: false }));
      }
    } catch (err) {
      toast.error("Network error. Try again.");
    } finally {
      setLocalUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  // --- Animations ---
  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
  };

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );

    console.log(ordersList);

  return (
    <div className="space-y-6 p-4 max-w-[1600px] mx-auto">
      {/* Dynamic Header */}
      <header className="flex items-end justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Package className="text-orange-500" /> Dispatch Hub
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Real-time logistics management
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Active Orders
            </p>
            <p className="text-2xl font-black text-slate-900">
              {ordersList.length}
            </p>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="font-bold text-slate-500 py-4 pl-6">
                Order
              </TableHead>
              <TableHead className="font-bold text-slate-500">
                Customer
              </TableHead>
              <TableHead className="font-bold text-slate-500">
                Inventory
              </TableHead>
              <TableHead className="font-bold text-slate-500">
                Logistics
              </TableHead>
              <TableHead className="font-bold text-slate-500">Total</TableHead>
              <TableHead className="text-right font-bold text-slate-500 pr-8">
                Control
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {ordersList.map((order: any, index: number) => (
                <motion.tr
                  key={order._id}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  transition={{ delay: index * 0.03 }}
                  className="group hover:bg-orange-50/30 transition-colors border-b border-slate-50 last:border-none"
                >
                  {/* Order ID & Badge */}
                  <TableCell className="pl-6 py-6 align-top">
                    <div className="flex flex-col gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-400">
                        #{order._id.slice(-8)}
                      </span>
                      <Badge
                        className={`w-fit shadow-none border ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Customer - Hover Reveal */}
                  <TableCell className="align-top py-6">
                    <div className="flex flex-col gap-1 max-w-[180px]">
                      <span className="font-bold text-slate-800 text-sm truncate uppercase">
                        {order.shippingAddress?.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="h-3 w-3" />
                        <span className="text-[11px] font-medium">
                          {order.shippingAddress?.phone}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 line-clamp-1 group-hover:line-clamp-none transition-all">
                        {order.shippingAddress?.address}
                      </div>
                    </div>
                  </TableCell>

                  {/* Dynamic Items List */}
                  <TableCell className="align-top py-6">
                    <div className="space-y-3">
                      {order.orderedItems.map((item: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 group/item"
                        >
                          <div className="h-9 w-9 rounded-lg border bg-slate-50 overflow-hidden shrink-0">
                            <img
                              src={item.product?.images}
                              className="object-cover h-full w-full"
                              alt=""
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-slate-700 truncate w-[160px] group-hover/item:w-[250px] transition-all">
                              {item.product.name}
                            </p>
                            <p className="text-[10px] text-orange-600 font-bold">
                              Qty {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                      {/* {order.orderedItems?.length > 2 && (
                                                <p className="text-[10px] font-bold text-slate-400 pl-12">+ {order.orderedItems.length - 2} more items</p>
                                            )} */}
                    </div>
                  </TableCell>

                  {/* Logistics with Inline Edit */}
                  <TableCell className="align-top py-6">
                    <div className="w-[180px]">
                      {!order.courierName ||
                      order.courierName === "N/A" ||
                      editingLogistics[order._id] ? (
                        <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-left-2">
                          <Input
                            placeholder="Courier"
                            className="h-7 text-[10px] focus-visible:ring-orange-500"
                            defaultValue={
                              order.courierName !== "N/A"
                                ? order.courierName
                                : ""
                            }
                            onChange={(e) =>
                              setCourierName({
                                ...courierName,
                                [order._id]: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="ID"
                            className="h-7 text-[10px] focus-visible:ring-orange-500"
                            defaultValue={
                              order.trackingId !== "N/A" ? order.trackingId : ""
                            }
                            onChange={(e) =>
                              setTrackingInfo({
                                ...trackingInfo,
                                [order._id]: e.target.value,
                              })
                            }
                          />
                        </div>
                      ) : (
                        <div className="relative group/logistic p-2 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                              {order.courierName}
                            </span>
                            <div className="flex gap-2 opacity-0 group-hover/logistic:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  setEditingLogistics({
                                    ...editingLogistics,
                                    [order._id]: true,
                                  })
                                }
                                className="text-blue-500 hover:scale-110"
                              >
                                <Edit3 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    order._id,
                                    order.status,
                                    true,
                                  )
                                }
                                className="text-rose-500 hover:scale-110"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-[11px] font-bold text-slate-700 truncate">
                            {order.trackingId}
                          </p>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-bold text-slate-900">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </TableCell>
                  {/* Action Control */}
                  <TableCell className="text-right py-6 pr-8 align-top">
                    <div className="inline-flex flex-col gap-2">
                      <Select
                        defaultValue={order.status}
                        onValueChange={(val) =>
                          handleStatusChange(order._id, val)
                        }
                      >
                        <SelectTrigger className="h-8 w-[130px] text-[10px] font-bold border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Pending", "Shipped", "Completed", "Cancelled"].map(
                            (s) => (
                              <SelectItem
                                key={s}
                                value={s}
                                className="text-[11px] font-bold"
                              >
                                {s}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusChange(order._id, order.status)
                        }
                        disabled={localUpdating[order._id]}
                        className="h-8 bg-slate-900 hover:bg-orange-600 text-[10px] font-bold transition-all shadow-lg shadow-slate-100"
                      >
                        {localUpdating[order._id] ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Sync Logistics"
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-amber-50 text-amber-600 border-amber-100";
    case "Shipped":
      return "bg-blue-50 text-blue-600 border-blue-100";
    case "Completed":
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "Cancelled":
      return "bg-rose-50 text-rose-600 border-rose-100";
    default:
      return "bg-slate-50 text-slate-500";
  }
};
