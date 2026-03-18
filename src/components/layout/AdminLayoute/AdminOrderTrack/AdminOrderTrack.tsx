/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import ausio from "../../../../assets/audio/mixkit-sci-fi-click-900.wav"
import { format, parseISO } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { io } from "socket.io-client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Package, MapPin, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useAdminupdateOrderMutation, useAllOrderForAdminQuery } from '@/redux/features/order/Order.api';

const socket = io(import.meta.env.VITE_BASE_URL);


export default function AdminOrderTrack() {
    const { data: orderResponse, isLoading } = useAllOrderForAdminQuery(undefined, {
        pollingInterval: 30000, // Checks every 30 seconds
        refetchOnFocus: true,   // Refetch when you click back onto the tab
    });
    const [updateOrder, { isLoading: isUpdating }] = useAdminupdateOrderMutation();

    const [courierName, setCourierName] = useState<{ [key: string]: string }>({});
    const [trackingInfo, setTrackingInfo] = useState<{ [key: string]: string }>({});


    const handleStatusChange = async (orderId: string, newStatus: string) => {
        const updatedData = {
            id: orderId,
            status: newStatus,
            trackingId: trackingInfo[orderId] || "N/A",
            courierName: courierName[orderId] || "N/A"
        };

        // console.log("প্রেরিত ডেটা:", updatedData); // ব্রাউজারের ইনসপেক্ট-এ চেক করুন

        try {
            // ২. সরাসরি একটি অবজেক্ট হিসেবে পাঠান
            const res = await updateOrder(updatedData).unwrap();

            if (res.success) {
                toast.success(`Order updated to ${newStatus}`);
            }
        } catch (err) {
            toast.error("Failed to update order.");
            console.log(err)
        }
    };

    const ordersList = orderResponse?.data || [];

    const prevOrderCount = useRef(ordersList.length);

    useEffect(() => {
        // If the new list is longer than the old list, a new order arrived!
        if (ordersList.length > prevOrderCount.current) {
            const newOrder = ordersList[0]; // Assuming newest is first

            // Play a notification sound (optional)
            const audio = new Audio(`${ausio}`);
            audio.play().catch(() => console.log("Audio play blocked by browser"));

            toast.success(`🎉 New Order Received! Order ID: #${newOrder._id}`, {
                duration: 5000,
                position: 'top-right',
            });
        }
        // Update the ref to the current length
        prevOrderCount.current = ordersList.length;
    }, [ordersList]);

    useEffect(() => {
        const handleNotification = (data: any) => {
            const audio = new Audio(`${ausio}`);
            audio.play().catch(() => console.log("Sound blocked until user interacts with page."));
            toast.success(`New Order: ${data.orderId}`);
        };

        socket.on("newOrderNotification", handleNotification);

        // Return a function that returns VOID
        return () => {
            socket.off("newOrderNotification", handleNotification);
        };
    }, []);
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100';
        }
    };

    if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-10 w-10 text-orange-500" /></div>;

    // console.log(ordersList)


    return (
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Package className="h-6 w-6 text-orange-600" />
                    Order Management
                </h2>
                <Badge variant="secondary">Total: {orderResponse?.meta?.total || 0}</Badge>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[120px]">Order & Items</TableHead>
                            <TableHead>Customer / Shipping</TableHead>
                            <TableHead>Order Details</TableHead>
                            <TableHead>Date & Billing</TableHead>
                            <TableHead>Courier Info</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ordersList.length > 0 ? (
                            ordersList.map((order: any) => (
                                <TableRow key={order._id} className="align-top">
                                    {/* Order ID & Basic Status */}
                                    <TableCell>
                                        <p className="font-bold text-xs mb-1">#{order._id.slice(-6).toUpperCase()}</p>
                                        <Badge className={`${getStatusColor(order.status)} text-[10px] px-2 py-0`}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>

                                    {/* Customer & Address */}
                                    <TableCell>
                                        <div className="text-xs space-y-1">
                                            <p className="font-bold uppercase">{order.shippingAddress?.name}</p>
                                            <p className="text-gray-600 font-medium">{order.shippingAddress?.phone}</p>
                                            <div className="flex items-start text-gray-500 max-w-[150px]">
                                                <MapPin className="h-3 w-3 mr-1 mt-0.5 shrink-0" />
                                                <span className="leading-relaxed">{order.shippingAddress?.address}</span>
                                            </div>
                                            <Badge variant="outline" className="text-[9px] uppercase">
                                                {order.shippingAddress?.shippingArea}
                                            </Badge>
                                        </div>
                                    </TableCell>

                                    {/* Ordered Products (Admin collection logic) */}
                                    <TableCell>
                                        <div className="space-y-3 min-w-[200px]">
                                            {order.orderedItems?.map((item: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-2 border-b border-gray-50 pb-2 last:border-0">
                                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded border bg-gray-50">
                                                        <img
                                                            src={item.product?.images || "/placeholder.png"}
                                                            alt="product"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="text-[11px] leading-tight">
                                                        <p className="font-semibold line-clamp-2 ">
                                                            {item.product?.["*Product Name(English)"] || "Unknown Product"}
                                                        </p>
                                                        <p className="text-orange-600 font-bold mt-1">
                                                            Qty: {item.quantity} × ৳{item.price}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>

                                    {/* Billing & Date */}
                                    <TableCell>
                                        <div className="text-xs space-y-1">
                                            <p className="text-gray-400 font-medium">
                                                {format(parseISO(order.createdAt), 'MMM dd, yyyy')}
                                            </p>
                                            <div className="pt-2">
                                                <p className="text-gray-500">Subtotal: ৳{order.totalPrice}</p>
                                                <p className="text-orange-600 font-bold text-sm">Total: ৳{order.grandTotal}</p>
                                            </div>
                                            <Badge className="text-[9px] bg-green-50 text-green-700 hover:bg-green-50">
                                                Pay: {order.paymentStatus}
                                            </Badge>
                                        </div>
                                    </TableCell>

                                    {/* Courier Info */}
                                    {
                                        !order.courierName || !order.trackingId ? <>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <Input
                                                        placeholder="Courier Name"
                                                        className="h-7 w-32 text-[10px]"
                                                        defaultValue={order.courierName}
                                                        onChange={(e) => setCourierName({ ...courierName, [order._id]: e.target.value })}
                                                    />
                                                    <Input
                                                        placeholder="Tracking ID"
                                                        className="h-7 w-32 text-[10px]"
                                                        defaultValue={order.trackingId}
                                                        onChange={(e) => setTrackingInfo({ ...trackingInfo, [order._id]: e.target.value })}
                                                    />
                                                </div>
                                            </TableCell>
                                        </> :
                                            <>
                                                <TableCell>
                                                    <p className="font-bold text-xs mb-1">{order.trackingId}</p>
                                                    <Badge >
                                                        {order.courierName}
                                                    </Badge>
                                                </TableCell>
                                            </>
                                    }


                                    {/* Actions */}
                                    <TableCell className="text-right">
                                        <div className="flex flex-col items-end gap-2">
                                            <Select
                                                defaultValue={order.status}
                                                onValueChange={(val) => handleStatusChange(order._id, val)}
                                            >
                                                <SelectTrigger className="w-[110px] h-8 text-[10px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Pending">Pending</SelectItem>
                                                    <SelectItem value="Completed">Completed</SelectItem>
                                                    <SelectItem value="Shipped">Shipped</SelectItem>
                                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Button
                                                size="sm"
                                                disabled={isUpdating}
                                                className="h-8 w-full bg-orange-600 hover:bg-orange-700 text-[10px]"
                                                onClick={() => handleStatusChange(order._id, order.status)}
                                            >
                                                {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : "Update Track"}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20 text-gray-400">
                                    <ShoppingCart className="mx-auto h-10 w-10 mb-2 opacity-20" />
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}