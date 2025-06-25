import useOnline from "./useOnline";
import Dexie from "dexie";
import { studentApi, userApi } from "@/apis";
import { useAppStore } from "@/state";
import { useEffect } from "react";
import localDB from "@/configs/db";

const useInitialization = () => {
  const user = useAppStore("user");
  const isOnline = useAppStore("isOnline");

  console.log(isOnline);

  useOnline();

  useEffect(() => {
    if (isOnline) userApi.refreshProfile();
  }, [isOnline]);

  useEffect(() => {
    // init for student
    (async () => {
      if (!user?.id || user?.role !== "student" || isOnline === null) return;
      if (isOnline) {
        //clear and create for new session
        await Dexie.delete("dacntt2");
        await studentApi.init(user?.id);
      } else {
        //keep db for offline
        await localDB.open();
        await studentApi.initOffline();
      }
    })();
  }, [user?.id, isOnline]);

  return null;
};

export default useInitialization;
