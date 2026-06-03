import {
  Zap,
  ShieldCheck,
  Gamepad2,
  Headphones,
  BadgeCheck,
  Clock3,
} from "lucide-react";

export default function TrustBar() {
  const items = [
    {
      icon: <Zap size={20} />,
      title: "Instant Delivery",
    },
    {
      icon: <ShieldCheck size={20} />,
      title: "Secure Payment",
    },
    {
      icon: <Gamepad2 size={20} />,
      title: "Premium Games",
    },
    {
      icon: <Headphones size={20} />,
      title: "Fast Support",
    },
    {
      icon: <BadgeCheck size={20} />,
      title: "Trusted Seller",
    },
    {
      icon: <Clock3 size={20} />,
      title: "24/7 Available",
    },
  ];

  return (
    <section className="bg-black py-5 px-3 border-y border-white/10">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-3 gap-3">

          {items.map((item, index) => (
            <div
              key={index}
              className="
                h-[90px]
                bg-[#111111]
                border border-white/10
                rounded-2xl
                flex flex-col
                items-center
                justify-center
                text-center
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#B50000]
                hover:bg-[#151515]
                hover:shadow-[0_0_25px_rgba(181,0,0,0.25)]
              "
            >
              <div className="text-[#B50000] mb-2">
                {item.icon}
              </div>

              <span className="text-[11px] md:text-sm text-gray-300 font-medium leading-tight px-2">
                {item.title}
              </span>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}