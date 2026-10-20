// components/layout/AdminLayoute/AddProduct/CategorySelector.tsx
import { useState } from "react";
import { Check, ChevronsUpDown, Layers, Loader2 } from "lucide-react";
import { useGetCategoriesQuery } from "@/redux/features/category/category.api";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CategorySelector({
  value,
  onChange,
  placeholder = "Select category...",
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const { data: categories = [], isLoading } = useGetCategoriesQuery();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10 border-pink-200/50 font-normal"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </span>
          ) : value ? (
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink-500" />
              {value}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>
              <div className="py-4 text-center text-xs text-muted-foreground">
                No category found. Create one in Category Management.
              </div>
            </CommandEmpty>
            <CommandGroup>
              {categories.map((cat) => (
                <CommandItem
                  key={cat._id}
                  value={cat.name}
                  onSelect={() => {
                    onChange(cat.name);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === cat.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {cat.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}