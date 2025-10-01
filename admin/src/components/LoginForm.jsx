import { Form, useActionData, useNavigation } from "react-router-dom";

function Login() {
  const data = useActionData();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="container max-w-screen-sm mx-auto mt-20">
      <div>
        <h2 className="font-semibold text-xl text-gray-600">Login form</h2>
        <p className="text-gray-500 mb-6">
          Ulogirajte se kako bi mogli upravljati svojim objektom
        </p>
        <Form
          method="POST"
          className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 space-y-5"
          autoComplete="off"
        >
          {data && data.errors && (
            <ul>
              {Object.values(data.errors).map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
          {data && data.message && <p>{data.message}</p>}
          <div className="md:col-span-5">
            <label className=" text-black">Username</label>
            <input
              className="h-10 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400"
              type="text"
              name="username"
              placeholder="Mmarkic"
              required
            ></input>
          </div>
          <div className="md:col-span-5">
            <label className=" text-black">Password</label>
            <input
              className="h-10 border border-gray-200 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400"
              type="password"
              name="password"
              placeholder="type password"
              required
            ></input>
          </div>
          <button
            disabled={isSubmitting}
            className="bg-sky-600 text-white px-6 py-4 rounded-lg text-md hover:bg-sky-900"
          >
            {isSubmitting ? "U tijeku" : "Login"}
          </button>
        </Form>
      </div>
    </div>
  );
}

export default Login;
