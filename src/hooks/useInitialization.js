import { scheduleApi, userApi } from "@/apis";
import studentApi from "@/apis/student";
import { useAppStore } from "@/state";
import useStudentStore from "@/state/useStudentStore";
import { useEffect } from "react";

const useInitialization = () => {
  const user = useAppStore("user");
  const state = useStudentStore();

  console.log(state);

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
