import useOnline from "./useOnline";
import Dexie from "dexie";
import { studentApi, userApi } from "@/apis";
import { useAppStore } from "@/state";
import { useEffect } from "react";

const useInitialization = () => {
  const user = useAppStore("user");
  const isOnline = useAppStore("isOnline");

  useOnline();

  useEffect(() => {
    userApi.refreshProfile();
  }, []);

  useEffect(() => {
    //keep db for offline
    if (isOnline === false) dexieDB.open();
    //clear and create for new session
    if (isOnline === true) Dexie.delete("dacntt2");
  }, [isOnline]);

  useEffect(() => {
    // init for student
    (async () => {
      if (!user?.id || user?.role !== "student" || isOnline === null) return;
      if (isOnline) {
        await studentApi.init(user?.id);
      } else {
        await studentApi.initOffline();
      }
    })();
  }, [user?.id, isOnline]);

  return null;
};

export default useInitialization;
