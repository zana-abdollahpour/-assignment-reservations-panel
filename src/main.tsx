import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import "./index.css";

import Providers from "./providers";
import Router from "./router/index";

import { Loading } from "@/shared/components/loading";
import { ErrorBoundaryFallback } from "@/shared/components/error/error-boundary-fallback";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<Loading isFullScreen onlyShowSpinner />}>
        <Providers>
          <Router />
        </Providers>
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
);
