import Card from "./UI/Card";
import { Link } from "react-router-dom";
import { deleteApartment } from "../utility/api";
import { BASE_URL } from "../utility/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../utility/queryKeys";

const ApartmentItem = ({ apartment }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: deleteApartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.apartments.all });
    },
  });

  function onDeleteHandler() {
    mutate(apartment._id);
  }

  return (
    <Card>
      <div className="relative -mt-4 -mx-4 h-64 rounded-t-lg overflow-hidden">
        {apartment.pictures && apartment.pictures.length > 0 ? (
          <img
            className="w-full h-full object-cover object-center"
            src={`${BASE_URL}/${apartment.pictures[0]}`}
            alt={apartment.name}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700">
            <p>No Image Available</p>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 pt-12 pb-3">
          <h1 className="text-white font-semibold text-lg leading-tight">
            {apartment.name}
          </h1>
        </div>
      </div>

      <p className="text-gray-500 dark:text-gray-400">
        Maksimalan broj gostiju: <strong className="text-blue-950 dark:text-gray-100">{apartment.guests}</strong>
      </p>

      <div className="flex gap-2">
        <Link
          to={`/edit-apartments/${apartment._id}`}
          className="flex-1 text-center border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Uredi
        </Link>
        <button
          onClick={onDeleteHandler}
          disabled={isPending}
          className="flex-1 text-center border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {isPending ? "Brisanje..." : "Obriši"}
        </button>
      </div>
      {isError && (
        <p className="text-red-600 dark:text-red-400">{error.message}</p>
      )}
    </Card>
  );
};

export default ApartmentItem;
