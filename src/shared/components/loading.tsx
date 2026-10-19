import { cn } from "@/lib/tailwind-utils";
import { LoadingOutlined } from "@ant-design/icons";

interface LoadingProps extends React.ComponentProps<"div"> {
  text?: string | null;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  isFullScreen?: boolean;
  onlyShowSpinner?: boolean;
  iconClassName?: string;
  textClassName?: string;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};

export function Loading({
  text = "در حال پردازش اطلاعات",
  size,
  isFullScreen,
  iconClassName,
  textClassName,
  onlyShowSpinner,
  ...otherProps
}: LoadingProps) {
  const appliedSize = size ? size : isFullScreen ? "2xl" : "md";

  return (
    <div
      {...otherProps}
      className={cn(
        "flex items-center justify-center gap-4 p-4",
        isFullScreen && "fixed inset-0 h-dvh w-dvw bg-white",
        otherProps.className,
      )}
    >
      <LoadingOutlined
        className={cn(
          sizeClasses[appliedSize],
          onlyShowSpinner && isFullScreen && "text-6xl",
          iconClassName,
        )}
      />

      {!onlyShowSpinner && text !== undefined && (
        <span className={cn(sizeClasses[appliedSize], textClassName)}>
          {text}
        </span>
      )}
    </div>
  );
}
