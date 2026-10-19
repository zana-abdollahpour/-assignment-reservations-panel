import { useEffect } from "react";
import type { FallbackProps } from "react-error-boundary";

import { Button } from "antd";

import { NODE_ENV } from "@/config/env";

export function ErrorBoundaryFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  useEffect(() => {
    if (NODE_ENV.IS_DEVELOPMENT) console.error(error);
  });

  return (
    <div className="mx-auto mt-8 flex max-w-5xl flex-col items-center justify-center px-4">
      <h1 className="mb-4 text-lg font-bold text-gray-900">
        متاسفانه خطایی پیش آمده است.
      </h1>

      <div className="mb-6 w-full max-w-2xl text-center">
        {!!error && typeof error === "object" && "message" in error && (
          <p
            dir="ltr"
            className="mb-2 rounded-lg bg-red-50 p-3 text-center font-mono text-sm wrap-break-word text-red-700 ring-1 ring-red-200"
          >
            {(error?.message as string) || "خطای ناشناخته"}
          </p>
        )}
        {NODE_ENV.IS_DEVELOPMENT && (
          <p className="text-sm text-gray-500">
            برای اطلاعات بیشتر کنسول مرورگر را چک کنید.
          </p>
        )}
      </div>

      <Button
        variant="solid"
        color="red"
        onClick={resetErrorBoundary}
        className="cursor-pointer"
      >
        تلاش مجدد
      </Button>
    </div>
  );
}
