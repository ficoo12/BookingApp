import { Form, NavLink } from "react-router-dom";
import { useTheme } from "../../utility/theme";

// "/" needs `end`, otherwise it matches every nested route and stays active.
const linkClass = ({ isActive }) =>
  [
    "block rounded-md px-4 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100",
  ].join(" ");

const MainNavigation = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="px-6 py-6">
        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Booking Admin
        </p>
      </div>
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          <li>
            <NavLink end to="/" className={linkClass}>
              Početna
            </NavLink>
          </li>
          <li>
            <NavLink to="/apartments" className={linkClass}>
              Svi Aparmani
            </NavLink>
          </li>
          <li>
            <NavLink to="/new-apartments" className={linkClass}>
              Dodaj Apartman
            </NavLink>
          </li>
          <li>
            <NavLink to="/pricelists" className={linkClass}>
              Svi Cjenici
            </NavLink>
          </li>
          <li>
            <NavLink to="/new-pricelist" className={linkClass}>
              Dodaj Cjenik
            </NavLink>
          </li>
          <li>
            <NavLink to="/reservations" className={linkClass}>
              Rezervacije
            </NavLink>
          </li>
          <li>
            <NavLink to="/messages" className={linkClass}>
              Poruke
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="space-y-2 border-t border-gray-200 p-3 dark:border-gray-800">
        <button
          type="button"
          onClick={toggleTheme}
          // aria-pressed rather than a label change: screen readers announce
          // the state, so the name can stay stable between presses.
          aria-pressed={isDark}
          className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        >
          <span aria-hidden="true">{isDark ? "☀️" : "🌙"}</span>
          {isDark ? "Svijetla tema" : "Tamna tema"}
        </button>
        <Form action="/logout" method="POST">
          <button className="w-full rounded-md bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 hover:cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700">
            LOGOUT
          </button>
        </Form>
      </div>
    </aside>
  );
};

export default MainNavigation;
