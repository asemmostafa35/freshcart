import dynamic from "next/dynamic";
import FeaturedProducts from "./FeaturedProducts/FeaturedProducts";
import Slider from "./Slider/Slider";
import img1 from ".././assets/images/banner-4.jpeg";
import img2 from ".././assets/images/blog-img-1.jpeg";
import img3 from ".././assets/images/blog-img-2.jpeg";
import Banners from "./_component/Banners/Banners";

const ShopCategory = dynamic(() => import("./ShopCategory/page"), {
  loading: () => <div>Loading...</div>,
});

export default function Home() {
  return (
    <div className="">
      <Slider
        pageList={[img1.src, img2.src, img3.src]}
        spaceBetween={0}
        slidesPerView={1}
      />
      <ShopCategory />
      <Banners />
      <FeaturedProducts />
    </div>
  );
}
