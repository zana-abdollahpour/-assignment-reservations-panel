import { AntdProvider } from "./antd.provider";
import { ReactQueryProvider } from "./react-query.provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AntdProvider>{children}</AntdProvider>
    </ReactQueryProvider>
  );
}
