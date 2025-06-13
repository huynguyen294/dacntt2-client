import { useStudentStore } from "@/state";

const withStudentAdditionalReady =
  (Component, Skeleton = () => null) =>
  (props) => {
    const { ready, additionalReady } = useStudentStore(["ready", "additionalReady"]);

    if (!ready || !additionalReady) return <Skeleton />;
    return <Component {...props} />;
  };

export default withStudentAdditionalReady;
