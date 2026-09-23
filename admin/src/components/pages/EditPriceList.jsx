import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { getPriceList, updatePriceList } from "../../utility/api";
import { queryKeys } from "../../utility/queryKeys";

const toDateInputValue = (date) => format(new Date(date), "yyyy-MM-dd");

const EditPriceListForm = ({ priceList }) => {
  const navigator = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate,
    isPending,
    isError: isSubmitError,
    error: submitError,
  } = useMutation({
    mutationFn: updatePriceList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.priceLists.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.priceLists.detail(priceList._id),
      });
      navigator("/pricelists");
    },
  });

  const [priceListName, setPriceListName] = useState(
    priceList.priceListName
  );
  const [periods, setPeriods] = useState(
    priceList.periods.map((period) => ({
      startDate: toDateInputValue(period.startDate),
      endDate: toDateInputValue(period.endDate),
      pricePerNight: period.pricePerNight,
    }))
  );
  const [error, setError] = useState("");

  function onNameChangeHandler(e) {
    setPriceListName(e.target.value);
  }

  function onAddRangeHandler() {
    setPeriods((prevPeriods) => [
      ...prevPeriods,
      { startDate: "", endDate: "", pricePerNight: "" },
    ]);
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
      id: priceList._id,
      data: {
        priceListName,
        periods: periods.map((p) => ({
          ...p,
          pricePerNight: Number(p.pricePerNight),
        })),
      },
    });
  }

  return (
    <div className="min-h-screen p-6 bg-transparent flex items-center justify-center">
      <div className="container max-w-screen-lg mx-auto">
        <div>
          <h2 className="font-semibold text-xl text-gray-600 dark:text-gray-300">
            Edit price list
          </h2>
          <p className="text-gray-500 mb-6 dark:text-gray-400">
            Change the details you want, then save your changes.
          </p>
          <form
            className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 space-y-5 dark:bg-gray-800 dark:shadow-black/40"
            onSubmit={onSubmitHandler}
          >
            <div className="md:col-span-5">
              <label className="text-black dark:text-gray-200">
                Price list name
              </label>
              <input
                className="h-10 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                type="text"
                name="priceListName"
                value={priceListName}
                onChange={onNameChangeHandler}
                placeholder="Two-bedroom apartment price list"
                required
              />
            </div>

            <div className="md:col-span-5">
              <div className="flex justify-between items-center">
                <label className="text-black dark:text-gray-200">
                  Price ranges
                </label>
                <button
                  type="button"
                  onClick={onAddRangeHandler}
                  className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200"
                >
                  Add range +
                </button>
              </div>

              {periods.length === 0 && (
                <p className="text-gray-500 mt-2 dark:text-gray-400">
                  No ranges defined. Click &quot;Add range&quot; to add
                  one.
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
                        From date
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
                        To date
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
                        Price per night
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
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-red-600 dark:text-red-400">
                Enter a price list name and at least one fully completed range.
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

const EditPriceList = () => {
  const params = useParams();

  const {
    data: priceList,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.priceLists.detail(params.id),
    queryFn: ({ signal }) => getPriceList(params.id, { signal }),
  });

  if (isPending) return <p>Loading price list...</p>;
  if (isError) return <p>{error.message}</p>;

  return <EditPriceListForm priceList={priceList} key={priceList._id} />;
};

export default EditPriceList;
