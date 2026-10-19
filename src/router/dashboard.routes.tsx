import { lazy } from "react";
import { Route } from "react-router";

const DashboardPage = lazy(() => import("@/pages/dashboard"));

export const DashboardRoutes = (
  <Route path="/dashboard">
    <Route index element={<DashboardPage />}></Route>
  </Route>
);
