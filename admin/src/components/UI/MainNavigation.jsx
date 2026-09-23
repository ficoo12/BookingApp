import { Form, NavLink } from "react-router-dom";
import { useTheme } from "../../utility/theme";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
// "/" needs `end`, otherwise it matches every nested route and stays active.

const subLinkClass = ({ isActive }) =>
  [
    "block rounded-md px-4 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100",
  ].join(" ");
const mainLinkClass = ({ isActive }) =>
  [
    "block rounded-md px-4 py-2 text-lg font-medium transition-colors",
    isActive
      ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100",
  ].join(" ");

const MainNavigation = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
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
            <NavLink end to="/" className={mainLinkClass}>
              Dashboard
            </NavLink>
          </li>
          <div
            className={`transition-all duration-300 ${
              openDropdown === "apartments"
                ? "max-h-[231px]"
                : "max-h-[40px] overflow-hidden"
            }`}
          >
            <div
              className="flex justify-between text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 rounded-md px-4 py-2 text-lg font-medium"
              onClick={() =>
                setOpenDropdown(
                  openDropdown === "apartments" ? null : "apartments"
                )
              }
            >
              <p>Apartments</p>
              <ChevronDownIcon
                className={`w-6 transition-transform duration-300 ${
                  openDropdown === "apartments" ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
            <li
              className={
                openDropdown === "apartments" ? "opacity-100" : "opacity-0"
              }
            >
              <NavLink to="/apartments" className={subLinkClass}>
                Apartment List
              </NavLink>
            </li>
            <li
              className={` transition-opacity duration-300 ${
                openDropdown ? "opacity-100" : "opacity-0"
              }`}
            >
              <NavLink to="/new-apartments" className={subLinkClass}>
                Add Apartment
              </NavLink>
            </li>
          </div>
          <div
            className={`transition-all duration-300 ${
              openDropdown === "priceList"
                ? "max-h-[231px]"
                : "max-h-[40px] overflow-hidden"
            }`}
          >
            <div
              className="flex justify-between text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 rounded-md px-4 py-2 text-lg font-medium"
              onClick={() =>
                setOpenDropdown(
                  openDropdown === "priceList" ? null : "priceList"
                )
              }
            >
              <p>Price Lists</p>
              <ChevronDownIcon
                className={`w-6 transition-transform duration-300 ${
                  openDropdown === "priceList" ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
            <li
              className={` transition-opacity duration-300 ${
                openDropdown === "priceList" ? "opacity-100" : "opacity-0"
              }`}
            >
              <NavLink to="/pricelists" className={subLinkClass}>
                Price List Overview
              </NavLink>
            </li>
            <li
              className={` transition-opacity duration-300 ${
                openDropdown === "priceList" ? "opacity-100" : "opacity-0"
              }`}
            >
              <NavLink to="/new-pricelist" className={subLinkClass}>
                Add Price List
              </NavLink>
            </li>
          </div>

          <li>
            <NavLink to="/reservations" className={mainLinkClass}>
              Reservations
            </NavLink>
          </li>
          <li>
            <NavLink to="/messages" className={mainLinkClass}>
              Messages
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
          {isDark ? "Light theme" : "Dark theme"}
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
