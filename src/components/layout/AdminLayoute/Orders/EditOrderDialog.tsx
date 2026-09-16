// components/layout/AdminLayoute/Orders/EditOrderDialog.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { useUpdateOrderMutation } from "@/redux/features/order/Order.api";

interface EditOrderDialogProps {
  order: any;
  open: boolean;
  onClose: () => void;
}

interface IEditOrderForm {
  status: "Pending" | "Paid" | "Shipped" | "Completed" | "Cancelled";
  paymentStatus: "Pending" | "Success" | "Failed";
  courierName?: string;
  trackingId?: string;
  transactionId?: string;
}

export default function EditOrderDialog({
  order,
  open,
  onClose,
}: EditOrderDialogProps) {
  const [updateOrder, { isLoading }] = useUpdateOrderMutation();

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<IEditOrderForm>({
      defaultValues: {
        status: "Pending",
        paymentStatus: "Pending",
        courierName: "",
        trackingId: "",
        transactionId: "",
      },
    });

  useEffect(() => {
    if (order) {
      reset({
        status: order.status || "Pending",
        paymentStatus: order.paymentStatus || "Pending",
        courierName: order.courierName || "",
        trackingId: order.trackingId || "",
        transactionId: order.transactionId || "",
      });
    }
  }, [order, reset]);

  const onSubmit = async (data: IEditOrderForm) => {
    if (!order) return;
    try {
      await updateOrder({
        id: order._id,
        updateData: data,
      }).unwrap();

      toast.success("Order updated successfully ✨");
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update order");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Order Status */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Order Status *</Label>
            <Select
              value={watch("status")}
              onValueChange={(v) => setValue("status", v as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">⏳ Pending</SelectItem>
                <SelectItem value="Paid">💰 Paid</SelectItem>
                <SelectItem value="Shipped">🚚 Shipped</SelectItem>
                <SelectItem value="Completed">✅ Completed</SelectItem>
                <SelectItem value="Cancelled">❌ Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Status */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Payment Status *</Label>
            <Select
              value={watch("paymentStatus")}
              onValueChange={(v) => setValue("paymentStatus", v as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">⏳ Pending</SelectItem>
                <SelectItem value="Success">✅ Success</SelectItem>
                <SelectItem value="Failed">❌ Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Courier Name */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Courier Name</Label>
            <Input
              {...register("courierName")}
              placeholder="e.g. Pathao, Steadfast"
              className="h-10"
            />
          </div>

          {/* Tracking ID */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Order Tracking ID</Label>
            <Input
              {...register("trackingId")}
              placeholder="EK-..."
              className="h-10"
            />
          </div>

          {/* Transaction ID */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Transaction ID</Label>
            <Input
              {...register("transactionId")}
              placeholder="bKash/Nagad transaction ID"
              className="h-10"
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}