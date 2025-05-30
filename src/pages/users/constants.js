import { ROLE_LABELS } from "@/constants";

export const userManagementBreadcrumbItems = [{ label: "Tài khoản", path: "/user-management/_" }];
export const studentManagementBreadcrumbItems = [{ label: ROLE_LABELS.student, path: "/user-management/student" }];
export const teacherManagementBreadcrumbItems = [{ label: ROLE_LABELS.teacher, path: "/user-management/teacher" }];
export const consultantManagementBreadcrumbItems = [
  { label: ROLE_LABELS.consultant, path: "/user-management/consultant" },
];
export const financeOfficerManagementBreadcrumbItems = [
  { label: ROLE_LABELS["finance-officer"], path: "/user-management/finance-officer" },
];

export const breadcrumbItemsByRole = {
  _: userManagementBreadcrumbItems,
  student: studentManagementBreadcrumbItems,
  teacher: teacherManagementBreadcrumbItems,
  consultant: consultantManagementBreadcrumbItems,
  "finance-officer": financeOfficerManagementBreadcrumbItems,
};
