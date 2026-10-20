import { Navigate } from "react-router";
import { routes } from "@/router/routes.config";

export default function HomePage() {
  return <Navigate to={routes.dashboard.path} replace />;
}
