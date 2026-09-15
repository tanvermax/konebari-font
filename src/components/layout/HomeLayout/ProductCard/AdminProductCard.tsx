import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Tag, ShoppingCart } from "lucide-react";

interface AdminProductCardProps {
  id: string;
  name: string;
  nameBn?: string;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  specialPrice?: number;
  hasDiscount?: boolean;
  inStock?: boolean;
  quantity?: number;
  category?: string;
  image: string;
  description?: string;
  variantCount?: number;
  status?: 'active' | 'inactive';
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  isDeleting?: boolean;
}

export default function AdminProductCard({
  id,
  name,
  nameBn,
  price,
  minPrice,
  maxPrice,
  specialPrice,
  hasDiscount = false,
  inStock = true,
  quantity = 0,
  category,
  image,
  description,
  variantCount = 1,
  status = 'active',
  onDelete,
  onEdit,
  isDeleting = false,
}: AdminProductCardProps) {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (onDelete && window.confirm(`Are you sure you want to delete "${name}"?`)) {
      onDelete(id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(id);
    } else {
      navigate(`/admin/products/edit/${id}`);
    }
  };

  const safePrice = price ?? 0;
  const displayPrice = hasDiscount && specialPrice != null ? specialPrice : safePrice;
  const priceRange = minPrice !== undefined && maxPrice !== undefined && minPrice !== maxPrice 
    ? `৳${minPrice} - ৳${maxPrice}` 
    : `৳${displayPrice}`;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card text-card-foreground transition-all duration-300 hover:shadow-lg hover:border-pink-200/50">
      {/* Image Wrapper */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-pink-50/30 to-purple-50/30 dark:from-pink-950/10 dark:to-purple-950/10">
        <img
          src={image || "https://via.placeholder.com/300x300?text=No+Image"}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5 z-10">
          <Badge variant="outline" className="bg-background/90 text-[10px] font-mono backdrop-blur-md border-border/50">
            #{id.slice(-6)}
          </Badge>
          
          {status === 'active' ? (
            <Badge className="text-[10px] rounded-md px-2 bg-green-500/90 text-white border-0">
              Active
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-[10px] rounded-md px-2">
              Inactive
            </Badge>
          )}

          {!inStock && (
            <Badge variant="destructive" className="text-[10px] rounded-md px-2 bg-amber-500/90">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Variant Count */}
        {variantCount > 1 && (
          <Badge variant="secondary" className="absolute bottom-2.5 right-2.5 text-[10px] bg-background/80 backdrop-blur-md border border-border/40 font-normal">
            {variantCount} Variants
          </Badge>
        )}
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        {/* Name & Category */}
        <div>
          <h3 className="text-sm font-semibold text-foreground line-clamp-1" title={name}>
            {name}
          </h3>
          {nameBn && (
            <p className="text-xs text-muted-foreground line-clamp-1" title={nameBn}>
              {nameBn}
            </p>
          )}
          {category && (
            <Badge variant="secondary" className="mt-1.5 text-[10px] bg-pink-50/50 dark:bg-pink-950/20 border-pink-200/30">
              <Tag className="w-2.5 h-2.5 mr-1" />
              {category}
            </Badge>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Price & Stock */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-foreground">
                {priceRange}
              </span>
              {hasDiscount && specialPrice != null && (
                <span className="text-xs text-muted-foreground line-through">
                  ৳{safePrice.toLocaleString()}
                </span>
              )}
            </div>
            {minPrice !== undefined && maxPrice !== undefined && minPrice !== maxPrice && (
              <span className="text-[10px] text-muted-foreground">
                Price range
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 text-xs font-mono ${inStock ? 'text-green-600' : 'text-red-500'}`}>
              <ShoppingCart className="w-3 h-3" />
              {quantity}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/40">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 rounded-xl h-9 text-xs font-medium border-border/60 hover:bg-pink-50 hover:border-pink-200 dark:hover:bg-pink-950/20 transition-all"
            onClick={handleEdit}
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5 text-pink-500" /> 
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 rounded-xl h-9 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner className="h-3.5 w-3.5 mr-1.5" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5 mr-1.5" /> 
                Delete
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}