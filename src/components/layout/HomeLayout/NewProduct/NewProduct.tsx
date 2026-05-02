/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import ProductCard from '../ProductCard/ProductCard';
import { useAllpstockQuery } from "@/redux/features/product/product.api";
import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export default function NewProduct() {
    // const { data } = useAllproductQuery(undefined);
    const { data, isLoading } = useAllpstockQuery({ limit: 20, page: 1 });


    // console.log(data);
    return (
        <div className="container mx-auto px-4">
            <div className="
            md:text-base text-[10px] px-2 flex
             justify-between items-center gap-4 my-10
            md:px-4 lg:px-6">
                <h1 className="
                text-xs md:text-2xl font-bold 
                ">
                    NEW PRODUCT
                </h1>
                <div>
                    <Link to={"/shop"}>
                        <Button className="md:text-md text-[10px]">
                            View All
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-10">
                {isLoading ? (
                    // Show Skeletons
                    Array.from({ length: 8 }).map((_, i) => (
                         <Card key={i} className="w-full max-w-xs">
                             <CardHeader><Skeleton className="h-4 w-2/3" /></CardHeader>
                             <CardContent><Skeleton className="aspect-square w-full" /></CardContent>
                         </Card>
                    ))
                ) : (
                    // No more .slice(0, 20) here! The data is already limited.
                    data?.data.map((product: any) => (
                        <ProductCard
                            key={product._id}
                            id={product._id}
                            SpecialPrice={product["*Price"]}
                            name={product["*Product Name(English)"]}
                            price={parseFloat(product["SpecialPrice"]) || 0}
                            image={product.images || "https://via.placeholder.com/300"}
                        />
                    ))
                )}
            </div>
            <div className="text-center ">
                <Link to={"/shop"}> <Button className="
                    md:text-md text-[10px]">
                    View All
                </Button></Link>
            </div>
        </div>
    );
}




