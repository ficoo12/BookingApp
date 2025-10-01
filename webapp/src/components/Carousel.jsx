import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
const Carousel = ({ children: slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const prev = () =>
    setCurrentSlide((currentSlide) =>
      currentSlide === 0 ? slides.length - 1 : currentSlide - 1
    );
  const next = () =>
    setCurrentSlide((currentSlide) =>
      currentSlide === slides.length - 1 ? 0 : currentSlide + 1
    );
  return (
    <div className="overflow-hidden relative">
      <div
        className="flex transition-transform ease-out duration-500"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides}
      </div>
      <div className="absolute inset-0 flex items-center justify-between p-4 hover:cursor-pointer">
        <button onClick={prev} className="w-8 h-auto text-white">
          <ChevronLeftIcon size={40} />
        </button>
        <button onClick={next} className="w-8 h-auto text-white">
          <ChevronRightIcon size={40} />
        </button>
      </div>
      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <div
              className={`transition-all w-2 h-2 rounded-full ${
                currentSlide === i ? "bg-sky-300" : "bg-white"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Carousel;
