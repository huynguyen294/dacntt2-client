import { NotFound } from "@/pages";
import adminRoutes from "./admin";
import authRoutes from "./auth";
import teacherRoutes from "./teacher";
import studentRoutes from "./student";

const appRoutes = [
  ...authRoutes,
  ...adminRoutes,
  ...teacherRoutes,
  ...studentRoutes,
  { path: "*", element: <NotFound /> },
];

export default appRoutes;
