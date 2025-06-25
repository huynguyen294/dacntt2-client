import { useAppStore, useStudentStore } from "@/state";

const withStudentReady =
  (Component, Skeleton = () => null) =>
  (props) => {
    const user = useAppStore("user");
    const ready = useStudentStore("ready");
    if (user?.role === "student") {
      if (!ready) return <Skeleton />;
      return <Component {...props} />;
    }
    return <Component {...props} />;
  };

export default withStudentReady;
