// components/layout/Favorite/FavoriteEmpty.tsx
import { Link } from "react-router";
import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FavoriteEmpty() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-400/30 to-pink-400/30 blur-2xl rounded-full" />
        <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-950/40 dark:to-pink-950/40 flex items-center justify-center">
          <Heart className="w-10 h-10 text-rose-500" />
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-2 text-foreground">
        Your Wishlist is Empty
      </h1>
      <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
        Save your favorite beauty products and jewelry to keep them handy for later. Start exploring our collection!
      </p>

      <Link to="/shop">
        <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl px-6 shadow-md">
          <Sparkles className="w-4 h-4 mr-2" />
          Explore Products
        </Button>
      </Link>
    </div>
  );
}