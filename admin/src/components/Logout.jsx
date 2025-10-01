import { redirect } from "react-router-dom";

export function action() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("access_token_duration");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("refresh_token_duration");

  return redirect("/");
}
