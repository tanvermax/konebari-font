import HomePage from "@/components/layout/home/HomePage";
import LookbookReviews from "@/components/layout/HomeLayout/LookbookReviews/LookbookReviews";
import RoutineBundles from "@/components/layout/HomeLayout/RoutineBundles/RoutineBundles";
import SkinGoals from "@/components/layout/HomeLayout/SkinGoals/SkinGoals";
import SkinPhilosophy from "@/components/layout/HomeLayout/SkinPhilosophy/SkinPhilosophy";
import TrendingOffers from "@/components/layout/HomeLayout/TrendingOffers/TrendingOffers";
// import Flashsale from "@/components/layout/HomeLayout/FlashSale/Flashsale";
import FeaturedCatalog from "@/components/layout/HomeLayout/FeaturedCatalog/FeaturedCatalog";
// import TopCategroy from "@/components/layout/HomeLayout/TopCategory/TopCategroy";
// import TradingProduct from "@/components/layout/HomeLayout/TrandingProduct/TradingProduct";

export default function Home() {
  return (
    <div>
      <HomePage />
      <TrendingOffers/>
      <SkinPhilosophy/>
      <SkinGoals/>
<LookbookReviews/>
<RoutineBundles/>
     <FeaturedCatalog/>
       {/* <TopCategroy/>  */}
      {/* <TradingProduct/> */}
    </div>
  );
}
