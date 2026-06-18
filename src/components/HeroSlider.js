import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import HeroSlide from "./HeroSlide";

const slides = [
  {
    title: "FORZA HORIZON",
    highlight: "6",
    description: "JUST ₹249 ONLY",
    desktopImage: "/hero/hero1-desktop.jpg",
    mobileImage: "/hero/hero1-mobile.jpg",
    primaryBtn: "Buy Now",
  },

  {
    title: "007",
    highlight: "FIRST LIGHT",
    description: "JUST ₹199 ONLY",
    desktopImage: "/hero/hero2-desktop.jpg",
    mobileImage: "/hero/hero2-mobile.jpg",
    primaryBtn: "Buy Now",
  },

  {
    title: "RESIDENT EVIL",
    highlight: "REQUIEM",
    description: "JUST ₹199 ONLY",
    desktopImage: "/hero/hero3-desktop.jpg",
    mobileImage: "/hero/hero3-mobile.jpg",
    primaryBtn: "Buy Now",
  },

  {
    title: "CRIMSON",
    highlight: "DESERT",
    description: "JUST ₹199 ONLY",
    desktopImage: "/hero/hero4-desktop.jpg",
    mobileImage: "/hero/hero4-mobile.jpg",
    primaryBtn: "Buy Now",
  },
];

export default function HeroSlider() {
return (
<Swiper
modules={[Autoplay, Pagination, EffectFade]}
effect="fade"
grabCursor={true}
centeredSlides={true}
speed={1000}
autoplay={{
delay: 5000,
disableOnInteraction: false,
}}
pagination={{
clickable: true,
}}
loop={true}
className="hero-swiper pb-12"
>
{slides.map((slide, index) => (
<SwiperSlide key={index}>
<HeroSlide slide={slide} />
</SwiperSlide>
))}
</Swiper>
);
}