import { Login, Register } from "@/pages/auth";

const authRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
];

export default authRoutes;
