import { refreshProfile } from "@/apis";
import { useEffect } from "react";

const useInitialization = () => {
  useEffect(() => {
    refreshProfile();
  }, []);

  return null;
};

export default useInitialization;
