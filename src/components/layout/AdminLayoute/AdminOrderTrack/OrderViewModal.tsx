import { X } from "lucide-react";

export default function OrderViewModal({ order, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-[500px] p-5 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3"
        >
          <X />
        </button>

        <h2 className="text-lg font-bold mb-3">
          Order #{order._id.slice(-6)}
        </h2>

        <div className="space-y-2 text-sm">
          <p><b>Name:</b> {order.shippingAddress?.name}</p>
          <p><b>Phone:</b> {order.shippingAddress?.phone}</p>
          <p><b>Address:</b> {order.shippingAddress?.address}</p>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Items</h3>
          {order.orderedItems.map((item: any, i: number) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{item.product?.name}</span>
              <span>
                {item.quantity} × {item.price}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 font-bold text-orange-600">
          Total: ৳{order.grandTotal}
        </div>
      </div>
    </div>
      );
}
