import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  DesktopOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Layout, Menu, Typography } from "antd";
import type { MenuProps } from "antd";

const { Content, Sider } = Layout;

const menuItems: MenuProps["items"] = [
  {
    key: "/",
    icon: <HomeOutlined />,
    label: <Link to="/">خانه</Link>,
  },
  {
    key: "/dashboard",
    icon: <DesktopOutlined />,
    label: <Link to="/dashboard">داشبورد</Link>,
  },
];

function NavigationMenu({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const selectedKey = pathname === "/" ? "/" : "/dashboard";

  return (
    <Menu
      mode="inline"
      items={menuItems}
      selectedKeys={[selectedKey]}
      onClick={onNavigate}
      className="border-e-0!"
    />
  );
}

export function MainLayout() {
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Layout hasSider className="min-h-screen" dir="rtl">
      <Sider
        width={256}
        collapsedWidth={80}
        collapsed={desktopCollapsed}
        trigger={null}
        theme="light"
        className="hidden border-s border-gray-200 lg:block"
      >
        <div className="flex h-16 items-center justify-between px-4">
          {!desktopCollapsed && (
            <Typography.Title level={5} className="m-0!">
              پنل رزرو
            </Typography.Title>
          )}
          <Button
            type="text"
            aria-label={desktopCollapsed ? "باز کردن منو" : "بستن منو"}
            icon={
              desktopCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
            }
            onClick={() => setDesktopCollapsed((collapsed) => !collapsed)}
          />
        </div>
        <NavigationMenu />
      </Sider>

      <Layout className="min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
          <Button
            type="text"
            aria-label="منو"
            aria-expanded={mobileOpen}
            icon={mobileOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            onClick={() => setMobileOpen((open) => !open)}
          />
        </header>
        <Content className="min-h-screen p-4 lg:p-6">
          <Outlet />
        </Content>
      </Layout>

      <Drawer
        title="پنل رزرو"
        placement="right"
        width={280}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        styles={{ body: { padding: 0 } }}
      >
        <NavigationMenu onNavigate={() => setMobileOpen(false)} />
      </Drawer>
    </Layout>
  );
}
