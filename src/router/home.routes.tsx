import { lazy } from "react";
import { Route } from "react-router";

const HomePage = lazy(() => import("@/pages/home-page"));

export const HomeRoutes = <Route index element={<HomePage />} />;
