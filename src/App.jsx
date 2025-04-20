import { Route, Routes, useHref } from "react-router";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";

import { useNavigate, useVerifyUser } from "./hooks";
import { Login, Register } from "./pages/auth";
import { AddUser, Admin, UserManagement } from "./pages/admin";
import { Teacher } from "./pages/teacher";
import { Student } from "./pages/student";
import { NotFound } from "./pages";

import "./App.css";

const App = () => {
  const navigate = useNavigate();
  useVerifyUser();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ToastProvider />

      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="admin">
          <Route index element={<Admin />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="user-management/add" element={<AddUser />} />
        </Route>

        <Route path="teacher">
          <Route index element={<Teacher />} />
        </Route>

        <Route path="/">
          <Route index element={<Student />} />
          <Route path="test" element={<Student />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </HeroUIProvider>
  );
};

export default App;
