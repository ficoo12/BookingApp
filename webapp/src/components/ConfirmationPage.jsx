import { Link, Navigate, useLocation } from "react-router-dom";

export default function ConfirmationPage() {
  const location = useLocation();
  const booking = location.state;

  if (!booking) {
    return <Navigate to="/" replace />;
  }

  const { apartmentName, apartmentPhoto, totalPrice, guestName, guestEmail } =
    booking;

  return (
    <div className="container mx-auto flex flex-col items-center mt-20 px-4">
      <div className="max-w-md w-full bg-white border border-slate-300 rounded-lg px-6 py-6 text-center">
        <img
          className="w-full h-56 object-cover object-center rounded-lg"
          src={`http://localhost:8080/${apartmentPhoto}`}
          alt={apartmentName}
        />
        <h1 className="text-2xl font-bold mt-4">{apartmentName}</h1>
        <p className="text-xl font-semibold mt-2">{totalPrice}$</p>
        <p className="mt-5 text-slate-600">
          Dragi {guestName}, vaša rezervacija je uspiješna. Potvrdu o
          rezervaciji i sve potrebne informacije Vam stižu uskoro na mail{" "}
          <span className="font-medium">{guestEmail}</span>.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
        >
          Natrag na početnu
        </Link>
      </div>
    </div>
  );
}
