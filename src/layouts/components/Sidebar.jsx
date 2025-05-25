import { useNavigate } from "@/hooks";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/state";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import {
  ChartColumnBig,
  ChevronDown,
  CircleDot,
  CircleHelp,
  ClipboardType,
  GraduationCap,
  Info,
  LayoutDashboard,
  List,
  Podcast,
  School,
  User,
} from "lucide-react";
import { useLocation } from "react-router";

const Sidebar = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const user = useAppStore("user");
  const sidebarItems = userSidebarItems[user?.role];

  const Section = ({ children, title, icon, active }) => {
    const activeProps = active ? { selectedKeys: new Set(["1"]) } : null;
    const Icon = icon || CircleDot;

    return (
      <Accordion className="px-0" {...activeProps}>
        <AccordionItem
          key="1"
          aria-label={title}
          title={title}
          classNames={{
            heading: cn(
              "px-6 rounded-large h-12 py-0 font-semibold hover:!bg-primary/5",
              active && "bg-primary/10 text-primary hover:!bg-primary/10"
            ),
            title: cn("text-foreground-500", active && "text-primary"),
            content: "py-1 space-y-1",
          }}
          startContent={
            <Icon
              size="21px"
              className={cn("w-6 text-foreground-500", active && "text-primary")}
              strokeWidth={active ? 2.5 : 2}
            />
          }
          indicator={
            <ChevronDown size="18px" className={cn(active && "text-primary")} strokeWidth={active ? 2.5 : 2} />
          }
        >
          {children}
        </AccordionItem>
      </Accordion>
    );
  };

  const SidebarItem = ({ item, isInSection }) => {
    let active;
    if (item.isDashboard) {
      active = pathname.replaceAll(`/`, "") === user.role;
      if (user.role === "student") active = pathname === "/";
    } else {
      active = pathname.includes(item.path);
    }

    const Icon = item.icon || CircleDot;

    return (
      <Button
        size="lg"
        fullWidth
        disableRipple
        disableAnimation
        variant="light"
        className={cn(
          "justify-start font-semibold text-foreground-500 hover:!bg-primary/5",
          active && "text-primary",
          active && !isInSection && "bg-primary/10 hover:!bg-primary/10"
        )}
        isDisabled={item.disabled}
        startContent={
          isInSection ? (
            <CircleDot size={active ? "9px" : "7px"} strokeWidth={active ? 6 : 3} className="w-6" />
          ) : (
            <Icon
              size="21px"
              className={cn("w-6 text-foreground-500", active && "text-primary")}
              strokeWidth={active ? 2.5 : 2}
            />
          )
        }
        onPress={() => navigate(item.path)}
      >
        {item.label}
      </Button>
    );
  };

  const generateSidebarItem = ({ section, sectionIcon, items, idx }) => {
    if (!section) return items.map((item) => <SidebarItem key={item.label} item={item} />);

    const sectionActive = Boolean(
      items.find((item) => (item.isDashboard ? item.path === pathname : pathname.includes(item.path)))
    );

    return (
      <Section key={section || idx} title={section} icon={sectionIcon} active={sectionActive}>
        {items.map((item) => (
          <SidebarItem key={item.label} item={item} isInSection />
        ))}
      </Section>
    );
  };

  return (
    sidebarItems && (
      <div className={cn("border-r-1 h-[100dvh] flex flex-col", className)}>
        <div className="h-[4rem] border-b-1 flex items-center justify-center text-primary-800">
          <div className="bg-primary/10 flex justify-center items-center mr-2 p-1 rounded-lg">
            <School size="20px" strokeWidth={2} />
          </div>
          <p className="text-lg font-semibold">Center Management</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 w-80 pb-10 space-y-1">
          {sidebarItems.map((section, idx) => generateSidebarItem({ ...section, idx }))}
        </div>
      </div>
    )
  );
};

const dashboard = { label: "Tổng quan", icon: LayoutDashboard };
const userSidebarItems = {
  admin: [
    { items: [{ ...dashboard, path: "/", isDashboard: true }] },
    {
      section: "Người dùng",
      sectionIcon: User,
      items: [
        { label: "Tài khoản", path: "/user-management/_" },
        { label: "Học viên", path: "/user-management/student" },
        { label: "Giáo viên", path: "/user-management/teacher" },
        { label: "Tư vấn viên", path: "/user-management/consultant" },
        { label: "Nhân viên học vụ/tài chính", path: "/user-management/finance-officer" },
      ],
    },
    {
      section: "Tuyển sinh",
      sectionIcon: Podcast,
      items: [
        { label: "Đăng ký ứng viên", path: "/register-admission" },
        { label: "Quản lý ứng viên", path: "/admissions" },
      ],
    },
    {
      section: "Đào tạo",
      sectionIcon: GraduationCap,
      items: [
        { label: "Chứng chỉ", path: "/certificates" },
        { label: "Khóa học", path: "/courses" },
        { label: "Lớp học", path: "/classes" },
        { label: "Lịch học", path: "/timetable" },
        { label: "Kỳ thi", path: "/exams" },
        { label: "Cài đặt đào tạo", path: "/training-settings" },
      ],
    },
    {
      section: "Báo cáo",
      sectionIcon: ChartColumnBig,
      items: [
        { label: "Báo cáo tuyển sinh", path: "/admission-report", disabled: true },
        { label: "Báo cáo tài chính", path: "/finance-report", disabled: true },
        { label: "Báo cáo đào tạo", path: "/edu-report", disabled: true },
      ],
    },
    {
      items: [
        { label: "Trung tâm trợ giúp", path: "/contact", icon: CircleHelp },
        { label: "Thông tin phần mềm", path: "/about", icon: Info },
      ],
    },
  ],
  teacher: [
    {
      items: [{ ...dashboard, path: "/", isDashboard: true }],
    },
  ],
  student: [
    {
      items: [{ ...dashboard, path: "/", isDashboard: true }],
    },
  ],
  consultant: [
    {
      items: [
        { ...dashboard, path: "/", isDashboard: true },
        { label: "Đăng ký ứng viên", path: "/register-admission", icon: ClipboardType },
        { label: "Quản lý ứng viên", path: "/admissions", icon: List },
        { label: "Danh sách lớp học", path: "/classes", icon: GraduationCap },
      ],
    },
  ],
};

export default Sidebar;
