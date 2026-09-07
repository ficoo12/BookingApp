import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteApartmentImages,
  getApartment,
  getPriceLists,
  updateApartment,
} from "../../utility/api";
import { queryKeys } from "../../utility/queryKeys";
import { APARTMENT_FEATURES } from "../../utility/features";
import { BASE_URL } from "../../utility/config";

const EditApartmentsForm = ({ apartment }) => {
  const navigator = useNavigate();
  const queryClient = useQueryClient();
  const [selectedImages, setSelectedImages] = useState([]);
  const previouspictures = apartment.pictures;

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
    mutationFn: updateApartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.apartments.all });
      navigator("/apartments");
    },
  });

  const {
    mutate: deleteImages,
    isPending: isDeletingImages,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteApartmentImages,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.apartments.detail(apartment._id),
      });
      setSelectedImages([]);
    },
  });

  const [name, setName] = useState(apartment.name);
  const [desc, setDesc] = useState(apartment.desc);
  const [guests, setGuests] = useState(apartment.guests);
  const [type, setType] = useState(apartment.type);
  const [priceListId, setPriceListId] = useState(
    apartment.priceList_id ?? ""
  );
  const [features, setFeatures] = useState(apartment.features);
  const [newPictures, setNewPictures] = useState([]);
  const [available, setAvailable] = useState(String(apartment.available));
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
    setNewPictures([...e.target.files]);
  }

  function onAvailableChangeHandler(e) {
    setAvailable(e.target.value);
  }

  function onFeaturesChangeHandler(e) {
    const value = e.target.value;
    setFeatures((prevFeatures) =>
      e.target.checked
        ? [...prevFeatures, value]
        : prevFeatures.filter((feature) => feature !== value)
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

    formData.append("pictures", JSON.stringify(previouspictures));
    newPictures.forEach((file) => formData.append("pictures", file));

    mutate({ id: apartment._id, formData });
  }

  function onDeleteImagesHandler(selectedImages) {
    deleteImages({ id: apartment._id, files: selectedImages });
  }

  return (
    <div
      className="min-h-screen p-6 bg-transparent flex items-center justify-center
    "
    >
      <div className="container max-w-screen-lg mx-auto">
        <div>
          <h2 className="font-semibold text-xl text-gray-600 dark:text-gray-300">
            Uređivanje apartmana
          </h2>
          <p className="text-gray-500 mb-6 dark:text-gray-400">
            Izmjenite informacije koje želite i zatim spremite promjene.
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
                Dodajte fotografije
              </label>
              <input
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter  bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                type="file"
                name="pictures"
                onChange={onPicturesChangeHandler}
                placeholder="Pictures"
                multiple
              />
            </div>
            <div className="md:col-span-5">
              <div className="w-full flex justify-between items-center">
                <p className=" text-black dark:text-gray-200">
                  Prenesene fotografije:
                </p>
                <button
                  disabled={selectedImages.length === 0}
                  type="button"
                  onClick={() => onDeleteImagesHandler(selectedImages)}
                  className="bg-red-500 px-3 py-2 rounded-md disabled:opacity-30 enabled:hover:bg-red-600 transition-all ease-in-out duration-200 enabled:hover:cursor-pointer"
                >
                  Obriši selektirano
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {previouspictures && previouspictures.length > 0 ? (
                  previouspictures.map((image) => (
                    <label key={image} className="relative">
                      <img
                        className="w-full h-full object-cover object-center rounded-lg
                      duration-150 transition-all ease-in-out cursor-pointer"
                        src={`${BASE_URL}/${image}`}
                      />
                      <input
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedImages((prev) => [...prev, image]);
                          } else {
                            setSelectedImages((prev) =>
                              prev.filter((item) => item !== image)
                            );
                          }
                        }}
                        id="selectImg"
                        className="absolute top-2 left-3"
                        type="checkbox"
                      ></input>
                    </label>
                  ))
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700">
                    <p>No Image Available</p>
                  </div>
                )}
              </div>
              <div>{console.log(selectedImages)}</div>
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
              {isPending ? "Spremanje..." : "Spremi promjene"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const EditApartments = () => {
  const params = useParams();

  const {
    data: apartment,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.apartments.detail(params.id),
    queryFn: ({ signal }) => getApartment(params.id, { signal }),
  });

  if (isPending) return <p>Loading apartment...</p>;
  if (isError) return <p>{error.message}</p>;

  return <EditApartmentsForm apartment={apartment} key={apartment._id} />;
};

export default EditApartments;
