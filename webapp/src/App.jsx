import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/UI/RootLayout";
import FindingApartments from "./components/FindingApartments";
import AboutApartment from "./components/AboutApartment";
import PaymentPage from "./components/PaymentPage";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      id: "root",
      children: [
        {
          path: "/",
          element: <FindingApartments></FindingApartments>,
        },
        {
          path: "/more-info/:id",
          element: <AboutApartment />,
        },
        {
          path: "/payment/:id",
          element: <PaymentPage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
