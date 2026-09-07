import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../utility/api";
import { queryKeys } from "../utility/queryKeys";

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const GuestMessages = () => {
  const {
    data: messages,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.messages,
    queryFn: getMessages,
  });
  if (isPending) return <p>Loading messages...</p>;
  if (isError) return <p>{error.message}</p>;

  return (
    <div className="container mx-auto max-w-3xl">
      <h1>Poruke</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1">
        Upiti poslani putem kontakt forme.
      </p>

      {messages.length === 0 ? (
        <p className="mt-5 text-gray-600 dark:text-gray-400">
          Još nema primljenih poruka.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className="bg-white rounded-lg p-5 dark:bg-gray-800 flex gap-4"
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 flex items-center justify-center font-semibold">
                {getInitials(message.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="font-medium text-blue-950 dark:text-gray-100">
                    {message.name}
                  </p>
                  <a
                    href={`mailto:${message.email}`}
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {message.email}
                  </a>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {message.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuestMessages;
