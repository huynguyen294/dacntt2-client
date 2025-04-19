import { useAppStore } from "@/state";
import { useMemo } from "react";
import { useLocation } from "react-router";
import { ROUTE_ROLES } from "@/constants";
import useNavigate from "./useNavigate";

const useAuthorizationRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppStore("user");

  const valid = useMemo(() => {
    const pathname = location.pathname;
    if (!user || pathname.includes(user.role)) return true;

    // student not have sub path
    if ((!pathname.includes(user.role) || pathname === "/") && user.role !== "student") {
      navigate("/" + user.role);
      return false;
    }

    let valid = true;
    ROUTE_ROLES.forEach((role) => {
      if (pathname.includes(role)) {
        navigate("/");
        valid = false;
      }
    });

    return valid;
  }, [user, location, navigate]);

  return valid;
};

export default useAuthorizationRedirect;
