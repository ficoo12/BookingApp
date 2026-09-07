import { BASE_URL } from "./config";
import { getAccessToken } from "./session";
import { refreshAccessToken } from "./refresh";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Reads the body without assuming it is JSON: a 500 from Express can be an
// HTML error page, and DELETE responses may be empty.
async function parseBody(response) {
  if (response.status === 204) return null;

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function request(
  path,
  { method = "GET", body, signal, isRetry = false } = {}
) {
  const token = getAccessToken();
  const isFormData = body instanceof FormData;

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  // FormData must set its own Content-Type so multer gets the multipart boundary.
  if (body && !isFormData) headers["Content-Type"] = "application/json";

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    signal,
  });

  // verifyToken answers 401 for a missing header and 403 for an expired or
  // invalid token. Either way the refresh token may still be good, so renew
  // once and replay the request rather than failing the user's action.
  if ((response.status === 401 || response.status === 403) && !isRetry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request(path, { method, body, signal, isRetry: true });
    }
  }

  const payload = await parseBody(response);

  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? response.statusText,
      response.status
    );
  }

  return payload;
}

// The write endpoints answer with { message, apartment } rather than the
// document itself.
const unwrapApartment = (payload) => payload?.apartment ?? payload;

export function getApartments({ signal } = {}) {
  return request("/api/apartments", { signal });
}

export function getApartment(id, { signal } = {}) {
  return request(`/api/apartments/${id}`, { signal }).then((data) =>
    Array.isArray(data) ? data[0] : data
  );
}

export function createApartment(formData) {
  return request("/api/apartments", {
    method: "POST",
    body: formData,
  }).then(unwrapApartment);
}

export function updateApartment({ id, formData }) {
  return request(`/api/apartments/${id}`, {
    method: "PATCH",
    body: formData,
  }).then(unwrapApartment);
}

export function deleteApartmentImages({ id, files }) {
  return request(`/api/apartments/images/${id}`, {
    method: "DELETE",
    body: files,
  }).then(unwrapApartment);
}

export function deleteApartment(id) {
  return request(`/api/apartments/${id}`, { method: "DELETE" }).then(
    unwrapApartment
  );
}

export function getReservations({ signal } = {}) {
  return request("/api/reservations", { signal });
}

export function getMessages({ signal } = {}) {
  return request("/api/contact", { signal });
}

export function getPriceLists({ signal } = {}) {
  return request("/api/pricelist", { signal });
}

export function getPriceList(id, { signal } = {}) {
  return request(`/api/pricelist/${id}`, { signal });
}

// The write endpoints answer with { message, priceList } rather than the
// document itself.
const unwrapPriceList = (payload) => payload?.priceList ?? payload;

export function createPriceList(data) {
  return request("/api/pricelist", {
    method: "POST",
    body: data,
  });
}

export function updatePriceList({ id, data }) {
  return request(`/api/pricelist/${id}`, {
    method: "PATCH",
    body: data,
  }).then(unwrapPriceList);
}

export function deletePriceList(id) {
  return request(`/api/pricelist/${id}`, { method: "DELETE" }).then(
    unwrapPriceList
  );
}

export function logout(refreshToken) {
  return request("/api/user/logout", {
    method: "POST",
    body: { refresh_token: refreshToken },
  });
}
