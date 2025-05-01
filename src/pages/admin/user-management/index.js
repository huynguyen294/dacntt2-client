import { ROLE_LABELS } from "@/constants";

export const userManagementBreadcrumbItems = [{ label: "Tài khoản", path: "/admin/user-management/_" }];
export const studentManagementBreadcrumbItems = [
  { label: ROLE_LABELS.student, path: "/admin/user-management/student" },
];
export const teacherManagementBreadcrumbItems = [
  { label: ROLE_LABELS.teacher, path: "/admin/user-management/teacher" },
];
export const consultantManagementBreadcrumbItems = [
  { label: ROLE_LABELS.consultant, path: "/admin/user-management/consultant" },
];
export const financeOfficerManagementBreadcrumbItems = [
  { label: ROLE_LABELS["finance-officer"], path: "/admin/user-management/finance-officer" },
];

export const breadcrumbItemsByRole = {
  admin: userManagementBreadcrumbItems,
  student: studentManagementBreadcrumbItems,
  teacher: teacherManagementBreadcrumbItems,
  consultant: consultantManagementBreadcrumbItems,
  "finance-officer": financeOfficerManagementBreadcrumbItems,
};
