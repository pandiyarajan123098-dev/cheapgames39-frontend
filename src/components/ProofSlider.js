import React, { useState, useEffect } from "react";
import { proofs } from "../data/proofs";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProofSlider = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % proofs.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? proofs.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">

        <h2 className="text-4xl font-bold text-white mb-12">
          REAL <span className="text-[#B50000]">CUSTOMER PROOFS</span>
        </h2>

        <div className="relative flex items-center justify-center gap-6">

          {proofs.map((proof, index) => {
            const position =
              (index - current + proofs.length) % proofs.length;

            let classes = "";

            if (position === 0) {
              classes =
                "scale-100 rotate-0 z-30 opacity-100";
            } else if (position === 1) {
              classes =
                "scale-90 rotate-12 z-20 opacity-70";
            } else if (position === proofs.length - 1) {
              classes =
                "scale-90 -rotate-12 z-20 opacity-70";
            } else {
              classes =
                "scale-75 opacity-0 absolute";
            }

            return (
              <img
                key={index}
                src={proof}
                alt="Proof"
                className={`
                  w-[240px] h-[500px]
                  rounded-[30px]
                  object-cover
                  border border-white/10
                  shadow-2xl
                  transition-all duration-700
                  ${classes}
                `}
              />
            );
          })}

        </div>

        <div className="flex justify-center gap-6 mt-10">
         <button
  onClick={prevSlide}
  className="
    bg-[#B50000]
    hover:bg-red-700
    p-4
    rounded-full
    transition-all duration-300
    shadow-[0_0_20px_rgba(181,0,0,0.6)]
  "
>
           <ChevronLeft className="text-white" />
          </button>

         <button
  onClick={nextSlide}
  className="
    bg-[#B50000]
    hover:bg-red-700
    p-4
    rounded-full
    transition-all duration-300
    shadow-[0_0_20px_rgba(181,0,0,0.6)]
  "
>
            <ChevronRight className="text-white" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default ProofSlider;