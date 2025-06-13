import { studentApi, userApi } from "@/apis";
import { useAppStore } from "@/state";
import { useEffect } from "react";

const useInitialization = () => {
  const user = useAppStore("user");

  useEffect(() => {
    userApi.refreshProfile();
  }, []);

  useEffect(() => {
    // init for student
    (async () => {
      if (!user?.id || user?.role !== "student") return;
      await studentApi.init(user?.id);
    })();
  }, [user?.id]);

  return null;
};

export default useInitialization;
