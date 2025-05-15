import { userApi } from "@/apis";
import { useEffect } from "react";

const useInitialization = () => {
  useEffect(() => {
    userApi.refreshProfile();
  }, []);

  return null;
};

export default useInitialization;
