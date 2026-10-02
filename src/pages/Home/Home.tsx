import HomePage from "@/components/layout/home/HomePage";
import LookbookReviews from "@/components/layout/HomeLayout/LookbookReviews/LookbookReviews";
import SkinGoals from "@/components/layout/HomeLayout/SkinGoals/SkinGoals";
import SkinPhilosophy from "@/components/layout/HomeLayout/SkinPhilosophy/SkinPhilosophy";
import TrendingOffers from "@/components/layout/HomeLayout/TrendingOffers/TrendingOffers";
import { useAllpstockQuery } from "@/redux/features/product/product.api";
import { useEffect } from "react";

export default function Home() {
  const { data, isLoading } = useAllpstockQuery({ limit: 8, sort: "-createdAt" });

  useEffect(() => {
    // ✅ Data load complete হলে event fire করুন
    if (!isLoading && data) {
      // React-snap wait করছে এই event এর জন্য
      window.dispatchEvent(new Event('render-event'));
      // console.log('✅ HomePage data loaded — render-event dispatched');
    }
  }, [isLoading, data]);
  return (
    <div>
      <HomePage />
    
      <TrendingOffers />
      <SkinPhilosophy />
      <SkinGoals />
      <LookbookReviews />
      {/* <RoutineBundles /> */}
      {/* <FeaturedCatalog /> */}
      
    </div>
  );
}
