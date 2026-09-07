import Card from "./UI/Card";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { deletePriceList } from "../utility/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../utility/queryKeys";

const PriceListItem = ({ priceList }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: deletePriceList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.priceLists.all });
    },
  });

  function onDeleteHandler() {
    mutate(priceList._id);
  }

  return (
    <Card>
      <h2 className="font-semibold text-lg">{priceList.priceListName}</h2>

      {priceList.periods.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Nema definiranih raspona.
        </p>
      ) : (
        <ul className="space-y-1">
          {priceList.periods.map((period, index) => (
            <li key={index} className="text-gray-500 dark:text-gray-400">
              {format(period.startDate, "MMM dd, yyyy")} -{" "}
              {format(period.endDate, "MMM dd, yyyy")}: {period.pricePerNight}
              € / noć
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <Link
          to={`/edit-pricelist/${priceList._id}`}
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

export default PriceListItem;
