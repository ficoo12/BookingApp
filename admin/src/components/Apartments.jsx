import ApartmentItem from "./ApartmentItem";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../utility/queryKeys";
import { getApartments } from "../utility/api";

function Apartments() {
  const {
    data: apartments,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.apartments.all,
    queryFn: getApartments,
  });

  if (isPending) return <p>Loading apartments...</p>;
  if (isError) return <p>{error.message}</p>;

  return (
    <div className="flex justify-center gap-4 flex-wrap">
      {apartments.map((apartment) => (
        <ApartmentItem key={apartment._id} apartment={apartment} />
      ))}
    </div>
  );
}

export default Apartments;
