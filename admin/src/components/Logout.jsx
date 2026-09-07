import { redirect } from "react-router-dom";
import { queryClient } from "../utility/queryClient";
import { logout } from "../utility/api";
import { clearSession, getRefreshToken } from "../utility/session";

export async function action() {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) await logout(refreshToken);
  } catch {
    // Server-side cleanup failed; log out locally anyway.
  }
  clearSession();
  queryClient.clear();
  return redirect("/login");
}
