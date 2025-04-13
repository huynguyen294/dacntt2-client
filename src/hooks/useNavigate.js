import { useLocation, useNavigate as useRouterNavigate } from "react-router";

const useNavigate = () => {
  const location = useLocation();
  const routerNavigate = useRouterNavigate();
  const from = location.state?.from || "";

  return (path) => {
    const state = { from: location.pathname };

    if (typeof path === "function") {
      const to = path(from);
      routerNavigate(to, { state });
      return;
    }

    routerNavigate(path, { state });
  };
};

export default useNavigate;
