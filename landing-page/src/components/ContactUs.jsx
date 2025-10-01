import { useState } from "react";

const contactUs = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [message, setMessage] = useState("");
  const [text, setText] = useState();

  const sendMessage = async () => {
    if (!name || !email || !message) {
      setText("Please enter all informations");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setText(result.message);
      } else {
        setText(result.error || "Booking failed.");
      }
    } catch (error) {
      console.error(error);
      setText("An error occurred while sending message.");
    }
  };

  return (
    <section className="body-font relative  text-gray-400 bg-sky-400 mx-auto mt-20 rounded-xl">
      <div className="container mx-auto px-20 py-10">
        <div className="mb-12 flex w-full flex-col text-center">
          <h1 className="title-font mb-4 text-2xl font-bold text-slate-800 sm:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto text-base leading-relaxed lg:w-2/3 text-slate-600 font-medium">
            Obratite nam se za bilo kakva pitanja vezana uz smještaj ili
            okolinu!.
          </p>
        </div>

        <div className="mx-auto md:w-2/3 lg:w-1/2">
          <div className="-m-2 flex flex-wrap">
            <div className="w-1/2 p-2">
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="peer w-full rounded border border-gray-700 bg-slate-100 bg-opacity-40 py-1 px-3 text-base leading-8 text-slate-700 placeholder-transparent outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-slate-200 focus:ring-2 focus:ring-orange-300"
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                />
                <label
                  for="name"
                  className="absolute left-3 -top-6 bg-transparent text-sm leading-7 text-indigo-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:left-3 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-slate-800"
                >
                  Name
                </label>
              </div>
            </div>
            <div className="w-1/2 p-2">
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="peer w-full rounded border border-gray-700 bg-slate-100 bg-opacity-40 py-1 px-3 text-base leading-8 text-slate-700 placeholder-transparent outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-slate-200 focus:ring-2 focus:ring-orange-300"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label
                  for="name"
                  className="absolute left-3 -top-6 bg-transparent text-sm leading-7 text-indigo-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:left-3 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-slate-800"
                >
                  Email
                </label>
              </div>
            </div>
            <div className="mt-4 w-full p-2">
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  className="peer h-44 w-full rounded border border-gray-700 bg-slate-100 bg-opacity-40 py-1 px-3 text-base leading-8 text-slate-700 placeholder-transparent outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-slate-200 focus:ring-2 focus:ring-orange-300"
                  placeholder="message"
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <label
                  for="message"
                  className="absolute left-3 -top-6 bg-transparent text-sm leading-7 text-indigo-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:left-3 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-slate-800"
                >
                  Message
                </label>
              </div>
            </div>
            <div class="w-full p-2">
              <button
                onClick={sendMessage}
                className="px-10 py-2 rounded-lg bg-orange-300 text-slate-800 font-medium text-2xl hover:cursor-pointer hover:bg-orange-400"
              >
                Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default contactUs;
