/* eslint-disable react-refresh/only-export-components */
import useThemeColor from "@/hooks/useThemeColor";
import { withOutAuth } from "@/hocs";
import { Spotlight } from "../components/aceternity";

const AuthLayout = ({ children }) => {
  useThemeColor("#000");

  return (
    <div className="dark bg-background relative h-[100dvh] w-[100dvw] overflow-hidden [&_p]:text-foreground-700 [&_input]:text-foreground-700">
      <Spotlight />
      {children}
    </div>
  );
};

export default withOutAuth(AuthLayout);
