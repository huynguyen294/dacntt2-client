import { useStudentStore } from "@/state";

const withStudentReady =
  (Component, Skeleton = () => null) =>
  (props) => {
    const ready = useStudentStore("ready");
    if (!ready) return <Skeleton />;
    return <Component {...props} />;
  };

export default withStudentReady;
