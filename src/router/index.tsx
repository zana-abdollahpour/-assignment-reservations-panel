import { Suspense } from "react";
import { BrowserRouter, Routes } from "react-router";

import { HomeRoutes } from "@/router/home.routes";
import { DashboardRoutes } from "@/router/dashboard.routes";

export default function Router() {
  return (
    <BrowserRouter>
      {/* TODO: add fallback */}
      <Suspense fallback={null}>
        <Routes>
          {HomeRoutes}
          {DashboardRoutes}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
