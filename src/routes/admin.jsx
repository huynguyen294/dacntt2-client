import { Admin, UserManagement } from "@/pages/Admin";

const adminRoutes = [
  { path: "/admin", element: <Admin /> },
  { path: "/admin/user-management", element: <UserManagement /> },
];

export default adminRoutes;
