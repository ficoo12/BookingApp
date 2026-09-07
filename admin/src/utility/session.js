const KEYS = [
  "access_token",
  "access_token_duration",
  "refresh_token",
  "refresh_token_duration",
];

const ACCESS_TOKEN_MINUTES = 5;
const REFRESH_TOKEN_HOURS = 120;

export function getAccessToken() {
  return localStorage.getItem("access_token");
}

export function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}

export function saveSession({ access_token, refresh_token }) {
  const accessExpiry = new Date();
  accessExpiry.setMinutes(accessExpiry.getMinutes() + ACCESS_TOKEN_MINUTES);

  const refreshExpiry = new Date();
  refreshExpiry.setHours(refreshExpiry.getHours() + REFRESH_TOKEN_HOURS);

  localStorage.setItem("access_token", access_token);
  localStorage.setItem("access_token_duration", accessExpiry.toISOString());
  localStorage.setItem("refresh_token", refresh_token);
  localStorage.setItem("refresh_token_duration", refreshExpiry.toISOString());
}

export function clearSession() {
  KEYS.forEach((key) => localStorage.removeItem(key));
}

function durationUntil(key) {
  const stored = localStorage.getItem(key);
  return new Date(stored).getTime() - new Date().getTime();
}

export function getAccessTokenDuration() {
  return durationUntil("access_token_duration");
}

export function getRefreshTokenDuration() {
  return durationUntil("refresh_token_duration");
}
