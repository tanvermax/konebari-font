// components/layout/AdminLayoute/Orders/OrderFilters.tsx
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderFiltersProps {
  search: string;
  setSearch: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  paymentStatus: string;
  setPaymentStatus: (v: string) => void;
  orderType: string;
  setOrderType: (v: string) => void;
}

export default function OrderFilters({
  search,
  setSearch,
  status,
  setStatus,
  paymentStatus,
  setPaymentStatus,
  orderType,
  setOrderType,
}: OrderFiltersProps) {
  const hasFilters =
    search || status !== "all" || paymentStatus !== "all" || orderType !== "all";

  const reset = () => {
    setSearch("");
    setStatus("all");
    setPaymentStatus("all");
    setOrderType("all");
  };

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-rose-500" />
          <span className="text-sm font-semibold">Filters</span>
        </div>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="h-7 text-xs text-muted-foreground hover:text-rose-500 gap-1"
          >
            <X className="w-3 h-3" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 border-pink-200/50"
          />
        </div>

        {/* Order Status */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-10 border-pink-200/50">
            <SelectValue placeholder="Order Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">⏳ Pending</SelectItem>
            <SelectItem value="Paid">💰 Paid</SelectItem>
            <SelectItem value="Shipped">🚚 Shipped</SelectItem>
            <SelectItem value="Completed">✅ Completed</SelectItem>
            <SelectItem value="Cancelled">❌ Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* Payment Status */}
        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
          <SelectTrigger className="h-10 border-pink-200/50">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="Pending">⏳ Pending</SelectItem>
            <SelectItem value="Success">✅ Success</SelectItem>
            <SelectItem value="Failed">❌ Failed</SelectItem>
          </SelectContent>
        </Select>

        {/* Order Type */}
        <Select value={orderType} onValueChange={setOrderType}>
          <SelectTrigger className="h-10 border-pink-200/50">
            <SelectValue placeholder="Order Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="guest">👤 Guest</SelectItem>
            <SelectItem value="user">🎯 Registered</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}