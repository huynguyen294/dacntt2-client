import { useAppStore } from "@/state";
import { useLocation, useNavigate as useRouterNavigate } from "react-router";

const useNavigate = (hookWithRole = true) => {
  const location = useLocation();
  const routerNavigate = useRouterNavigate();
  const user = useAppStore("user");
  const from = location.state?.from || "";

  return (path, navigateFnWithRole = hookWithRole) => {
    const state = { from: location.pathname };

    if (typeof path === "function") {
      const to = path(from);
      routerNavigate(to, { state });
      return;
    }

    let finalPath = path;
    if (navigateFnWithRole && user?.role !== "student") {
      finalPath = `/${user?.role}${path}`;
    }

    routerNavigate(finalPath, { state });
  };
};

export default useNavigate;
