import { createContext, useEffect, useReducer } from "react";

export const ApartmentsContext = createContext({
  apartments: [],
  onNewApartments: function () {},
  onDeleteApartments: function () {},
  onEditApartments: function () {},
  onLoadingData: function () {},
});

function apartmentsReducer(state, action) {
  if (action.type === "ADD_APARTMENTS") {
    return [action.payload, ...state];
  }

  if (action.type === "LOAD_DATA") {
    return action.payload;
  }

  if (action.type === "DELETE_APARTMENTS") {
    return state.filter((apartment) => {
      return apartment._id !== action.payload;
    });
  }
  if (action.type === "EDIT_APARTMENTS") {
    return state.map((apartment) => {
      if (apartment._id === action.payload._id) return action.payload;
      return apartment;
    });
  }
  return state;
}

export default function ApartmentsContextProvider({ children }) {
  const [apartmentsState, apartmentsDispatch] = useReducer(
    apartmentsReducer,
    []
  );

  const fetchData = async () => {
    const token = localStorage.getItem("access_token");
    const response = await fetch("http://localhost:8080/api/apartments", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (response.status !== 400) {
      return await response.json();
    } else {
      throw new Error("error");
    }
  };

  useEffect(() => {
    fetchData()
      .then((data) => {
        apartmentsDispatch({
          type: "LOAD_DATA",
          payload: data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onLoadingApartmentsHandler = (data) => {
    fetchData()
      .then((data) => {
        apartmentsDispatch({ type: "LOAD_DATA", payload: data });
      })
      .catch((error) => {
        return error;
      });
  };

  async function onNewApartmentsHandler(data) {
    apartmentsDispatch({
      type: "ADD_APARTMENTS",
      payload: data,
    });
  }

  async function onDeleteApartmentsHandler(id) {
    apartmentsDispatch({
      type: "DELETE_APARTMENTS",
      payload: id,
    });
  }
  async function onEditApartmentsHandler(data) {
    apartmentsDispatch({
      type: "EDIT_APARTMENTS",
      payload: data,
    });
  }
  const ctxAparments = {
    apartments: apartmentsState,
    onNewApartments: onNewApartmentsHandler,
    onDeleteApartments: onDeleteApartmentsHandler,
    onEditApartments: onEditApartmentsHandler,
    onLoadingData: onLoadingApartmentsHandler,
  };
  return (
    <ApartmentsContext.Provider value={ctxAparments}>
      {children}
    </ApartmentsContext.Provider>
  );
}
