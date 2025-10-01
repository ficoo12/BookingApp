import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { tokenLoader, checkLoginLoader } from "./utility/auth";
import ApartmentsContextProvider from "./store/apartments-context";
import ApartmentsForm from "./components/ApartmentsForm";
import Apartments from "./components/Apartments";
import RootLayout from "./components/UI/RootLayous";
import Home from "./components/pages/Home";
import EditApartments from "./components/pages/EditApartments";
import Reservations from "./components/pages/Reservations";
import Login, { action as loginAction } from "./components/pages/Login";
import { action as logoutAction } from "./components/Logout";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      loader: tokenLoader,
      id: "root",
      children: [
        {
          path: "/",
          element: <Home />,
          loader: checkLoginLoader,
        },
        {
          path: "/apartments",
          element: <Apartments />,
          loader: checkLoginLoader,
        },
        {
          path: "/new-apartments",
          element: <ApartmentsForm />,
          loader: checkLoginLoader,
        },
        {
          path: "/edit-apartments/:id",
          element: <EditApartments />,
        },
        {
          path: "/login",
          element: <Login />,
          action: loginAction,
        },
        {
          path: "/logout",
          action: logoutAction,
        },
        {
          path: "/reservations",
          element: <Reservations />,
          loader: checkLoginLoader,
        },
      ],
    },
  ]);
  return (
    <ApartmentsContextProvider>
      <RouterProvider router={router} />
    </ApartmentsContextProvider>
  );
}

export default App;
