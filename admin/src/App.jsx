import "./App.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { tokenLoader, checkLoginLoader } from "./utility/auth";
import ApartmentsForm from "./components/ApartmentsForm";
import CreatePriceList from "./components/CreatePriceList";
import PriceLists from "./components/pages/PriceLists";
import Apartments from "./components/Apartments";
import RootLayout from "./components/UI/RootLayous";
import AuthLayout from "./components/UI/AuthLayout";
import Home from "./components/pages/Home";
import EditApartments from "./components/pages/EditApartments";
import EditPriceList from "./components/pages/EditPriceList";
import Reservations from "./components/pages/Reservations";
import Login, { action as loginAction } from "./components/pages/Login";
import { action as logoutAction } from "./components/Logout";
import GuestMessages from "./components/GuestMessages";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./utility/queryClient";
import { ThemeProvider } from "./utility/theme";

// The root is pathless so it can hold the session for both branches: it keeps
// id "root" for useRouteLoaderData, while the two layouts below decide whether
// navigation is rendered. The guard sits once on the admin branch rather than
// on each route inside it.
const router = createBrowserRouter([
  {
    element: <Outlet></Outlet>,
    loader: tokenLoader,
    id: "root",
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <Login />,
            action: loginAction,
          },
        ],
      },
      {
        element: <RootLayout />,
        loader: checkLoginLoader,
        // A matched route's loader is not re-run on navigations that leave it
        // matched, so without this the guard would only fire on entering the
        // branch and an expiry mid-session would go unnoticed until reload.
        shouldRevalidate: () => true,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/apartments",
            element: <Apartments />,
          },
          {
            path: "/new-apartments",
            element: <ApartmentsForm />,
          },
          {
            path: "/pricelists",
            element: <PriceLists />,
          },
          {
            path: "/new-pricelist",
            element: <CreatePriceList />,
          },
          {
            path: "/edit-apartments/:id",
            element: <EditApartments />,
          },
          {
            path: "/edit-pricelist/:id",
            element: <EditPriceList />,
          },
          {
            path: "/reservations",
            element: <Reservations />,
          },
          {
            path: "/messages",
            element: <GuestMessages />,
          },
        ],
      },
      {
        path: "/logout",
        action: logoutAction,
      },
    ],
  },
]);

// ThemeProvider sits outside the router rather than inside RootLayout so the
// login branch is themed too. It goes above QueryClientProvider only because
// the two are independent and the theme is the more static of the pair.
function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
