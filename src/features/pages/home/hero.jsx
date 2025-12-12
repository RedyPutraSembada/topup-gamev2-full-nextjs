import { getSliderHome } from "@/actions/public/slider-home/slider-home";
import { CarouselSliderHome } from "./carouselSliderHome";

export default async function HeroSlider() {

  const data_slider = await getSliderHome();

  return (
    <div className="relative mx-4 lg:mx-8 mt-6 mb-8 text-white">
      <CarouselSliderHome data_slider={data_slider}/>
    </div>
  );
}