import heroImg from "../assets/heroImg.jpg";
const heroSection = () => {
  return (
    <section className="mx-2 mt-10">
      <div className="max-w-7xl mx-auto space-y-10 ">
        <div className="space-y-5">
          <div className="space-y-3 ">
            <h1 className="text-6xl md:text-8xl text-center font-extrabold">
              Your <span className="emphasized">dream stay </span>
              on <br />
              island of Vir
            </h1>
            <h2 className="text-center font-semibold text-xl md:text-2xl max-w-5xl mx-auto paragraphText">
              Luxurious, family- and pet-friendly apartments designed for
              comfort, style, and unforgettable moments by the Adriatic Sea.
            </h2>
          </div>
          <div className="flex justify-center space-x-6">
            <button className="ctaBtn">Book Now</button>
            <button className="secondaryCta">About us</button>
          </div>
        </div>
        <div className="max-h-96 w-full overflow-hidden flex justify-center items-center rounded-lg">
          <img alt="Hero" src={heroImg}></img>
        </div>
      </div>
    </section>
  );
};
export default heroSection;
