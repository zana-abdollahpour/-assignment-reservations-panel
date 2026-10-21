import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import faIR from "antd/locale/fa_IR";
import JalaliProvider from "antd-jalali-v5";

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <StyleProvider layer>
      <ConfigProvider direction="rtl" locale={faIR}>
        <JalaliProvider />
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
}
