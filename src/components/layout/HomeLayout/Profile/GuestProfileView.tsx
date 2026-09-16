// components/layout/Profile/GuestProfileView.tsx
import { Link } from "react-router";
import { User, Lock, ShoppingBag, Heart, Sparkles, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GuestProfileView() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-16 max-w-2xl">
      <Card className="border-0 shadow-2xl shadow-rose-500/10 rounded-3xl overflow-hidden">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 p-8 md:p-12 text-center text-white overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />

          <div className="relative z-10">
            <div className="w-24 h-24 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-5 border border-white/30">
              <User className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome Guest! 👋
            </h1>
            <p className="text-white/90 text-sm max-w-sm mx-auto">
              Login or create an account to access your profile, orders, and wishlist.
            </p>
          </div>
        </div>

        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Features list */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-border/40">
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-4 h-4 text-rose-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Track Your Orders</p>
                <p className="text-[11px] text-muted-foreground">
                  View order history and delivery status
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-border/40">
              <div className="w-9 h-9 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 text-pink-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Save Your Wishlist</p>
                <p className="text-[11px] text-muted-foreground">
                  Sync favorites across all your devices
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-border/40">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Faster Checkout</p>
                <p className="text-[11px] text-muted-foreground">
                  Saved addresses and payment methods
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-border/40">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Exclusive Offers</p>
                <p className="text-[11px] text-muted-foreground">
                  Members-only discounts and rewards
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-2">
            <Link to="/login" className="block">
              <Button className="w-full h-12 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-lg shadow-rose-500/25">
                <LogIn className="w-4 h-4 mr-2" />
                Login to Your Account
              </Button>
            </Link>

            <Link to="/register" className="block">
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl border-rose-200/60 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/20"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create New Account
              </Button>
            </Link>
          </div>

          {/* Continue shopping */}
          <div className="text-center pt-2">
            <Link
              to="/shop"
              className="text-xs text-muted-foreground hover:text-rose-500 transition-colors inline-flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3 h-3" />
              Continue Shopping as Guest
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Bottom note */}
      <p className="text-center text-[11px] text-muted-foreground mt-6">
        Your guest cart and wishlist are saved on this device. Login to sync them across devices.
      </p>
    </div>
  );
}