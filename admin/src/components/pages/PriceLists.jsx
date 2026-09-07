import { useQuery } from "@tanstack/react-query";
import { getPriceLists } from "../../utility/api";
import { queryKeys } from "../../utility/queryKeys";
import PriceListItem from "../PriceListItem";

const PriceLists = () => {
  const {
    data: priceLists,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.priceLists.all,
    queryFn: ({ signal }) => getPriceLists({ signal }),
  });

  if (isPending) return <p>Loading price lists...</p>;
  if (isError) return <p>{error.message}</p>;

  return (
    <div className="container mx-auto">
      <h1 className="font-semibold text-xl text-gray-600 dark:text-gray-300">
        Svi cjenici
      </h1>

      {priceLists.length === 0 && (
        <p className="mt-5 text-gray-600 dark:text-gray-400">
          Još nema cjenika.
        </p>
      )}

      {priceLists.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mt-5">
          {priceLists.map((priceList) => (
            <PriceListItem key={priceList._id} priceList={priceList} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PriceLists;
