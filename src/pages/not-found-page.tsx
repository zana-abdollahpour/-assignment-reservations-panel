import { Button, Result } from "antd";
import { Link } from "react-router";

import { routes } from "@/router/routes.config";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Result
        status="404"
        title="صفحه پیدا نشد"
        subTitle="صفحه‌ای که به دنبال آن هستید وجود ندارد یا جابه‌جا شده است."
        extra={
          <Button type="primary">
            <Link to={routes.dashboard.path}>بازگشت به داشبورد</Link>
          </Button>
        }
      />
    </div>
  );
}
