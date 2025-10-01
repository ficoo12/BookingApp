import { useContext } from "react";
import { ApartmentsContext } from "../store/apartments-context";
import ApartmentItem from "./ApartmentItem";

function Apartments() {
  const { apartments } = useContext(ApartmentsContext);

  if (!apartments || apartments.length === 0) {
    return <p>Loading apartments...</p>;
  }

  return (
    <div className="flex justify-center gap-4 flex-wrap">
      {apartments.map((apartment) => (
        <ApartmentItem key={apartment._id} apartment={apartment} />
      ))}
    </div>
  );
}

export default Apartments;
