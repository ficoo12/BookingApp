import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createApartment, getPriceLists } from "../utility/api";
import { queryKeys } from "../utility/queryKeys";
import { APARTMENT_FEATURES } from "../utility/features";

const ApartmentsForm = () => {
  const navigator = useNavigate();
  const queryClient = useQueryClient();

  const { data: priceLists = [] } = useQuery({
    queryKey: queryKeys.priceLists.all,
    queryFn: ({ signal }) => getPriceLists({ signal }),
  });

  const {
    mutate,
    isPending,
    isError: isSubmitError,
    error: submitError,
  } = useMutation({
    mutationFn: createApartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.apartments.all });
      navigator("/apartments");
    },
  });

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [guests, setGuests] = useState("");
  const [type, setType] = useState("");
  const [priceListId, setPriceListId] = useState("");
  const [features, setFeatures] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [available, setAvailable] = useState("true");
  const [error, setError] = useState("");

  function onNameChangeHandler(e) {
    setName(e.target.value);
  }

  function onDescChangeHandler(e) {
    setDesc(e.target.value);
  }

  function onGuestsChangeHandler(e) {
    setGuests(e.target.value);
  }

  function onTypeChangeHandler(e) {
    setType(e.target.value);
  }

  function onPriceListChangeHandler(e) {
    setPriceListId(e.target.value);
  }

  function onPicturesChangeHandler(e) {
    setPictures(e.target.files);
  }

  function onAvailableChangeHandler(e) {
    setAvailable(e.target.value);
  }

  function onFeaturesChangeHandler(e) {
    const value = e.target.value;
    setFeatures((prevFeatures) =>
      e.target.checked
        ? [...prevFeatures, value]
        : prevFeatures.filter((feature) => feature !== value),
    );
  }

  function onSubmitHandler(e) {
    e.preventDefault();

    if (
      !name ||
      !desc ||
      !guests ||
      !type ||
      !priceListId ||
      features.length === 0
    ) {
      setError(true);
      return;
    }

    setError(false);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("desc", desc);
    formData.append("guests", guests ? Number(guests) : 1);
    formData.append("type", type || "Apartment");
    formData.append("priceList_id", priceListId);
    formData.append("available", available === "true");
    formData.append("features", JSON.stringify(features));

    Array.from(pictures).forEach((file) => {
      formData.append("pictures", file);
    });

    mutate(formData);
  }

  return (
    <div
      className="min-h-screen p-6 bg-transparent flex items-center justify-center
    "
    >
      <div className="container max-w-screen-lg mx-auto">
        <div>
          <h2 className="font-semibold text-xl text-gray-600 dark:text-gray-300">
            Dodajte novi apartman
          </h2>
          <p className="text-gray-500 mb-6 dark:text-gray-400">
            Popunite sve informacije kako bi mogli dodati još jedan apartman za
            svoj objekt.
          </p>
          <form
            className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 space-y-5 dark:bg-gray-800 dark:shadow-black/40"
            onSubmit={onSubmitHandler}
            encType="multipart/form-data"
          >
            <div className="md:col-span-5">
              <label className=" text-black dark:text-gray-200">
                Unesite naziv apartmana
              </label>
              <input
                className="h-10 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                type="text"
                name="name"
                value={name}
                onChange={onNameChangeHandler}
                placeholder="Cozy Beachside Apartment"
                required
              ></input>
            </div>
            <div className="md:col-span-5">
              <label className="text-black dark:text-gray-200">
                Unesite opis apartmana
              </label>
              <textarea
                name="desc"
                placeholder="Apartman sa pogledom na more..."
                className="h-50 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                value={desc}
                onChange={onDescChangeHandler}
                required
              ></textarea>
            </div>
            <div className="md:col-span-5">
              <label className=" text-black dark:text-gray-200">
                Odaberite značajke
              </label>
              <div className="text-gray-400 space-x-5 dark:text-gray-300">
                {APARTMENT_FEATURES.map((feature) => (
                  <label key={feature}>
                    <input
                      type="checkbox"
                      name="features"
                      value={feature}
                      checked={features.includes(feature)}
                      onChange={onFeaturesChangeHandler}
                    />{" "}
                    {feature.trim()}
                  </label>
                ))}
              </div>
              <p className="text-black dark:text-gray-200">
                Selektirane značajke: {JSON.stringify(features)}
              </p>
            </div>

            <div className="md:col-span-5">
              <label className=" text-black dark:text-gray-200">
                Unesite maksimalan broj gostiju
              </label>
              <input
                className="h-10 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                type="number"
                name="guests"
                value={guests}
                onChange={onGuestsChangeHandler}
                placeholder="4"
                required
              ></input>
            </div>

            <div className="md:col-span-5">
              <label className=" text-black dark:text-gray-200">
                Unesite tip apartmana
              </label>
              <input
                className="h-10 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                value={type}
                onChange={onTypeChangeHandler}
                type="text"
                name="type"
                placeholder="Trosobni apartman"
                required
              ></input>
            </div>
            <div className="md:col-span-5">
              <label className=" text-black dark:text-gray-200">
                Odaberite cjenik
              </label>
              <select
                className="h-10 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                name="priceList_id"
                value={priceListId}
                onChange={onPriceListChangeHandler}
                required
              >
                <option value="" disabled>
                  Odaberite cjenik
                </option>
                {priceLists.map((priceList) => (
                  <option key={priceList._id} value={priceList._id}>
                    {priceList.priceListName}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-5">
              <label className=" text-black dark:text-gray-200">
                Prenesite fotografije
              </label>
              <input
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter  bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                type="file"
                name="pictures"
                onChange={onPicturesChangeHandler}
                placeholder="pictures"
                multiple
                required
              />
            </div>
            <div className="md:col-span-5">
              <label className=" text-black dark:text-gray-200">
                Ažurirajte dostupnost
              </label>
              <select
                className="h-10 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                value={available}
                onChange={onAvailableChangeHandler}
                name="available"
                required
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>

            {error && (
              <p className="text-red-600 dark:text-red-400">
                Popunite sva obavezna polja.
              </p>
            )}
            {isSubmitError && (
              <p className="text-red-600 dark:text-red-400">
                {submitError.message}
              </p>
            )}
            <button
              className="bg-sky-600 text-white px-6 py-4 rounded-lg text-md hover:bg-sky-900 dark:bg-sky-700 dark:hover:bg-sky-800 disabled:opacity-50"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Dodavanje..." : "Dodaj apartman"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApartmentsForm;
