import { useNavigate } from "@/hooks";
import { cn } from "@/lib/utils";
import { Button } from "@heroui/button";
import { ChartSpline, GraduationCap, HandCoins, LayoutDashboard, School, User, Warehouse } from "lucide-react";
import { useLocation } from "react-router";

const Sidebar = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  return (
    <div className={cn("border-r-1 h-[100dvh] hidden sm:block", className)}>
      <div className="h-[4rem] flex items-center justify-center border-b-1 text-primary-800">
        <School size="22px" strokeWidth={2.5} className="mr-2" />
        <p className="font-bold text-lg">CENTER MANAGEMENT</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 w-80">
        <Button
          size="lg"
          className={cn("justify-start font-semibold", pathname === "/admin" && "bg-default-100")}
          fullWidth
          disableRipple
          disableAnimation
          variant="light"
          startContent={<LayoutDashboard size="21px" className="w-6" />}
          onPress={() => navigate("/admin")}
        >
          Tổng quan
        </Button>
        <p className="text-sm font-semibold text-foreground-600 my-3 ml-1">Quản lý</p>
        <Button
          size="lg"
          className={cn("justify-start font-semibold")}
          fullWidth
          disableRipple
          disableAnimation
          variant="light"
          startContent={<GraduationCap size="23px" className="w-6" />}
        >
          Khóa học
        </Button>
        <Button
          size="lg"
          className={cn("justify-start font-semibold")}
          fullWidth
          disableRipple
          disableAnimation
          variant="light"
          startContent={<Warehouse size="21px" className="w-6" />}
        >
          Lớp học
        </Button>
        <Button
          size="lg"
          className={cn("justify-start font-semibold")}
          fullWidth
          disableRipple
          disableAnimation
          variant="light"
          startContent={<HandCoins size="22px" className="w-6" />}
        >
          Học phí
        </Button>
        <Button
          size="lg"
          className={cn("justify-start font-semibold", pathname.includes("/user-management") && "bg-default-100")}
          fullWidth
          disableRipple
          disableAnimation
          variant="light"
          startContent={<User size="23px" strokeWidth={2.2} className="w-6" />}
          onPress={() => navigate("/admin/user-management")}
        >
          Tài khoản
        </Button>
        <p className="text-sm font-semibold text-foreground-600 my-3 ml-1">Báo cáo</p>
        <Button
          size="lg"
          className={cn("justify-start font-semibold")}
          fullWidth
          disableRipple
          disableAnimation
          variant="light"
          startContent={<ChartSpline size="22px" className="w-6" />}
          onPress={() => {}}
        >
          Doanh thu
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
