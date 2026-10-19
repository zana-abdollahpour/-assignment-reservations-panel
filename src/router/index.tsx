import { BrowserRouter, Routes } from "react-router";

import { HomeRoutes } from "@/router/home.routes";
import { DashboardRoutes } from "@/router/dashboard.routes";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {HomeRoutes}
        {DashboardRoutes}
      </Routes>
    </BrowserRouter>
  );
}
