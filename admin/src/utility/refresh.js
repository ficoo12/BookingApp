import { BASE_URL } from "./config";
import { clearSession, getRefreshToken, saveSession } from "./session";

// Single-flight guard: concurrent callers share one request. The server
// rotates the refresh token, so a second parallel call would send an
// already-consumed token and be rejected.
let refreshInFlight = null;

export function refreshAccessToken() {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = doRefresh().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

// Uses fetch directly rather than request() so it can never recurse back
// into the retry logic that calls it.
async function doRefresh() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const response = await fetch(`${BASE_URL}/api/user/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    clearSession();
    return null;
  }

  const data = await response.json();
  saveSession(data);
  return data.access_token;
}
