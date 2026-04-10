import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface ProductSearchProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
}

export default function ProductSearch({
  onSearch,
  placeholder = "Search products...",
  initialValue = "",
  className = "",
}: ProductSearchProps) {
  const [localValue, setLocalValue] = useState(initialValue);

  // Sync local state if initialValue changes from outside
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  const handleChange = (val: string) => {
    setLocalValue(val);
    onSearch(val); // Pass value to parent
  };

  return (
    <div className={`relative flex-1 md:max-w-2xl ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-10 h-11"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}