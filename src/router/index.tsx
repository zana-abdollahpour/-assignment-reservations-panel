import { BrowserRouter, Route, Routes } from "react-router";

import { HomeRoutes } from "@/router/home.routes";
import { DashboardRoutes } from "@/router/dashboard.routes";

import { MainLayout } from "@/shared/layouts/main-layout";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {HomeRoutes}
          {DashboardRoutes}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
