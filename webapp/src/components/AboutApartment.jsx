import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShareIcon,
  GiftIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const AboutApartment = () => {
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dateRange = location.state?.dateRange || {};
  const startDate = dateRange.startDate ? new Date(dateRange.startDate) : null;
  const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;

  const formattedStartDate = startDate
    ? format(startDate, "MMM dd, yyyy")
    : "No date provided";

  const formattedEndDate = endDate
    ? format(endDate, "MMM dd, yyyy")
    : "No date provided";

  const totalNights =
    startDate && endDate ? differenceInDays(endDate, startDate) : 0;

  console.log(totalNights);
  console.log(typeof totalNights);
  const guests = location.state?.guests || [0];
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
  });
  const [apartmentData, setApartmentData] = useState([]);
  const params = useParams();

  useEffect(() => {
    const fetchApartmentData = async () => {
      const response = await fetch(
        `http://localhost:8080/api/apartments/${params.id}`
      );
      const apartmentData = await response.json();
      console.log(apartmentData);
      setApartmentData(apartmentData);
    };
    fetchApartmentData();
  }, [params.id]);

  const pricePerNight = apartmentData.length > 0 ? apartmentData[0]?.price : 0;
  const partOfDescription =
    apartmentData.length > 0
      ? apartmentData[0].desc.slice(0, 300)
      : "no text provided";
  const totalPrice = totalNights * pricePerNight;

  const goToPaymentHandler = (id) => {
    navigate(`/payment/${id}`, { state: { dateRange, guests, totalPrice } });
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <div>
      <nav className="flex justify-between px-3 py-3 bg-white">
        <Link to="/">
          <ChevronLeftIcon className="w-8 h-auto"></ChevronLeftIcon>
        </Link>
        <ShareIcon className="w-8 h-auto"></ShareIcon>
      </nav>
      <div className="container mx-auto">
        {apartmentData.length === 0 ? (
          <p className="text-center mt-30">Loading...</p>
        ) : (
          apartmentData.map((apartment) => (
            <div key={apartment._id} className="w-full text-black">
              <div className="relative ">
                <div
                  ref={sliderRef}
                  className="keen-slider h-64 w-full lg:w-full lg:h-96 lg:mt-20"
                >
                  {apartment.pictures.map((picture, index) => (
                    <div key={index} className="keen-slider__slide">
                      <img
                        className="w-full h-full object-cover object-center lg:rounded-lg"
                        src={`http://localhost:8080/${picture}`}
                        alt={apartment.name}
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
              <div className="mt-10 lg:flex lg:justify-between">
                <div>
                  <h1 className="text-4xl font-semibold pt-2">
                    {apartment.name}
                  </h1>
                  <h2 className="text-2xl font-medium pt-1">
                    {apartment.type}
                  </h2>
                  <h3>Maksimalan broj gostiju: {apartment.guests}</h3>
                  <div className="mt-5">
                    <p className="text-lg mb-2">Značajke apartmana:</p>
                    <div className="space-y-2 font-bold">
                      {apartment.features.map((feature) => {
                        return <p className="text-lg">{feature}</p>;
                      })}
                    </div>
                  </div>
                  <div className="bg-gray-400 text-white p-4 shadow-sm rounded-lg lg:max-w-lg lg:mt-5">
                    <p className="text-3xl font-medium">Opis apartmana</p>
                    <p className="pt-2">{partOfDescription}...</p>
                    <button onClick={toggleModal} className="underline pt-2">
                      Show more
                    </button>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold mt-5">
                      {totalNights} noći u {apartment.name}
                    </h4>
                    <p className="text-slate-600">
                      {formattedStartDate} - {formattedEndDate}
                    </p>
                    <div className="flex align-middle">
                      <UserIcon className="w-8 h-auto"></UserIcon>
                      <p className="text-slate-600">{guests}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white px-4 py-4 rounded-lg h-fit lg:mt-10 w-fit border border-gray-400">
                  <div className="flex items-center justify-between shadow-lg bg-white rounded-lg px-4 py-2 gap-2">
                    <GiftIcon className="w-12 h-auto"></GiftIcon>
                    <p>Imate sreće! Ovaj apartman je često rezerviran</p>
                  </div>
                  <div>
                    <p className="mt-3">
                      <span className="text-black text-2xl font-bold">
                        $ {apartment.price[0]}
                      </span>{" "}
                      <span className="text-xl">noć</span>
                    </p>
                    <div className="flex justify-between mt-3">
                      <div>
                        <p className="uppercase font-bold">Check-in</p>
                        <p>{formattedStartDate}</p>
                      </div>
                      <div>
                        <p className="uppercase font-bold">Checkout</p>
                        <p>{formattedEndDate}</p>
                      </div>
                    </div>

                    <p className="mt-2">Broj gostiju: {guests}</p>
                  </div>
                  <div className="flex flex-col items-center gap-y-2 mt-5">
                    <button
                      onClick={() => goToPaymentHandler(apartment._id)}
                      className="bg-sky-400 px-5 py-3 font-medium rounded-md hover:bg-sky-500 hover:cursor-pointer w-full"
                    >
                      Napravi razervaciju
                    </button>
                    <p>You won't be charged yet</p>
                  </div>
                  <div className="flex justify-between mt-5">
                    <p className="underline">
                      {apartment.price[0]}$ X {totalNights} noći
                    </p>
                    <p>{totalPrice}$</p>
                  </div>
                  <div className="w-full h-0.5 bg-gray-400 rounded-lg mt-3"></div>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-xl font-bold">Total</p>
                    <p className="text-xl font-bold">{totalPrice}$</p>
                  </div>
                </div>
              </div>
              {/* Modal */}
              {modal && (
                <div className="w-screen h-screen top-0 left-0 right-0 fixed bottom-0 bg-gray-950/60">
                  <div className="bg-white  max-w-lg h-fit px-5 py-10 rounded-lg mx-auto mt-20">
                    <XMarkIcon
                      onClick={toggleModal}
                      className="w-10 h-auto"
                    ></XMarkIcon>
                    <div>
                      <p className="text-4xl font-medium">O apartmanu</p>
                      <p className="mt-5">{apartment.desc}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AboutApartment;
