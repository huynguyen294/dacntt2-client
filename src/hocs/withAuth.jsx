/* eslint-disable no-unused-vars */
import { useAuthorizationRedirect } from "@/hooks";
import { useAppStore } from "@/state";
import { cryptoDecrypt } from "@/utils";
import { Navigate } from "react-router";

const withAuth =
  (Component) =>
  ({
    title,
    breadcrumbItems,
    children,
    className,
    classNames,
    hideMenuButton,
    hideDashboard,
    isLoading,
    showLoader,
    ...other
  }) => {
    const props = {
      title,
      breadcrumbItems,
      children,
      className,
      classNames,
      hideMenuButton,
      hideDashboard,
      isLoading,
      showLoader,
    };

    const valid = useAuthorizationRedirect();
    const ready = useAppStore("ready");
    const profile = cryptoDecrypt(localStorage.getItem("profile"));
    const user = profile ? JSON.parse(profile) : null;

    if (!user?.id) return <Navigate to="/login" />;
    return valid && ready && <Component {...props} {...other} />;
  };

export default withAuth;
