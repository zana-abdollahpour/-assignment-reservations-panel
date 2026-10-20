import { lazy } from "react";
import { Route } from "react-router";
import { routes } from "@/router/routes.config";

const HomePage = lazy(() => import("@/pages/home-page"));

export const HomeRoutes = (
  <Route path={routes.home.path} element={<HomePage />} />
);
