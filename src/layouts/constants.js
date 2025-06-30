import {
  CalendarDays,
  ChartColumnBig,
  CircleDollarSign,
  ClipboardCheck,
  ClipboardType,
  GraduationCap,
  House,
  LayoutDashboard,
  LayoutGrid,
  List,
  ListChecks,
  Podcast,
  Star,
  User,
} from "lucide-react";

const dashboard = { label: "Trang chủ", icon: House };
const trainingSection = {
  section: "Đào tạo",
  sectionIcon: GraduationCap,
  items: [
    { label: "Chứng chỉ", path: "/certificates" },
    { label: "Khóa học", path: "/courses" },
    { label: "Lớp học", path: "/classes" },
    { label: "Lịch học", path: "/timetable" },
    // { label: "Kỳ thi", path: "/exams" },
    { label: "Cài đặt đào tạo", path: "/training-settings", disabled: true },
  ],
};
const financeSection = {
  section: "Tài chính",
  sectionIcon: CircleDollarSign,
  items: [
    { label: "Học phí lớp học", path: "/class-tuition" },
    { label: "Quản lý học phí", path: "/tuition-management" },
    { label: "Miễn giảm học phí", path: "/tuition-discount" },
    { label: "Mã Qr thanh toán", path: "/tuition-payment" },
    { label: "Cài đặt tài chính", path: "/finance-settings", disabled: true },
  ],
};

export const userSidebarItems = {
  admin: [
    {
      items: [
        { ...dashboard, path: "/", isDashboard: true },
        { label: "Bảng tin", path: "/information-sheet", icon: LayoutDashboard },
      ],
    },
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
    trainingSection,
    financeSection,
    {
      section: "Báo cáo",
      sectionIcon: ChartColumnBig,
      items: [
        { label: "Báo cáo tuyển sinh", path: "/admission-report" },
        { label: "Báo cáo tài chính", path: "/finance-report" },
        { label: "Báo cáo đào tạo", path: "/edu-report" },
      ],
    },
    // {
    //   items: [{ label: "Trung tâm trợ giúp", path: "/contact", icon: CircleHelp }],
    // },
  ],
  teacher: [
    {
      items: [
        { ...dashboard, path: "/", isDashboard: true },
        { label: "Lớp học", path: "/classes", icon: LayoutGrid },
        { label: "Lịch dạy", path: "/timetable", icon: CalendarDays },
        { label: "Chấm điểm", path: "/assessment/undefined/exercise/undefined", icon: ClipboardCheck },
        { label: "Điểm danh", path: "/attendance-check", icon: ListChecks },
      ],
    },
  ],
  student: [
    {
      items: [
        { ...dashboard, path: "/", isDashboard: true },
        { label: "Lớp học", path: "/classes", icon: LayoutGrid },
        { label: "Thời khóa biểu", path: "/timetable", icon: CalendarDays },
        // { label: "Lịch thi", path: "/exam-schedule", icon: Target },
        { label: "Kết quả học tập", path: "/scores", icon: Star },
        { label: "Học phí", path: "/tuition", icon: CircleDollarSign },
      ],
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
  "finance-officer": [
    {
      items: [
        { ...dashboard, path: "/", isDashboard: true },
        { label: "Học viên", path: "/user-management/student", icon: User },
      ],
    },
    financeSection,
    trainingSection,
  ],
};
