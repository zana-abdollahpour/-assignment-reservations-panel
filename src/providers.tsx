import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, notification } from "antd";
import faIR from "antd/locale/fa_IR";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

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

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <StyleProvider layer>
        <ConfigProvider locale={faIR}>{children}</ConfigProvider>
      </StyleProvider>
    </QueryClientProvider>
  );
}
