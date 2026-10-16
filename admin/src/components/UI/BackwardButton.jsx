import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

export default function BackwardButton({ btnText, route }) {
  const navigator = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigator(route)}
      className="mb-4 flex items-center gap-1 rounded-md px-2 py-1 -ml-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
    >
      <ChevronLeftIcon className="size-4" aria-hidden="true" />
      {btnText}
    </button>
  );
}
