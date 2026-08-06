import { useOrderMutation } from "../features/order/Order.api";
import { useUserInfoQuery } from "../features/auth/auth.api";
import { toast } from "sonner";

interface AddToCartParams {
    userId: string,
    skuId: string;
    productId: string ;
    quantity: number;
    price: number;
    title: string;
    images?: string[];
}


export const useCart = () => {

    const [addtocart, { isLoading, error }] = useOrderMutation();
    const { data: userInfo, isLoading: isUserLoading, refetch } = useUserInfoQuery(undefined);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const navigate = useNavigate();

    // hooks/useCart.ts - Update addToCart function
    const addToCart = async (item: AddToCartParams) => {
        const isLoggedIn = !!userInfo?.data;
        refetch()
        if (isLoggedIn) {
            try {
                const cartDetails = {
                    productId: item.productId,
                    quantity: item.quantity,
                    user: userInfo.data._id
                    
                };
                console.log("cartDetails", cartDetails)
                const result = await addtocart(cartDetails).unwrap();
                toast.success("Added to database cart");
                return result;
            } catch (error) {
                console.error('Error adding to database:', error);
                toast.error("Failed to sync with account");
                throw error;
            }
        } else {
            console.log("Guest User: Saving to LocalStorage");

            // Generate a unique ID for each cart item (similar to MongoDB _id)
            const generateId = () => `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Get current cart or empty array
            const localCart = JSON.parse(localStorage.getItem('guestCart') || '[]');

            const existingItemIndex = localCart.findIndex(
                (cartItem: { product: string }) => cartItem.product.toString() === item.productId.toString()
            );

            if (existingItemIndex > -1) {
                localCart[existingItemIndex].quantity += item.quantity;
            } else {
                localCart.push({
                    _id: generateId(), // Add _id for consistency
                    product: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    title: item.title,
                    images: item.images
                });
                refetch()
            }

            localStorage.setItem('guestCart', JSON.stringify(localCart));
            window.dispatchEvent(new Event('cartUpdated'));
            toast.success("Added to guest cart");

            return { message: "Saved locally", data: localCart };
        }
    }
    return {
        addToCart,
        isLoading: isLoading || isUserLoading,
        isLoggedIn: !!userInfo?.data, error
    };
}