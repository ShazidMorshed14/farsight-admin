import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 3 * 1000,
      staleTime: 5 * 60 * 1000,
      onSuccess: (response) => response?.data,
    },
  },
});

const QueryWrapper = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} position="bottom-right" /> */}
      {children}
    </QueryClientProvider>
  );
};

export default QueryWrapper;
