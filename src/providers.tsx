import { ConfigProvider } from "antd";
import faIR from "antd/locale/fa_IR";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ConfigProvider locale={faIR}>{children}</ConfigProvider>;
}
