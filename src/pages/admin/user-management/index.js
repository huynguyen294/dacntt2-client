export const userManagementBreadcrumbItems = [{ label: "Tài khoản", path: "/admin/user-management" }];
export const addUserBreadcrumbItems = [
  ...userManagementBreadcrumbItems,
  { label: "Thêm tài khoản", path: "/admin/user-management/add" },
];
export const editUserBreadcrumbItems = [
  ...userManagementBreadcrumbItems,
  { label: "Sửa tài khoản", path: "/admin/user-management/edit" },
];
