import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  CalendarOutlined,
  DesktopOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Layout, Menu, Typography } from "antd";
import type { MenuProps } from "antd";

import { getPageTitle, routes } from "@/router/routes.config";

const { Content, Sider } = Layout;

const navigationRoutes = [
  {
    ...routes.home,
    icon: <HomeOutlined />,
  },
  {
    ...routes.dashboard,
    icon: <DesktopOutlined />,
  },
  {
    ...routes.bookings,
    icon: <CalendarOutlined />,
  },
  {
    ...routes.customers,
    icon: <UserOutlined />,
  },
  {
    ...routes.settings,
    icon: <SettingOutlined />,
  },
] as const;

const menuItems: MenuProps["items"] = navigationRoutes.map((route) => ({
  key: route.path,
  icon: route.icon,
  label: <Link to={route.path}>{route.title}</Link>,
}));

function NavigationMenu({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();

  const selectedKey = navigationRoutes.find(
    (route) =>
      pathname === route.path ||
      (route.path !== routes.home.path &&
        pathname.startsWith(`${route.path}/`)),
  )?.path;

  return (
    <Menu
      mode="inline"
      items={menuItems}
      selectedKeys={selectedKey ? [selectedKey] : []}
      onClick={onNavigate}
      className="border-e-0!"
    />
  );
}

export function MainLayout() {
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { pathname } = useLocation();
  const pageTitle = getPageTitle(pathname);

  return (
    <Layout hasSider className="h-dvh overflow-hidden" dir="rtl">
      <Sider
        width={256}
        collapsedWidth={80}
        collapsed={desktopCollapsed}
        trigger={null}
        theme="light"
        className="hidden h-dvh shrink-0 overflow-y-auto border border-gray-200 lg:block"
      >
        <div className="flex h-16 items-center justify-between px-4">
          {!desktopCollapsed && (
            <Typography.Title level={5} className="m-0!">
              پنل رزرو
            </Typography.Title>
          )}

          <Button
            type="default"
            aria-label={desktopCollapsed ? "باز کردن منو" : "بستن منو"}
            title={desktopCollapsed ? "باز کردن منو" : "بستن منو"}
            icon={
              desktopCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
            }
            className="h-10! w-10! shrink-0 rounded-lg! border-blue-200! bg-blue-50! text-blue-700! shadow-sm hover:border-blue-300! hover:bg-blue-100! hover:text-blue-800! focus-visible:ring-2! focus-visible:ring-blue-500!"
            onClick={() => setDesktopCollapsed((collapsed) => !collapsed)}
          />
        </div>

        <NavigationMenu />
      </Sider>

      <Layout className="h-full min-h-0 min-w-0">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              className="h-10! w-10! shrink-0 rounded-lg! border-blue-200! bg-blue-50! text-blue-700! shadow-sm hover:border-blue-300! hover:bg-blue-100! hover:text-blue-800! focus-visible:ring-2! focus-visible:ring-blue-500! lg:hidden"
              type="default"
              aria-label={mobileOpen ? "بستن منو" : "باز کردن منو"}
              title={mobileOpen ? "بستن منو" : "باز کردن منو"}
              aria-expanded={mobileOpen}
              icon={mobileOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
              onClick={() => setMobileOpen((open) => !open)}
            />

            <Typography.Title level={4} className="m-0! truncate">
              {pageTitle}
            </Typography.Title>
          </div>
        </header>

        <Content className="min-h-0 flex-1 overflow-y-auto p-4 lg:p-6">
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
