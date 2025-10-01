import { Form, NavLink, useRouteLoaderData } from "react-router-dom";

const MainNavigation = () => {
  const token = useRouteLoaderData("root");
  return (
    <nav className="flex justify-center items-center mt-5 pb-10">
      <ul className="flex gap-4 items-center">
        <li>
          <NavLink to="/">Početna</NavLink>
        </li>
        <li>
          <NavLink to="/apartments">Svi Aparmani</NavLink>
        </li>
        <li>
          <NavLink to="/new-apartments">Dodaj Apartman</NavLink>
        </li>
        <li>
          <NavLink to="/reservations">Rezervacije</NavLink>
        </li>
        {!token && (
          <li>
            <NavLink
              className="bg-blue-500  hover:bg-blue-600 hover:cursor-pointer px-6 py-3 text-lg font-bold text-white rounded-md"
              to="/login"
            >
              LOGIN
            </NavLink>
          </li>
        )}
        {token && (
          <li>
            <Form action="/logout" method="POST">
              <button className="bg-blue-500  hover:bg-blue-600 hover:cursor-pointer px-4 py-2 text-lg font-bold text-white rounded-md">
                LOGOUT
              </button>
            </Form>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default MainNavigation;
