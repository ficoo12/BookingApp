const ApartmentInfo = ({ apartment, onShowMore }) => {
  const partOfDescription = apartment.desc.slice(0, 300);

  return (
    <>
      <h1 className="text-4xl font-semibold pt-2">{apartment.name}</h1>
      <h2 className="text-2xl font-medium pt-1">{apartment.type}</h2>
      <h3>Maximum number of guests: {apartment.guests}</h3>
      <div className="mt-5">
        <p className="text-lg mb-2">Apartment features:</p>
        <div className="space-y-2 font-bold">
          {apartment.features.map((feature) => {
            return (
              <p key={feature} className="text-lg">
                {feature}
              </p>
            );
          })}
        </div>
      </div>
      <div className="bg-gray-400 text-white p-4 shadow-sm rounded-lg lg:max-w-lg lg:mt-5">
        <p className="text-3xl font-medium">Apartment description</p>
        <p className="pt-2">{partOfDescription}...</p>
        <button onClick={onShowMore} className="underline pt-2">
          Show more
        </button>
      </div>
    </>
  );
};

export default ApartmentInfo;
