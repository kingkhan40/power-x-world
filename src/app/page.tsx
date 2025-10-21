import DiscountSlider from "@/components/DiscountSlider";
import EarnSection from "@/components/EarnSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import LaunchedSection from "@/components/LaunchedSection";



const page = () => {
  return (
    <div>
      <HeroSection />
      <DiscountSlider />
      <EarnSection />
      <LaunchedSection />
       <Footer />
    </div>
  );
};

export default page;