import { lazy } from "react";
import { Route } from "react-router";
import { routes } from "@/router/routes.config";

const DashboardPage = lazy(() => import("@/pages/dashboard"));

export const DashboardRoutes = (
  <Route path={routes.dashboard.path}>
    <Route index element={<DashboardPage />}></Route>
  </Route>
);
