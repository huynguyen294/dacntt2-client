import { createBrowserRouter, RouterProvider } from "react-router";
import { useVerifyUser } from "./hooks";

import { authRoutes } from "./pages/auth";
import { adminRoutes } from "./pages/admin";
import { teacherRoutes } from "./pages/teacher";
import { studentRoutes } from "./pages/student";
import { NotFound } from "./pages";

import "./App.css";

const App = () => {
  useVerifyUser();
  const router = createBrowserRouter(appRoutes);

  return <RouterProvider router={router} />;
};

const appRoutes = [
  ...authRoutes,
  ...adminRoutes,
  ...teacherRoutes,
  ...studentRoutes,
  { path: "*", element: <NotFound /> },
];

export default App;
