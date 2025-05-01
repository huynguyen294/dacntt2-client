/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import { useLocation } from "react-router";
import { cryptoDecrypt } from "@/utils";
import { USER_ROLES } from "@/constants";
import useNavigate from "./useNavigate";

const useAuthorizationRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const valid = useMemo(() => {
    const pathname = location.pathname;
    let user = cryptoDecrypt(localStorage.getItem("profile"));
    user = user ? JSON.parse(user) : null;
    if (!user || pathname.includes(user.role)) return true;

    // student haven't sub path
    if ((!pathname.includes(user.role) || pathname === "/") && user.role !== "student") {
      setTimeout(() => navigate("/" + user.role));
      return false;
    }

    let valid = true;
    USER_ROLES.forEach((role) => {
      if (pathname.includes(role)) {
        setTimeout(() => navigate("/"));
        valid = false;
      }
    });

    return valid;
  }, [location]);

  return valid;
};

export default useAuthorizationRedirect;
