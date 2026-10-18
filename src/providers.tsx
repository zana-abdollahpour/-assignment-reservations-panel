import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import faIR from "antd/locale/fa_IR";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyleProvider layer>
      <ConfigProvider locale={faIR}>{children}</ConfigProvider>;
    </StyleProvider>
  );
}
