/* eslint-disable no-unused-vars */
import { cryptoDecrypt } from "@/utils";
import { Navigate } from "react-router";

//if user already login user cannot go to this page (ex: LoginPage)
const withOutAuth = (Component) => (props) => {
  const profile = cryptoDecrypt(localStorage.getItem("profile"));
  const user = profile ? JSON.parse(profile) : null;

  if (user?.id) return <Navigate to={user.role === "student" ? "/" : "/" + user.role} />;
  return <Component {...props} />;
};

export default withOutAuth;
