import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { BASE_URL } from "../../utility/config";

const ImageSlider = ({ pictures, alt }) => {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
  });

  return (
    <div className="relative ">
      <div
        ref={sliderRef}
        className="keen-slider h-64 w-full lg:w-full lg:h-96 lg:mt-20"
      >
        {pictures.map((picture, index) => (
          <div key={index} className="keen-slider__slide">
            <img
              className="w-full h-full object-cover object-center lg:rounded-lg"
              src={`${BASE_URL}/${picture}`}
              alt={alt}
            />
          </div>
        ))}
      </div>

      <button
        className="hidden absolute left-2 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full lg:block"
        onClick={() => instanceRef.current?.prev()}
      >
        <ChevronLeftIcon className="w-10 h-auto"></ChevronLeftIcon>
      </button>

      <button
        className="hidden absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full lg:block"
        onClick={() => instanceRef.current?.next()}
      >
        <ChevronRightIcon className="w-10 h-auto"></ChevronRightIcon>
      </button>
    </div>
  );
};

export default ImageSlider;
