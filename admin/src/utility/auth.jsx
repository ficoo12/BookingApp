import { redirect } from "react-router-dom";
import { refreshAccessToken } from "./refresh";
import {
  getAccessToken,
  getAccessTokenDuration,
  getRefreshToken,
  getRefreshTokenDuration,
} from "./session";

// A pre-emptive check only: it saves a doomed round trip when the token is
// known to be stale. The API client refreshes on a rejected request anyway,
// so being wrong here costs one extra request, not the session.
export const tokenLoader = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  const accessTokenDuration = getAccessTokenDuration();
  const refreshTokenDuration = getRefreshTokenDuration();

  if (!accessToken && !refreshToken) return null;

  if (accessTokenDuration < 0 && refreshTokenDuration < 0) return "EXPIRED";

  if (refreshToken && accessTokenDuration < 0 && refreshTokenDuration > 0) {
    return refreshAccessToken();
  }

  return accessToken;
};

export const checkLoginLoader = async () => {
  const token = await tokenLoader();
  return !token || token === "EXPIRED" ? redirect("/login") : null;
};
