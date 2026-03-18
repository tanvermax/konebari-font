/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ausio from "../../../../assets/audio/mixkit-sci-fi-click-900.wav"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { Skeleton } from "@/components/ui/skeleton";
import { useAllOrderQuery, useConfirmOrderMutation, useConfirmOrdernonUserMutation, useDeleteOrderMutation, useUpdateOrderMutation } from '@/redux/features/order/Order.api';
import { toast } from 'sonner';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router';

const CartPage = () => {
    const { data: userInfo } = useUserInfoQuery(undefined);
    const { data: response, isLoading, refetch } = useAllOrderQuery(undefined);
    const [updateOrder] = useUpdateOrderMutation();
    const [confirmOrder] = useConfirmOrderMutation();
    const [deleteOrder] = useDeleteOrderMutation();
    const [confirmOrderNonuser] = useConfirmOrdernonUserMutation();
    const generateId = () => `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const navigate = useNavigate();

    const [cartData, setCartData] = useState({
        _id: "",
        orderedItems: [] as any[],
        totalPrice: 0,
        status: 'Pending'
    });
    // console.log(cartData)
    const [shippingArea, setShippingArea] = useState<"inside" | "outside">("inside");
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        paymentMethod: "cod"
    });

    const shippingCost = shippingArea === "inside" ? 60 : 120; // Example costs
    const grandTotal = cartData.totalPrice + shippingCost;

    const isFormValid = formData.name && formData.address && formData.phone;
    // console.log(cartData)
    useEffect(() => {
        if (userInfo?.data) {

            const pendingOrder = response?.data?.find((o: any) => o.status === 'Pending');
            if (pendingOrder) {
                setCartData({
                    _id: pendingOrder._id,
                    orderedItems: pendingOrder.orderedItems,
                    totalPrice: pendingOrder.totalPrice,
                    status: pendingOrder.status
                });
            }
        } else {

            const localItems = JSON.parse(localStorage.getItem('guestCart') || '[]');
            const total = localItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
            setCartData({
                _id: generateId(),
                orderedItems: localItems,
                totalPrice: total,
                status: 'Pending'
            });
        }
    }, [response, userInfo]);

    // console.log("response",response.data.map(orderedItems))
    console.log(cartData.orderedItems.map(item => item.product))

    const onUpdateQuantity = async (OrderId: string, newQuantity: number, productId: string) => {
        if (newQuantity < 1) return;

        if (!userInfo?.data) {

            const localItems = JSON.parse(localStorage.getItem('guestCart') || '[]');
            console.log("localItems", localItems);
            console.log("productId", productId);

            const updatedItems = localItems.map((item: any) => {
                if (item._id === productId) { // OrderId here refers to the specific item's ID
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });

            // Save updated list to localStorage
            localStorage.setItem('guestCart', JSON.stringify(updatedItems));

            // Recalculate total price
            const newTotal = updatedItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

            // Update React State to refresh UI
            setCartData(prev => ({
                ...prev,
                orderedItems: updatedItems,
                totalPrice: newTotal
            }));

            toast.success(`Quantity updated ${productId} to ${newQuantity}`);
        }
        else {
            const item = cartData.orderedItems.find(item => item.product._id === productId);

            if (!item) return;

            // toast(`...`);
            const updatedOrder = await updateOrder({ id: OrderId, updatedData: { quantity: newQuantity, productId: productId } })
            refetch()
            // console.log(updatedOrder?.data)
            if (updatedOrder?.data?.message === "Order data updated !") {
                toast.success(`Updated quantity for ${item.product.title} to ${newQuantity}`);

            }
        }

    };

    const handleConfirmOrder = async (orderedItems: any, formData: any, shippingArea: string, grandTotal: number) => {

        // 1. Logic for NON-LOGGED IN (Guest) Users
        if (!userInfo?.data) {
            const orderconfirm = await confirmOrderNonuser({
                id: cartData._id,
                updatedData: {
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    shippingArea,
                    grandTotal,
                    orderedItems,
                    status: "Shipped",
                },

            });

            console.log(orderconfirm.data)

            if (orderconfirm.data) {
                localStorage.removeItem('guestCart');
                window.dispatchEvent(new Event('cartUpdated'));
                toast.success(`Order Confirmed!`);
                const audio = new Audio(`${ausio}`);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                audio.play().catch(() => console.log("Audio play blocked by browser"));
                navigate("/thankyou");
            }
        }
        // 2. Logic for Logged-in Users
        else {
            const orderconfirm = await confirmOrder({
                id: cartData._id,
                updatedData: {
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    shippingArea,
                    grandTotal,
                    status: "Shipped",
                },
            });

            if (orderconfirm) {
                const audio = new Audio(`${ausio}`);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                audio.play().catch(() => console.log("Audio play blocked by browser"));
                toast.success(`Order Confirmed!`);
                navigate("/thankyou");
            }
        }
    };

    const onRemoveItem = async (itemId: string, orderId: string) => {

        if (!userInfo?.data) {
            // Get current items from localStorage
            const localItems = JSON.parse(localStorage.getItem('guestCart') || '[]');

            // Filter out the item with the matching ID
            const updatedItems = localItems.filter((item: any) => item._id !== itemId);

            // Update localStorage
            localStorage.setItem('guestCart', JSON.stringify(updatedItems));

            // Calculate new total price
            const newTotal = updatedItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

            // Update local state so the UI refreshes
            setCartData(prev => ({
                ...prev,
                orderedItems: updatedItems,
                totalPrice: newTotal
            }));

            // Optional: Trigger event for other components (like a Navbar badge)
            window.dispatchEvent(new Event('cartUpdated'));

            toast.success("Item removed from cart");
        }
        // 2. Logic for Logged-in Users (API Call)
        else {

            const res = await deleteOrder({ id: orderId, updatedData: { productId: itemId } });
            refetch()
            console.log(res?.data)
            if (res?.data) {
                toast(` ${itemId} ${res?.data.message}`);
            }
        }
    };

    if (isLoading)
        return <CartLoadingSkeleton />;

    if (!cartData.orderedItems.length) {
        return <EmptyCartView />;
    }

    return (
        <div className="container mx-auto px-4 py-6 md:py-10">
            <div className="mb-6 md:mb-10">
                <h1 className="text-2xl md:text-4xl font-bold text-primary mb-2">Shopping Cart</h1>
                <p className="text-muted-foreground">Review your items before checkout</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="overflow-hidden border shadow-sm rounded-2xl">
                        <div className="p-4 md:p-6 bg-muted/20 border-b">
                            <h2 className=" font-semibold">Items ({cartData?.orderedItems?.length})</h2>
                        </div>

                        {/* Mobile View Card List */}
                        <div className="md:hidden divide-y">
                            {cartData.orderedItems.map((item: any, index: number) => {
                                const productName = item.product?.["*Product Name(English)"] || item.title;
                                const productImage = item.product?.images || item.images;

                                return (
                                    <div key={item.product?._id || index} className="p-2 space-y-2">
                                        <div className="flex gap-4">
                                            <img
                                                src={productImage}
                                                alt={productName}
                                                className="w-20 h-20 object-cover rounded-lg border"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-sm line-clamp-2">{productName}</h3>
                                                <p className="text-primary font-bold mt-1">৳{item.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center border rounded-md">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(cartData?._id, item.quantity - 1, item?.product?._id ? item?.product?._id : item._id)} disabled={item.quantity <= 1}><Minus className="h-3 w-3" /></Button>
                                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(cartData?._id, item.quantity + 1, item?.product?._id ? item?.product?._id : item._id)}><Plus className="h-3 w-3" /></Button>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onRemoveItem(item?.product?._id ? item?.product?._id : item._id, cartData._id)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Desktop View Table */}
                        <div className="hidden md:block">
                            <Table className=''>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-center">Quantity</TableHead>
                                        <TableHead className="text-right">Total Price</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cartData.orderedItems.map((item: any, index: number) => (
                                        <TableRow key={item.product?._id || index}>
                                            <TableCell>
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={item.product?.images || item.images}
                                                        alt="product"
                                                        className="w-16 h-16 object-cover rounded border bg-white"
                                                    />
                                                    <div className="max-w-[300px]">
                                                        <p className="font-semibold text-sm line-clamp-1">
                                                            {item.product?.["*Product Name(English)"] || item.title}
                                                        </p>
                                                        <p className="text-xs font-medium">Unit: ৳{item.price}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-3">
                                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(cartData?._id, item.quantity - 1, item?.product?._id ? item?.product?._id : item._id)} disabled={item.quantity <= 1}><Minus className="h-3 w-3" /></Button>
                                                    <span className="font-bold">{item.quantity}</span>
                                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(cartData?._id, item.quantity + 1, item?.product?._id ? item?.product?._id : item._id)}><Plus className="h-3 w-3" /></Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-lg">
                                                ৳{(item.price * item.quantity).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="hover:bg-red-50 text-red-500" onClick={() => onRemoveItem(item?.product?._id ? item?.product?._id : item._id, cartData._id)}><Trash2 className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>


                {/* Summary Sidebar & Checkout Form */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-6 border-2 rounded-2xl shadow-md overflow-hidden">
                        <CardHeader className="bg-muted/30">
                            <CardTitle className="text-xl">Checkout Details</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {/* Customer Info */}
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Phone Number</label>
                                    <Input
                                        placeholder="017XXXXXXXX"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Full Address</label>
                                    <Input
                                        placeholder="House, Road, Area..."
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Separator />

                            {/* Shipping & Payment */}
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="md:text-sm font-medium">Shipping Area</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant={shippingArea === "inside" ? "default" : "outline"}
                                            className="text-[8px] md:text-xs"
                                            onClick={() => setShippingArea("inside")}
                                        >
                                            Inside Dhaka (৳60)
                                        </Button>
                                        <Button
                                            variant={shippingArea === "outside" ? "default" : "outline"}
                                            className="text-[8px] md:text-xs"
                                            onClick={() => setShippingArea("outside")}
                                        >
                                            Outside Dhaka (৳120)
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Payment Method</label>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 p-2 border rounded-md bg-primary/5 border-primary">
                                            <input type="radio" checked readOnly />
                                            <span className="text-sm font-medium">Cash on Delivery</span>
                                        </div>
                                        <div className="flex items-center space-x-2 p-2 border rounded-md opacity-50 cursor-not-allowed bg-muted">
                                            <input type="radio" disabled />
                                            <span className="text-sm font-medium text-muted-foreground">Online Payment (Coming Soon)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Calculations */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>৳{cartData.totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping Fee</span>
                                    <span>৳{shippingCost}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>Total Amount</span>
                                    <span className="text-primary">৳{grandTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/10 p-6">
                            <Button
                                className="w-full py-6 text-lg shadow-lg shadow-primary/20"
                                size="lg"
                                disabled={!isFormValid || cartData.orderedItems.length === 0}
                                onClick={() => handleConfirmOrder(cartData.orderedItems, formData, shippingArea, grandTotal)}
                            >
                                Confirm Order
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// Sub-components for cleaner code
const EmptyCartView = () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag className="w-20 h-20 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Button className="mt-4">Start Shopping</Button>
    </div>
);

const CartLoadingSkeleton = () => (
    <div className="container mx-auto px-4 py-10 space-y-8">
        <Skeleton className="h-10 w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-2 h-[400px]" />
            <Skeleton className="h-[300px]" />
        </div>
    </div>
);

export default CartPage;