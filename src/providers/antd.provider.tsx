import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import faIR from "antd/locale/fa_IR";

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <StyleProvider layer>
      <ConfigProvider direction="rtl" locale={faIR}>
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
}
