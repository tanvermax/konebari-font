// components/layout/HomeLayout/ProductCard/ProductCard.tsx
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    oldPrice?: number;
    images: string;
    description: string;
    onDelete?: (id: string) => void; // Add onDelete callback
    isDeleting?: boolean; // Add loading state
    isLoading?: boolean; // Add loading state
}

export default function AdminProductCard({ 
    id, 
    name, 
    price, 
    oldPrice, 
    images, 
    description, 
    onDelete,
    isDeleting = false 
}: ProductCardProps) {
    
    const handleDelete = () => {
        if (onDelete && window.confirm(`Are you sure you want to delete "${name}"?`)) {
            onDelete(id);
        }
    };

    return (
        <div className="card  bg-base-100 shadow-xl border overflow-hidden">
            <img
                src={images}
                alt={name}
                width={400}
                height={400}
                className="w-full h-[20vh] "
            />
            <div className="card-body p-4">
                <h2 className="card-title text-sm">{name}</h2>
                <p className="text-xs text-gray-600 truncate">{description}</p>
                <div className="flex items-center gap-2">
                    {oldPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            ${oldPrice.toFixed(2)}
                        </span>
                    )}
                    <span className="text-base font-semibold text-red-600">
                        ${price.toFixed(2)}
                    </span>
                </div>
                <div className="card-actions flex justify-between mt-2">
                    {/* <Button 
                        className="btn btn-sm btn-primary"
                    >
                        Add to Cart
                    </Button> */}
                    <Button 
                        className="btn btn-sm btn-error"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        variant="destructive"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                        {isDeleting && <Spinner/>}
                    </Button>
                </div>
            </div>
        </div>
    );
}