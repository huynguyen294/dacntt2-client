import { useEffect } from "react";

import { resetAppData, useAppStore } from "@/state";
import { cryptoDecrypt, verifyUserToken } from "@/utils";
import { addToast } from "@heroui/toast";

const useVerifyUser = () => {
  const appActions = useAppStore("appActions");

  useEffect(() => {
    (async () => {
      let user = cryptoDecrypt(localStorage.getItem("profile"));
      console.log({ user });
      if (!user) return;

      user = JSON.parse(user);
      const { isRfTokenExpired } = await verifyUserToken();
      if (!isRfTokenExpired) {
        appActions.change({ user });
        return;
      }

      addToast({ color: "danger", title: "Phiên đăng nhập hết hạn!", description: "Vui lòng đăng nhập lại." });
      window.location.href = "/login";
      resetAppData();
    })();
  }, [appActions]);

  return null;
};

export default useVerifyUser;
