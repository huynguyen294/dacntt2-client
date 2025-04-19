import { AddUser, Admin, UserManagement } from "@/pages/admin-";

const adminRoutes = [
  { path: "/admin", element: <Admin /> },
  { path: "/admin/user-management", element: <UserManagement /> },
  { path: "/admin/user-management/add", element: <AddUser /> },
];

export default adminRoutes;
