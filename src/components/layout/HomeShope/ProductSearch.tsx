// components/layout/HomeShope/ProductSearch.tsx
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/redux/hooks/useDebounce";

interface ProductSearchProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
  /** Debounce delay in ms (default 400ms) */
  delay?: number;
}

export default function ProductSearch({
  onSearch,
  placeholder = "Search products, brands...",
  initialValue = "",
  className = "",
  delay = 400,
}: ProductSearchProps) {
  const [localValue, setLocalValue] = useState(initialValue);
  const debouncedValue = useDebounce(localValue, delay);

  // ✅ Sync from outside
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  // ✅ Fire search only after debounce
  useEffect(() => {
    onSearch(debouncedValue.trim());
  }, [debouncedValue]);

  const handleClear = () => {
    setLocalValue("");
  };

  return (
    <div className={`relative flex-1 md:max-w-2xl ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        placeholder={placeholder}
        className="pl-10 pr-10 h-11"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full flex items-center justify-center hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}