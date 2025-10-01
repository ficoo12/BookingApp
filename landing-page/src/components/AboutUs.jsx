import React, { useState } from "react";
import img1 from "../assets/aboutUs01.jpg";
import img2 from "../assets/aboutUs02.jpg";
import img3 from "../assets/aboutUs03.jpg";
import img4 from "../assets/aboutUs04.jpg";

const aboutUs = () => {
  const [imgSrc, setImgSrc] = useState(img1);
  const changeImage = (e) => {
    const updatedSrc = imgSrc.replace(/(\d)(?=\.\w+$)/, e.target.id);
    console.log(updatedSrc);
    setImgSrc(updatedSrc);
  };
  const showModal = () => {};
  return (
    <section className="mx-2 mt-10">
      <div className="space-y-4   max-w-7xl mx-auto">
        <div>
          <h3 className="text-1xl font-bold uppercase tracking-wide emphasized">
            About us
          </h3>
          <h2 class="text-5xl font-semibold max-w-4xl">
            Discover the Perfect Blend of Comfort and Elegance at Our Luxury
            Apartments
          </h2>
        </div>
        <div className="lg:flex justify-between pt-5">
          <div className="lg:flex lg:flex-col justify-between">
            <div className="space-y-2">
              <p className="lg:max-w-lg font-medium paragraphText ">
                Welcome to our luxury apartments on the beautiful island of Vir!
                Nestled in a serene and picturesque location, our family-run
                apartments are designed to provide a relaxing and memorable
                experience for every guest.
              </p>
              <p className="lg:max-w-lg font-medium paragraphText ">
                Welcome to our luxury apartments on the beautiful island of Vir!
                Nestled in a serene and picturesque location, our family-run
                apartments are designed to provide a relaxing and memorable
                experience for every guest.
              </p>
            </div>
            <div className="justify-end">
              <button onClick={showModal} className="ctaBtn">
                Meet hosts &#8599;
              </button>
            </div>
          </div>

          <div className="flex gap-3 items-end flex-col md:flex-row">
            <div className="max-h-72 lg:max-w-md overflow-hidden flex justify-center items-center rounded-lg displayContainer">
              <img src={imgSrc}></img>
            </div>
            <div className="flex gap-1 sm:gap-2 items-center md:flex-col">
              <div className="h-14 sm:h-10 md:w-20 overflow-hidden flex justify-center items-center rounded-lg hover:cursor-pointer">
                <img
                  className="AboutUsImg"
                  id="2"
                  onClick={changeImage}
                  src={img2}
                ></img>
              </div>
              <div className=" h-10 sm:h-10 md:w-20 overflow-hidden flex justify-center items-center rounded-lg hover:cursor-pointer">
                <img
                  className="AboutUsImg"
                  id="3"
                  onClick={changeImage}
                  src={img3}
                ></img>
              </div>
              <div className=" h-10 sm:h-10 md:w-20 overflow-hidden flex justify-center items-center rounded-lg hover:cursor-pointer">
                <img
                  className="AboutUsImg"
                  id="4"
                  onClick={changeImage}
                  src={img4}
                ></img>
              </div>
              <div className=" h-10 sm:h-10 md:w-20 overflow-hidden flex justify-center items-center rounded-lg hover:cursor-pointer">
                <img
                  className="AboutUsImg"
                  id="1"
                  onClick={changeImage}
                  src={img1}
                ></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default aboutUs;
