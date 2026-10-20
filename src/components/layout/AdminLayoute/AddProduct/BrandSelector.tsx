// components/layout/AdminLayoute/AddProduct/BrandSelector.tsx
import { useState } from "react";
import { Check, ChevronsUpDown, Tag, Loader2 } from "lucide-react";
import { useGetActiveBrandsQuery } from "@/redux/features/brand/brand.api";
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

interface BrandSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function BrandSelector({
  value,
  onChange,
  placeholder = "Select brand...",
}: BrandSelectorProps) {
  const [open, setOpen] = useState(false);
  const { data: brands = [], isLoading } = useGetActiveBrandsQuery({ limit: 100 });

  const selectedBrand = brands.find(
    (b: any) => b.name === value || b._id === value
  );

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
              Loading brands...
            </span>
          ) : selectedBrand ? (
            <span className="flex items-center gap-2">
              {selectedBrand.logo && (
                <img
                  src={selectedBrand.logo}
                  alt={selectedBrand.name}
                  className="w-5 h-5 object-contain"
                />
              )}
              {selectedBrand.name}
            </span>
          ) : value ? (
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-pink-500" />
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
          <CommandInput placeholder="Search brand..." />
          <CommandList>
            <CommandEmpty>
              <div className="py-4 text-center text-xs text-muted-foreground">
                No brand found. Create one in Brand Management.
              </div>
            </CommandEmpty>
            <CommandGroup>
              {brands.map((brand: any) => (
                <CommandItem
                  key={brand._id}
                  value={brand.name}
                  onSelect={() => {
                    onChange(brand.name);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {brand.logo && (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-5 h-5 object-contain"
                      />
                    )}
                    <span>{brand.name}</span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === brand.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}