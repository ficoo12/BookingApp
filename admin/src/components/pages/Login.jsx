import { redirect } from "react-router-dom";
import LoginForm from "../LoginForm";

const Login = () => {
  return <LoginForm />;
};

export default Login;

export async function action({ request }) {
  const data = await request.formData();

  const authData = {
    username: data.get("username"),
    password: data.get("password"),
  };

  const link = "http://localhost:8080/api/user/login";

  const response = await fetch(link, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 442 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw new Error("Could not authenticate user.");
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

  return redirect("/");
}
