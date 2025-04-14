import { useNavigate } from "@/hooks";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { GraduationCap, LayoutDashboard, User } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="border-r-1 p-6 h-[100dvh]">
      <p className="font-bold text-center text-primary">CENTER</p>
      <div className="flex-1 overflow-y-auto py-6 w-60">
        <Button
          className="justify-start font-semibold bg-default-100"
          fullWidth
          disableRipple
          disableAnimation
          variant="light"
          startContent={<LayoutDashboard size="18px" />}
        >
          Tổng quan
        </Button>
        <Button
          className="justify-start font-semibold"
          fullWidth
          disableRipple
          disableAnimation
          variant="light"
          startContent={<GraduationCap size="18px" />}
        >
          Khóa học
        </Button>
        <Divider className="my-4" />
        <Button
          className="justify-start font-semibold"
          fullWidth
          disableRipple
          disableAnimation
          variant="light"
          startContent={<User size="18px" />}
          onPress={() => navigate("/admin/user-management")}
        >
          Người dùng
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
