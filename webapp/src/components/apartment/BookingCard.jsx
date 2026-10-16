const BookingCard = ({
  formattedStartDate,
  formattedEndDate,
  guests,
  totalPrice,
  onReserve,
}) => {
  return (
    <div className="bg-white px-4 py-4 rounded-lg h-fit lg:mt-10 w-fit border border-gray-400">
      <div>
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

        <p className="mt-2">Number of guests: {guests}</p>
      </div>
      <div className="flex flex-col items-center gap-y-2 mt-5">
        <button
          onClick={onReserve}
          className="bg-sky-400 px-5 py-3 font-medium rounded-md hover:bg-sky-500 hover:cursor-pointer w-full"
        >
          Make a reservation
        </button>
        <p>You will not be charged yet</p>
      </div>
      <div className="w-full h-0.5 bg-gray-400 rounded-lg mt-3"></div>
      <div className="flex justify-between items-center mt-3">
        <p className="text-xl font-bold">Total</p>
        <p className="text-xl font-bold">{totalPrice}$</p>
      </div>
    </div>
  );
};

export default BookingCard;
