export type OrderStatus =
  | "Pending"
  | "Paid"
  | "Shipped"
  | "Completed"
  | "Cancelled";

export interface Product {
  _id: string;
  "*Product Name(English)": string;
  "*Price": number;
  images: string;
  "Variations Combo"?: string;
}

export interface OrderedItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  name: string;
  phone: number;
  address: string;
  shippingArea: "inside" | "outside";
}

export interface Order {
  _id: string;
  orderedItems: OrderedItem[];
  totalPrice: number;
  grandTotal: number;
  status: OrderStatus;
  paymentStatus: string;
  shippingAddress: ShippingAddress;
  createdAt: string;
}
