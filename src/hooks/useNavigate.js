import { useAppStore } from "@/state";
import { useLocation, useNavigate as useRouterNavigate } from "react-router";

const useNavigate = (withRole = true) => {
  const location = useLocation();
  const routerNavigate = useRouterNavigate();
  const use = useAppStore("user");
  const from = location.state?.from || "";

  return (path, currentWithRole = withRole) => {
    const state = { from: location.pathname };

    if (typeof path === "function") {
      const to = path(from);
      routerNavigate(to, { state });
      return;
    }

    routerNavigate(currentWithRole ? "/" + use?.role + path : path, { state });
  };
};

export default useNavigate;
