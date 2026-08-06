import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

interface AdminProductCardProps {
    id: string;
    name: string;
    price: number;              
    specialPrice?: number;
    hasDiscount?: boolean;
    inStock?: boolean;
    quantity?: number;           
    category?: string;
    image: string;               
    description?: string;        
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void; 
    isDeleting?: boolean;
}

export default function AdminProductCard({
    id,
    name,
    price,
    specialPrice,
    hasDiscount = false,
    inStock = true,
    quantity,
    category,
    image,
    description,
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

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card text-card-foreground transition-all duration-300 hover:shadow-md">
            {/* Image Wrapper */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
                <img
                    src={image || "https://via.placeholder.com/300"}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badges Overlay */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5 z-10">
                    <Badge variant="outline" className="bg-background/90 text-[10px] font-mono backdrop-blur-md border-border/50">
                        #{id.slice(-6)}
                    </Badge>
                    {!inStock && (
                        <Badge variant="destructive" className="text-[10px] rounded-md px-2">
                            Out of stock
                        </Badge>
                    )}
                </div>

                {category && (
                    <Badge variant="secondary" className="absolute top-2.5 right-2.5 text-[10px] bg-background/80 backdrop-blur-md border border-border/40 font-normal">
                        {category}
                    </Badge>
                )}
            </div>

            {/* Details */}
            <div className="p-4 space-y-3">
                <div>
                    <h3 className="text-sm font-medium line-clamp-1 text-foreground" title={name}>
                        {name}
                    </h3>
                    {description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{description}</p>
                    )}
                </div>

                <div className="flex items-baseline justify-between pt-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-base font-semibold text-foreground">
                            ৳{displayPrice.toLocaleString()}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-muted-foreground line-through">
                                ৳{safePrice.toLocaleString()}
                            </span>
                        )}
                    </div>
                    {quantity != null && (
                        <span className="text-[11px] text-muted-foreground font-mono">
                            Stock: {quantity}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-xl h-9 text-xs font-normal border-border/60 hover:bg-stone-100 dark:hover:bg-stone-800"
                        onClick={handleEdit}
                    >
                        <Pencil className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" /> Edit
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 rounded-xl h-9 text-xs font-normal text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>Deleting... <Spinner className="h-3.5 w-3.5 ml-1" /></>
                        ) : (
                            <><Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete</>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}