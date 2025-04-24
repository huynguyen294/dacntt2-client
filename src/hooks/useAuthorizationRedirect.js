import { useMemo } from "react";
import { useLocation } from "react-router";
import { cryptoDecrypt } from "@/utils";
import useNavigate from "./useNavigate";
import { USER_ROLES } from "@/constants";

const useAuthorizationRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const valid = useMemo(() => {
    const pathname = location.pathname;
    let user = cryptoDecrypt(localStorage.getItem("profile"));
    user = user ? JSON.parse(user) : null;
    if (!user || pathname.includes(user.role)) return true;

    // student not have sub path
    if ((!pathname.includes(user.role) || pathname === "/") && user.role !== "student") {
      navigate("/" + user.role);
      return false;
    }

    let valid = true;
    USER_ROLES.forEach((role) => {
      if (pathname.includes(role)) {
        navigate("/");
        valid = false;
      }
    });

    return valid;
  }, [location, navigate]);

  return valid;
};

export default useAuthorizationRedirect;
