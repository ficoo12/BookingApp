import { useContext } from "react";
import { ApartmentsContext } from "../store/apartments-context";
import Card from "./UI/Card";
import { Link } from "react-router-dom";

const ApartmentItem = ({ apartment }) => {
  const { onDeleteApartments } = useContext(ApartmentsContext);

  const deleteData = async (_id) => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(
      "http://localhost:8080/api/apartments/" + _id,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.ok) return await response.json();
    else throw new Error("error");
  };
  function onDeleteHandler() {
    deleteData(apartment._id)
      .then((data) => {
        if (data.rows === 1) {
          onDeleteApartments(apartment._id);
        }
      })
      .catch((err) => console.error(err));
  }

  if (!apartment || !apartment.pictures) {
    return <p>Loading...</p>;
  }

  return (
    <Card key={apartment._id}>
      {
        <div className="overflow-hidden w-fill h-64 rounded-lg">
          {apartment.pictures && apartment.pictures.length > 0 ? (
            <img
              className="w-full h-full object-cover object-center"
              src={`http://localhost:8080/${apartment.pictures[0]}`}
              alt={apartment.name}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <p>No Image Available</p>
            </div>
          )}
        </div>
      }
      <header className="space-y-2">
        <h1 className="font-medium">{apartment.name}</h1>
        <p className="text-gray-500">{`Maksimalan broj gostiju: ${apartment.guests}`}</p>
      </header>
      <div className="space-x-1 mt-5">
        <Link
          to={`/edit-apartments/${apartment._id}`}
          className="text-white bg-blue-600 px-6 py-3 border rounded-md hover:bg-blue-700 text-xl"
        >
          Uredi
        </Link>
        <button
          onClick={onDeleteHandler}
          className="text-blue-400 text-xl hover:text-blue-700 hover:cursor-pointer"
        >
          Obrisi
        </button>
      </div>
    </Card>
  );
};

export default ApartmentItem;
