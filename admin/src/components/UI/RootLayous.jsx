import { Outlet } from "react-router-dom";
import MainNavigation from "./MainNavigation";
const RootLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainNavigation></MainNavigation>
      <main className="min-w-0 flex-1 p-8">
        <Outlet></Outlet>
      </main>
    </div>
  );
};

export default RootLayout;
