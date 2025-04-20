import Admin from "./Admin";
import AddUser from "./user-management/AddUser";
import UserManagement from "./user-management/UserManagement";

const adminRoutes = [
  { path: "/admin", element: <Admin /> },
  { path: "/admin/user-management", element: <UserManagement /> },
  { path: "/admin/user-management/add", element: <AddUser /> },
];

export default adminRoutes;
