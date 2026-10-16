import Card from "./UI/Card";
import { Link } from "react-router-dom";
import { deletePriceList } from "../utility/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../utility/queryKeys";
import { useConfirmDelete } from "./contexts/ConfirmContext/UseConfirms";

const PriceListItem = ({ priceList }) => {
  const queryClient = useQueryClient();
  const confirmDelete = useConfirmDelete();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: deletePriceList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.priceLists.all });
    },
  });

  async function onDeleteHandler() {
    const confirmed = await confirmDelete(priceList.priceListName);
    if (!confirmed) return;
    mutate(priceList._id);
  }

  return (
    <Card>
      <h2 className="font-semibold text-4xl">{priceList.priceListName}</h2>
      <div className="flex gap-2">
        <Link
          to={`/edit-pricelist/${priceList._id}`}
          className="flex-1 text-center border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Edit
        </Link>
        <button
          onClick={onDeleteHandler}
          disabled={isPending}
          className="flex-1 text-center border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
      {isError && (
        <p className="text-red-600 dark:text-red-400">{error.message}</p>
      )}
    </Card>
  );
};

export default PriceListItem;
