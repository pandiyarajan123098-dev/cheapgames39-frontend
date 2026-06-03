import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import HeroSlide from "./HeroSlide";

const slides = [
  {
    type: "hero",
    title: "PLAY SMART",
    highlight: "PAY LESS",
    description:
      "Premium PC Games Starting From ₹99. Instant delivery and trusted support.",
    desktopImage: "/hero/hero1-desktop.jpg",
    mobileImage: "/hero/hero1-mobile.jpg",
    position: "left",
    primaryBtn: "Browse Games",
    secondaryBtn: "Explore Deals",
    badge: "STARTING FROM ₹99",
  },

  {
    type: "sale",
    title: "FLASH SALE",
    highlight: "UP TO 90% OFF",
    description:
      "Limited time offers on best-selling AAA games.",
    desktopImage: "/hero/hero2-desktop.jpg",
    mobileImage: "/hero/hero2-mobile.jpg",
    position: "center",
    primaryBtn: "Grab Deal",
    secondaryBtn: "View Offers",
    badge: "LIMITED TIME",
  },

  {
    type: "best",
    title: "BEST SELLING",
    highlight: "GAME",
    description:
      "Black Myth Wukong ",
    desktopImage: "/hero/hero3-desktop.jpg",
    mobileImage: "/hero/hero3-mobile.jpg",
    position: "bottom-left",
    primaryBtn: "Best Sellers",
    secondaryBtn: "View Collection",
    badge: "TOP PICKS",
  },

  {
    type: "new",
    title: "NEW ARRIVALS",
    highlight: "2026 COLLECTION",
    description:
      "Latest AAA releases and upcoming titles added regularly.",
    desktopImage: "/hero/hero4-desktop.jpg",
    mobileImage: "/hero/hero4-mobile.jpg",
    position: "right",
    primaryBtn: "Explore Games",
    secondaryBtn: "Coming Soon",
    badge: "NEW RELEASES",
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