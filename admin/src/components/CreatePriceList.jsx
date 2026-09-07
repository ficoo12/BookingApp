import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPriceList } from "../utility/api";
import { queryKeys } from "../utility/queryKeys";

const emptyPeriod = () => ({ startDate: "", endDate: "", pricePerNight: "" });

const CreatePriceList = () => {
  const navigator = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate,
    isPending,
    isError: isSubmitError,
    error: submitError,
  } = useMutation({
    mutationFn: createPriceList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.priceLists.all });
      navigator("/pricelists");
    },
  });

  const [priceListName, setPriceListName] = useState("");
  const [periods, setPeriods] = useState([]);
  const [error, setError] = useState("");

  function onNameChangeHandler(e) {
    setPriceListName(e.target.value);
  }

  function onAddRangeHandler() {
    setPeriods((prevPeriods) => [...prevPeriods, emptyPeriod()]);
  }

  function onPeriodChangeHandler(index, field, value) {
    setPeriods((prevPeriods) =>
      prevPeriods.map((period, i) =>
        i === index ? { ...period, [field]: value } : period
      )
    );
  }

  function onRemovePeriodHandler(index) {
    setPeriods((prevPeriods) => prevPeriods.filter((_, i) => i !== index));
  }

  function onSubmitHandler(e) {
    e.preventDefault();

    const periodsValid =
      periods.length > 0 &&
      periods.every((p) => p.startDate && p.endDate && p.pricePerNight);

    if (!priceListName || !periodsValid) {
      setError(true);
      return;
    }

    setError(false);

    mutate({
      priceListName,
      periods: periods.map((p) => ({
        ...p,
        pricePerNight: Number(p.pricePerNight),
      })),
    });
  }

  return (
    <div className="min-h-screen p-6 bg-transparent flex items-center justify-center">
      <div className="container max-w-screen-lg mx-auto">
        <div>
          <h2 className="font-semibold text-xl text-gray-600 dark:text-gray-300">
            Dodajte novi cjenik
          </h2>
          <p className="text-gray-500 mb-6 dark:text-gray-400">
            Definirajte ime cjenika i raspone cijena po datumima.
          </p>
          <form
            className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 space-y-5 dark:bg-gray-800 dark:shadow-black/40"
            onSubmit={onSubmitHandler}
          >
            <div className="md:col-span-5">
              <label className="text-black dark:text-gray-200">
                Definirajte ime cjenika
              </label>
              <input
                className="h-10 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                type="text"
                name="priceListName"
                value={priceListName}
                onChange={onNameChangeHandler}
                placeholder="Dvosobni apartman cjenik"
                required
              />
            </div>

            <div className="md:col-span-5">
              <div className="flex justify-between items-center">
                <label className="text-black dark:text-gray-200">
                  Rasponi cijena
                </label>
                <button
                  type="button"
                  onClick={onAddRangeHandler}
                  className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200"
                >
                  Dodaj raspon +
                </button>
              </div>

              {periods.length === 0 && (
                <p className="text-gray-500 mt-2 dark:text-gray-400">
                  Nema definiranih raspona. Kliknite &quot;Definiraj
                  raspon&quot; za dodavanje.
                </p>
              )}

              <div className="space-y-3 mt-3">
                {periods.map((period, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end border border-gray-200 rounded p-3 dark:border-gray-700"
                  >
                    <div>
                      <label className="text-black dark:text-gray-200 text-sm">
                        Od datuma
                      </label>
                      <input
                        className="h-10 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                        type="date"
                        value={period.startDate}
                        onChange={(e) =>
                          onPeriodChangeHandler(
                            index,
                            "startDate",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="text-black dark:text-gray-200 text-sm">
                        Do datuma
                      </label>
                      <input
                        className="h-10 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                        type="date"
                        value={period.endDate}
                        onChange={(e) =>
                          onPeriodChangeHandler(
                            index,
                            "endDate",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="text-black dark:text-gray-200 text-sm">
                        Cijena po noćenju
                      </label>
                      <input
                        className="h-10 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                        type="number"
                        step="0.01"
                        value={period.pricePerNight}
                        onChange={(e) =>
                          onPeriodChangeHandler(
                            index,
                            "pricePerNight",
                            e.target.value
                          )
                        }
                        placeholder="120.00€"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemovePeriodHandler(index)}
                      className="h-10 border border-gray-300 rounded-md px-4 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200"
                    >
                      Ukloni
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-red-600 dark:text-red-400">
                Unesite ime cjenika i barem jedan potpuno popunjen raspon.
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
              {isPending ? "Spremanje..." : "Spremi cjenik"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePriceList;
