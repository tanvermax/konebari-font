// components/layout/HomeLayout/Skeletons.tsx
import { Skeleton } from "@/components/ui/skeleton";

// ✅ Brand Slider Skeleton
export function BrandSliderSkeleton() {
  return (
    <section className="py-12 bg-stone-50 dark:bg-[#0D0D0D] border-y border-border/40">
      <div className="container mx-auto px-4 mb-6 text-center">
        <Skeleton className="h-4 w-40 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
      <div className="flex gap-12 px-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 flex-shrink-0" />
        ))}
      </div>
    </section>
  );
}

// ✅ Home Page (Products) Skeleton
export function HomePageSkeleton() {
  return (
    <section className="py-12 container mx-auto px-4">
      <div className="text-center mb-10">
        <Skeleton className="h-6 w-48 mx-auto mb-3" />
        <Skeleton className="h-4 w-72 mx-auto" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </section>
  );
}

// ✅ Reviews Skeleton
export function ReviewsSkeleton() {
  return (
    <section className="py-16 sm:py-24 bg-stone-50/60 dark:bg-stone-900/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12">
          <Skeleton className="h-4 w-32 mb-3" />
          <Skeleton className="h-10 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-[#121212] border border-stone-200/60 h-56"
            >
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-16 w-full mb-6" />
              <Skeleton className="h-10 w-40" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ✅ Combined Home Skeleton (jodi ek sathe chan)
export function HomeSkeleton() {
  return (
    <>
      <BrandSliderSkeleton />
      <HomePageSkeleton />
    </>
  );
}