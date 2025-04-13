import { Spotlight } from "../aceternity";

const LoginLayout = ({ children }) => {
  return (
    <div className="dark bg-background relative h-[100dvh] w-[100dvw] overflow-hidden [&_p]:text-foreground-700 [&_input]:text-foreground-700">
      <Spotlight />
      {children}
    </div>
  );
};

export default LoginLayout;
