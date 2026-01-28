// hooks/useTextTruncate.ts
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useCart } from '@/redux/hooks/useCart';
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
interface productCardPropsa {
    id:   string ,
    name: string,
    price: number,
    SpecialPrice: number,
    image: string
    isLoading?: boolean

}
// eslint-disable-next-line react-refresh/only-export-components
export const useTextTruncate = (maxLines: number = 2) => {
    const textRef = useRef<HTMLParagraphElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        if (textRef.current) {
            const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight);
            const maxHeight = lineHeight * maxLines;
            const actualHeight = textRef.current.scrollHeight;

            setIsTruncated(actualHeight > maxHeight);
        }
    }, [maxLines]);

    return { textRef, isTruncated, showMore, setShowMore };
};

// Updated ProductCard component
export default function ProductCard({ id, name, price, SpecialPrice, image, isLoading }: productCardPropsa) {
    const { addToCart } = useCart();
    const { textRef, isTruncated, showMore, setShowMore } = useTextTruncate(2);
    const { data: userInfo } = useUserInfoQuery(undefined);

    const finalPrice = price || SpecialPrice
    const handleAddToCart = async () => {
        try {
            await addToCart({
                productId: id, // This is now "Product ID" from Daraz
                quantity: 1,
                userId: userInfo?.data?._id,
                price: finalPrice,
                title: name,
                images: image
            });
            toast('Product added to cart successfully!');
        } catch (error) {
            console.error('Failed to add product to cart:', error);
        }
    };
    const discouunt = Math.round(SpecialPrice-price);


    const discountPercentage = Math.round(((discouunt / SpecialPrice) * 100));

    // console.log(discountPercentage)
    if (isLoading) {
        return (
            <div className="flex items-center gap-4 min-h-[90vh]">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>)


    }

    return (
        <div className="card w-full shadow-xl border overflow-hidden flex flex-col rounded-md h-full">
            {/* Image */}
            <div className="aspect-square overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="card-body md:p-4 p-2 flex flex-col flex-grow">
                <Link to={`/pricestocks/${id}`}>
                    <div className="mb-2">
                        <h2
                            ref={textRef}
                            className={`hover:underline md:text-base text-xs font-semibold  ${!showMore ? 'line-clamp-2' : ''
                                }`}
                        >
                            {name}
                        </h2>
                        {
                            !price ? null : (
                                <Badge variant="destructive">{discountPercentage ? (
                                    <div className=" text-[8px] md:text-[12px] font-bold  rounded-md ">
                                        {discountPercentage}% OFF
                                    </div>
                                ) : null}
                                </Badge>
                            )
                        }
                        {isTruncated && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowMore(!showMore);
                                }}
                                className="text-blue-500 p-1 md:text-sm text-xs mt-1 hover:underline"
                            >
                                {showMore ? 'Show less' : 'Show more'}
                            </button>

                        )}
                    </div>
                </Link>





                {/* Price */}
                {
                    !price ? (
                        <span className="md:text-lg text-xs font-bold text-red-600">
                            ৳{SpecialPrice.toFixed(2)}
                        </span>) : <div className="flex items-center gap-2 mb-4">
                        {SpecialPrice && (
                            <span className="text-xs text-gray-500 line-through">
                                ৳{SpecialPrice.toFixed(2)}
                            </span>
                        )}
                        <span className="md:text-lg text-xs font-bold text-red-600">
                            ৳{price.toFixed(2)}
                        </span>
                    </div>
                }


                {/* Button */}
                <div className="mt-auto">
                    <Button
                        onClick={handleAddToCart}
                        className="w-full"
                    >
                        Add to Cart
                    </Button>
                </div>
            </div>
        </div>
    );
}









// $project: {
//                 _id: 1,
//                 "Product ID": 1,
//                 "*Product Name(English)": 1,
//                 "Product Name(Bengali) look function": "$basicInfo.Product Name(Bengali) look function",
//                 "*Price": 1,
//                 "SpecialPrice Start": 1,
//                 "SpecialPrice End": 1,
//                 "*Quantity": 1,
//                 "Shop SKU": 1,
//                 "currenczyCode": 1,
//                 "SpecialPrice": 1,
//                 // Bring the image from basic collection to the top level
//                 "images": "$basicInfo.*Product Images1",
//                 "description": "$basicInfo.Main Description"
//             }
// const getAllPStock = async (query: Record<string, string>) => {
//     const { page: queryPage, limit: queryLimit, search, category, ...filterData } = query;

//     const page = Number(queryPage) || 1;
//     const limit = Number(queryLimit) || 20; 
//     const skip = (page - 1) * limit;

//     const searchCondition = search 
//         ? { "*Product Name(English)": { $regex: search, $options: "i" } } 
//         : {};

//     // --- CATEGORY FILTER LOGIC ---
//     // Note: Since category is calculated in $project, 
//     // we use the same regex logic in $match to filter before pagination.
//     let categoryCondition = {};
//     if (category === "PC") {
//         categoryCondition = { "*Product Name(English)": { $regex: /computer|wheel/i } };
//     } else if (category === "Pet Supplies") {
//         categoryCondition = { "*Product Name(English)": { $regex: /cat|kitten/i } };
//     }
//     // Add other categories here...

//     const product = await PriceStockModel.aggregate([
//         {
//             $match: { 
//                 ...filterData, 
//                 ...searchCondition, 
//                 ...categoryCondition // Apply the filter here
//             }
//         },
//         { $skip: skip },
//         { $limit: limit }, // পরবর্তী ২০টি ডাটা নিবে
//         {
//             $lookup: {
//                 from: "besic",
//                 localField: "Product ID",
//                 foreignField: "Product ID",
//                 as: "basicInfo"
//             }
//         },
//         {
//             $unwind: {
//                 path: "$basicInfo",
//                 preserveNullAndEmptyArrays: true
//             }
//         },
        
//         {
//             // 4. Clean up the output to match what your Frontend needs
//             $project: {
//         _id: 1,
//         "Product ID": 1,
//         "productTitle": "$*Product Name(English)",
//         // --- NEW CATEGORIZATION LOGIC ---
//         "category": {
//             $switch: {
//                 branches: [
//                     { 
//                         case: { $regexMatch: { input: "$*Product Name(English)", regex: /cat|kitten|feline/i } }, 
//                         then: "Pet Supplies" 
//                     },
//                     { 
//                         case: { $regexMatch: { input: "$*Product Name(English)", regex: /car|auto|bmw|vehicle|wheel/i } }, 
//                         then: "Automotive" 
//                     },
//                     { 
//                         case: { $regexMatch: { input: "$*Product Name(English)", regex: /computer|wheel/i } }, 
//                         then: "PC" 
//                     },
//                     { 
//                         case: { $regexMatch: { input: "$*Product Name(English)", regex: /guitar|acoustic|strum|strings/i } }, 
//                         then: "Musical Instruments" 
//                     }
//                 ],
//                 default: "Uncategorized"
//             }
//         },
//         // --- END OF NEW LOGIC ---
//         "Price": "$*Price",
//         "images": "$basicInfo.*Product Images1",
//         "description": "$basicInfo.Main Description"
//         // ... add other fields as needed
//     }
//         }
//     ]);

//     const totalProduct = await PriceStockModel.countDocuments({ ...filterData, ...searchCondition });

//     return {
//         data: product,
//         meta: {
//             total: totalProduct,
//             page,
//             limit
//         }
//     };
// };