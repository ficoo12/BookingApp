import { Outlet } from "react-router-dom";

// Deliberately bare: the login screen renders without navigation, which only
// exists behind the auth guard on the admin branch.
const AuthLayout = () => {
  return <Outlet></Outlet>;
};

export default AuthLayout;
