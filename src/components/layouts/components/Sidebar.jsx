import { useNavigate } from "@/hooks";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/state";
import { Button } from "@heroui/button";
import { ChartSpline, GraduationCap, HandCoins, LayoutDashboard, School, User, Warehouse } from "lucide-react";
import { Fragment } from "react";
import { useLocation } from "react-router";

const Sidebar = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const user = useAppStore("user");
  const sidebarItems = userSidebarItems[user?.role];

  return (
    sidebarItems && (
      <div className={cn("border-r-1 h-[100dvh] hidden sm:block", className)}>
        <div className="h-[4rem] flex items-center justify-center border-b-1 text-primary-800">
          <School size="22px" strokeWidth={2.5} className="mr-2" />
          <p className="font-bold text-lg">CENTER MANAGEMENT</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 w-80">
          {sidebarItems.map(({ dashboard, section, items }, idx) => (
            <Fragment key={section || idx}>
              {dashboard && (
                <Button
                  size="lg"
                  className={cn("justify-start font-semibold", dashboard.path === pathname && "bg-default-100")}
                  fullWidth
                  disableRipple
                  disableAnimation
                  variant="light"
                  startContent={dashboard.icon}
                  onPress={() => navigate(dashboard.path)}
                >
                  {dashboard.label}
                </Button>
              )}
              {section && <p className="text-sm font-semibold text-foreground-600 my-3 ml-1">{section}</p>}
              {items.map((item) => (
                <Button
                  size="lg"
                  className={cn("justify-start font-semibold", pathname.includes(item.path) && "bg-default-100")}
                  fullWidth
                  disableRipple
                  disableAnimation
                  variant="light"
                  startContent={item.icon}
                  onPress={() => navigate(item.path)}
                >
                  {item.label}
                </Button>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    )
  );
};

const dashboard = { label: "Tổng quan", icon: <LayoutDashboard size="21px" className="w-6" /> };
const userSidebarItems = {
  admin: [
    {
      dashboard: { ...dashboard, path: "/admin" },
      section: "Quản lý",
      items: [
        { label: "Khóa học", path: "/admin/course-management", icon: <GraduationCap size="23px" className="w-6" /> },
        { label: "Lớp học", path: "/admin/class-management", icon: <Warehouse size="21px" className="w-6" /> },
        { label: "Tài khoản", path: "/admin/user-management", icon: <HandCoins size="22px" className="w-6" /> },
      ],
    },
    {
      section: "Báo cáo",
      items: [{ label: "Doanh thu", path: "/admin/revenue", icon: <ChartSpline size="22px" className="w-6" /> }],
    },
  ],
  teacher: [
    {
      dashboard: { ...dashboard, path: "/teacher" },
      items: [],
    },
  ],
  student: [
    {
      dashboard: { ...dashboard, path: "/" },
      items: [],
    },
  ],
};

export default Sidebar;
