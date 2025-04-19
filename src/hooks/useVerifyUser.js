import { useEffect } from "react";

import { resetAppData, useAppStore } from "@/state";
import { cryptoDecrypt, verifyUserToken } from "@/utils";

const useVerifyUser = () => {
  const appActions = useAppStore("appActions");

  useEffect(() => {
    (async () => {
      let user = cryptoDecrypt(localStorage.getItem("profile"));
      if (!user) return;

      user = JSON.parse(user);
      const { isRfTokenExpired } = await verifyUserToken();
      if (!isRfTokenExpired) {
        appActions.change({ user });
        return;
      }

      window.location.href = "/login";
      resetAppData();
    })();
  }, [appActions]);

  return null;
};

export default useVerifyUser;
