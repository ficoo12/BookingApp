import { useContext, useState } from "react";
import { ApartmentsContext } from "../../store/apartments-context";
import { useNavigate, useParams } from "react-router-dom";

const EditApartments = () => {
  const { apartments, onEditApartments } = useContext(ApartmentsContext);
  const navigator = useNavigate();

  const params = useParams();

  const currentApartment = apartments.filter(
    (apartment) => params.id === apartment._id
  );

  console.log(currentApartment);
  console.log(currentApartment[0]);

  const [name, setName] = useState(currentApartment[0].name);
  const [desc, setDesc] = useState(currentApartment[0].desc);
  const [guests, setGuests] = useState(currentApartment[0].guests);
  const [type, setType] = useState(currentApartment[0].type);
  const [price, setPrice] = useState(currentApartment[0].price);
  const [features, setFeatures] = useState(currentApartment[0].features);
  const [previouspictures, setPreviouspictures] = useState(
    currentApartment[0].pictures
  );
  const [newPictures, setNewPictures] = useState([]);
  const [available, setAvailable] = useState(currentApartment[0].available);
  const [done, setDone] = useState(currentApartment[0].done);
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

  function onPriceChangeHandler(e) {
    setPrice(e.target.value);
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

  async function updateData(formData) {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://localhost:8080/api/apartments/${params.id}`,
        {
          method: "PATCH",
          body: formData,
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const textResponse = await response.text();
      console.log("Raw response:", textResponse);

      const jsonResponse = JSON.parse(textResponse);
      return jsonResponse;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw error;
    }
  }

  function onSubmitHandler(e) {
    e.preventDefault();

    if (!name || !desc || !guests || !type || !price || !features) {
      setError(true);
      return;
    }

    setError(false);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("desc", desc);
    formData.append("guests", guests ? Number(guests) : 1);
    formData.append("type", type || "Apartment");
    formData.append("price", Number(price));
    formData.append(
      "available",
      typeof available === "boolean" ? available : true
    );
    formData.append("features", JSON.stringify(features));
    formData.append("done", false);

    formData.append("pictures", JSON.stringify(previouspictures));
    newPictures.forEach((file) => formData.append("pictures", file));
    console.log(formData);
    updateData(formData)
      .then((data) => {
        setName("");
        setDesc("");
        setGuests("");
        setType("");
        setPrice("");
        setFeatures([]);
        setPreviouspictures([]);
        onEditApartments(data);
        navigator("/apartments");
      })
      .catch((error) => console.log(error));
  }

  return (
    <div
      className="min-h-screen p-6 bg-transparent flex items-center justify-center
    "
    >
      <div className="container max-w-screen-lg mx-auto">
        <div>
          <h2 class="font-semibold text-xl text-gray-600">
            Uređivanje apartmana
          </h2>
          <p class="text-gray-500 mb-6">
            Izmjenite informacije koje želite i zatim spremite promjene.
          </p>
          <form
            className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 space-y-5"
            onSubmit={onSubmitHandler}
            encType="multipart/form-data"
          >
            <div className="md:col-span-5">
              <label className=" text-black">Unesite naziv apartmana</label>
              <input
                className="h-10 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400"
                type="text"
                name="name"
                value={name}
                onChange={onNameChangeHandler}
                placeholder="Cozy Beachside Apartment"
                required
              ></input>
            </div>
            <div className="md:col-span-5">
              <label className="text-black">Unesite opis apartmana</label>
              <textarea
                name="desc"
                placeholder="Apartman sa pogledom na more..."
                className="h-50 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400"
                value={desc}
                onChange={onDescChangeHandler}
                required
              ></textarea>
            </div>
            <div className="md:col-span-5">
              <label className=" text-black">Odaberite značajke</label>
              <div className="text-gray-400 space-x-5 ">
                <label>
                  <input
                    type="checkbox"
                    name="features"
                    value="Wifi"
                    onChange={onFeaturesChangeHandler}
                  />{" "}
                  Wifi
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="features"
                    value="Free parking"
                    onChange={onFeaturesChangeHandler}
                  />{" "}
                  Free parking
                </label>

                <label>
                  <input
                    type="checkbox"
                    name="features"
                    value="Bazen"
                    onChange={onFeaturesChangeHandler}
                  />{" "}
                  Bazen
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="features"
                    value=" Pet friendly"
                    onChange={onFeaturesChangeHandler}
                  />{" "}
                  Pet friendly
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="features"
                    value="Pogled na more"
                    onChange={onFeaturesChangeHandler}
                  />{" "}
                  Pogled na more
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="features"
                    value="Pogled na prirodu"
                    onChange={onFeaturesChangeHandler}
                  />{" "}
                  Pogled na prirodu
                </label>
              </div>
              <p class="text-black">
                Selektirane značajke: {JSON.stringify(features)}
              </p>
            </div>

            <div className="md:col-span-5">
              <label className=" text-black">
                Unesite maksimalan broj gostiju
              </label>
              <input
                className="h-10 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400"
                type="number"
                name="guests"
                value={guests}
                onChange={onGuestsChangeHandler}
                placeholder="4"
                required
              ></input>
            </div>

            <div className="md:col-span-5">
              <label className=" text-black">Unesite tip apartmana</label>
              <input
                className="h-10 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400"
                value={type}
                onChange={onTypeChangeHandler}
                type="text"
                name="type"
                placeholder="Trosobni apartman"
                required
              ></input>
            </div>
            <div className="md:col-span-5">
              <label className=" text-black">Unesite cijenu za nocenje</label>
              <input
                className="h-10 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400"
                type="text"
                name="price"
                placeholder="250.99€"
                value={price}
                onChange={onPriceChangeHandler}
              />
            </div>
            <div className="md:col-span-5">
              <label className=" text-black">Prenesite fotografije</label>
              <input
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter  bg-gray-50 text-gray-400"
                type="file"
                name="pictures"
                onChange={onPicturesChangeHandler}
                placeholder="Pictures"
                multiple
              />
            </div>
            <div className="md:col-span-5">
              <label className=" text-black">Ažurirajte dostupnost</label>
              <select
                className="h-10 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400"
                value={available}
                onChange={onAvailableChangeHandler}
                name="available"
                required
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>

            <button
              className="bg-sky-600 text-white px-6 py-4 rounded-lg text-md hover:bg-sky-900"
              type="submit"
            >
              Spremi promjene
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditApartments;
