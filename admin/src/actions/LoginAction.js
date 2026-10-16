import { redirect } from "react-router-dom";
import { saveSession } from "../utility/session";
import { BASE_URL } from "../utility/config";

export async function action({ request }) {
  const data = await request.formData();

  const authData = {
    username: data.get("username"),
    password: data.get("password"),
  };

  const link = `${BASE_URL}/api/user/login`;

  const response = await fetch(link, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 404 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw new Error("Could not authenticate user.");
  }

  const responseData = await response.json();
  saveSession(responseData);

  return redirect("/");
}
