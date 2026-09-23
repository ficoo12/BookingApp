import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import {
  deleteApartmentImages,
  getApartment,
  getPriceLists,
  updateApartment,
} from "../../utility/api";
import { queryKeys } from "../../utility/queryKeys";
import { APARTMENT_FEATURES } from "../../utility/features";
import { BASE_URL } from "../../utility/config";
import ImageDropzone from "../UI/ImageDropzone";
import { useConfirm } from "../UI/ConfirmDeleteModal";

const EditApartmentsForm = ({ apartment }) => {
  const navigator = useNavigate();
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const [selectedImages, setSelectedImages] = useState([]);
  const previouspictures = apartment.pictures;
  const newPicturesRef = useRef();

  const [name, setName] = useState(apartment.name);
  const [desc, setDesc] = useState(apartment.desc);
  const [guests, setGuests] = useState(apartment.guests);
  const [type, setType] = useState(apartment.type);
  const [priceListId, setPriceListId] = useState(apartment.priceList_id ?? "");
  const [features, setFeatures] = useState(apartment.features);
  const [newPictures, setNewPictures] = useState([]);
  const [available, setAvailable] = useState(String(apartment.available));
  const [error, setError] = useState("");

  useEffect(() => {
    newPicturesRef.current = newPictures;
  }, [newPictures]);

  useEffect(() => {
    return () => {
      newPicturesRef.current.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []);

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

  function onPicturesSelectedHandler(files) {
    const picked = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
    }));
    setNewPictures((prev) => [...prev, ...picked]);
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
    newPictures.forEach((picture) => formData.append("pictures", picture.file));

    mutate({ id: apartment._id, formData });
  }

  async function onDeleteImagesHandler(selectedImages) {
    const confirmed = await confirm({
      title: "Delete photos",
      message: `Delete ${selectedImages.length} selected photo${
        selectedImages.length === 1 ? "" : "s"
      }? This cannot be undone.`,
    });
    if (!confirmed) return;

    deleteImages({ id: apartment._id, files: selectedImages });
  }

  function removeUploadedImage(image) {
    URL.revokeObjectURL(image.url);
    setNewPictures((prev) => prev.filter((img) => img !== image));
  }

  return (
    <div
      className="min-h-screen p-6 bg-transparent flex items-center justify-center
    "
    >
      <div className="container max-w-screen-lg mx-auto">
        <div>
          <button
            type="button"
            onClick={() => navigator("/apartments")}
            className="mb-4 flex items-center gap-1 rounded-md px-2 py-1 -ml-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            <ChevronLeftIcon className="size-4" aria-hidden="true" />
            Apartments List
          </button>
          <h2 className="font-semibold text-xl text-gray-600 dark:text-gray-300">
            Edit apartment
          </h2>
          <p className="text-gray-500 mb-6 dark:text-gray-400">
            Change the details you want, then save your changes.
          </p>
          <form
            className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 space-y-5 dark:bg-gray-800 dark:shadow-black/40"
            onSubmit={onSubmitHandler}
            encType="multipart/form-data"
          >
            <div className="md:col-span-5">
              <label className=" text-black dark:text-gray-200">
                Enter the apartment name
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
                Enter the apartment description
              </label>
              <textarea
                name="desc"
                placeholder="Apartment with a sea view..."
                className="h-50 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                value={desc}
                onChange={onDescChangeHandler}
                required
              ></textarea>
            </div>
            <div className="md:col-span-5">
              <label className=" text-black dark:text-gray-200">
                Select features
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
                Selected features: {JSON.stringify(features)}
              </p>
            </div>

            <div className="md:col-span-5">
              <label className=" text-black dark:text-gray-200">
                Enter the maximum number of guests
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
                Enter the apartment type
              </label>
              <input
                className="h-10 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                value={type}
                onChange={onTypeChangeHandler}
                type="text"
                name="type"
                placeholder="Three-bedroom apartment"
                required
              ></input>
            </div>
            <div className="md:col-span-5">
              <label className=" text-black dark:text-gray-200">
                Select a price list
              </label>
              <select
                className="h-10 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                name="priceList_id"
                value={priceListId}
                onChange={onPriceListChangeHandler}
                required
              >
                <option value="" disabled>
                  Select a price list
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
                Add photos
              </label>
              <div className="mt-1">
                <ImageDropzone onFiles={onPicturesSelectedHandler} />
              </div>
            </div>
            <div>
              <p className=" text-black dark:text-gray-200">
                New uploaded image/images:
              </p>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4">
              {newPictures && newPictures.length > 0 ? (
                newPictures.map((image) => (
                  <div key={image.id} className="relative">
                    <button
                      onClick={() => removeUploadedImage(image)}
                      type="button"
                      className="absolute bg-gray-700 border-gray-400 border-1 rounded-sm px-1 py-1 text-sm top-2 left-2 hover:cursor-pointer hover:bg-gray-900 transition-all ease-in-out duration-300"
                    >
                      Remove
                    </button>
                    <img
                      className="w-full h-full object-cover object-center rounded-lg
                      duration-150 transition-all ease-in-out cursor-pointer"
                      src={image.url}
                    ></img>
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700">
                  <p>No images uploaded yet</p>
                </div>
              )}
            </div>
            <div className="md:col-span-5">
              <div className="w-full flex justify-between items-center">
                <p className=" text-black dark:text-gray-200">
                  Uploaded photos:
                </p>
                <button
                  disabled={selectedImages.length === 0}
                  type="button"
                  onClick={() => onDeleteImagesHandler(selectedImages)}
                  className="bg-red-500 px-3 py-2 rounded-md disabled:opacity-30 enabled:hover:bg-red-600 transition-all ease-in-out duration-200 enabled:hover:cursor-pointer"
                >
                  Delete selected
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
                        checked={selectedImages.includes(image)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedImages((prev) => [...prev, image]);
                          } else {
                            setSelectedImages((prev) =>
                              prev.filter((item) => item !== image)
                            );
                          }
                        }}
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
            </div>
            <div className="md:col-span-5">
              <label className=" text-black dark:text-gray-200">
                Update availability
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
                Please fill in all required fields.
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
              {isPending ? "Saving..." : "Save changes"}
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
