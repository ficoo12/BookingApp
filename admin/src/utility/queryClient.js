import { QueryCache, QueryClient } from "@tanstack/react-query";
import { ApiError } from "./api";
import { clearSession } from "./session";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (
        error instanceof ApiError &&
        (error.status === 401 || error.status === 403)
      ) {
        clearSession();
        window.location.href = "/login";
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});
