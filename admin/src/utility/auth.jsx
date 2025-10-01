import { redirect } from "react-router-dom";

async function getNewAccessToken(token) {
  const link = "http://localhost:8080/api/user/refresh-token";

  const response = await fetch(link, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token }),
  });

  if (!response.ok) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("access_token_duration");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("refresh_token_duration");
    return null;
  }

  const responseData = await response.json();
  const accessToken = responseData.access_token;
  const refreshToken = responseData.refresh_token;

  const accessTokenDuration = new Date();
  accessTokenDuration.setMinutes(accessTokenDuration.getMinutes() + 5);
  const refreshTokenDuration = new Date();
  refreshTokenDuration.setHours(refreshTokenDuration.getHours() + 120);
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem(
    "access_token_duration",
    accessTokenDuration.toISOString()
  );
  localStorage.setItem("refresh_token", refreshToken);
  localStorage.setItem(
    "refresh_token_duration",
    refreshTokenDuration.toISOString()
  );

  return accessToken;
}
const getAccessTokenDuration = () => {
  const storedAccessTokenDuration = localStorage.getItem(
    "access_token_duration"
  );
  const currentDateObject = new Date();
  const storedAccessTokenDateObject = new Date(storedAccessTokenDuration);

  return storedAccessTokenDateObject.getTime() - currentDateObject.getTime();
};
const getRefreshTokenDuration = () => {
  const storedRefreshTokenDuration = localStorage.getItem(
    "refresh_token_duration"
  );
  const currentDateObject = new Date();
  const storedRefreshTokenDateObject = new Date(storedRefreshTokenDuration);

  return storedRefreshTokenDateObject.getTime() - currentDateObject.getTime();
};

export const tokenLoader = () => {
  const accessToken = localStorage.getItem("access_token");
  const accessTokenDuration = getAccessTokenDuration();
  const refreshToken = localStorage.getItem("refresh_token");
  const refreshTokenDuration = getRefreshTokenDuration();
  console.log(
    accessToken,
    accessTokenDuration,
    refreshToken,
    refreshTokenDuration
  );

  if (!accessToken && !refreshToken) return null;

  if (accessTokenDuration < 0 && refreshTokenDuration < 0) return "EXPIRED";
  else if (refreshToken && accessTokenDuration < 0 && refreshTokenDuration > 0)
    return getNewAccessToken(refreshToken);

  return accessToken;
};

export const checkLoginLoader = () => {
  return !tokenLoader() ? redirect("/login") : null;
};
