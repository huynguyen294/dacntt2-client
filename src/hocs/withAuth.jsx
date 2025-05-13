/* eslint-disable no-unused-vars */
import { useAuthorizationRedirect } from "@/hooks";
import { cryptoDecrypt } from "@/utils";
import { Navigate } from "react-router";

const withAuth =
  (Component) =>
  ({ title, breadcrumbItems, children, className, hideMenuButton }) => {
    const props = { title, breadcrumbItems, children, className, hideMenuButton };

    const valid = useAuthorizationRedirect();
    const profile = cryptoDecrypt(localStorage.getItem("profile"));
    const user = profile ? JSON.parse(profile) : null;

    if (!user?.id) return <Navigate to="/login" />;
    return valid && <Component {...props} />;
  };

export default withAuth;
