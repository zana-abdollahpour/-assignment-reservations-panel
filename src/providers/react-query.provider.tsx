import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { notification } from "antd";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => notification.error({ title: error.message }),
  }),

  mutationCache: new MutationCache({
    onError: (error) => notification.error({ title: error.message }),
  }),

  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      throwOnError: false,
      gcTime: 1000 * 60 * 60 * 12,
    },
  },
});

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
