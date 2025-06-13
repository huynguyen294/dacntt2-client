import { useLayoutEffect } from "react";

import { resetAppData, useAppStore } from "@/state";
import { cryptoDecrypt, verifyUserToken } from "@/utils";
import { addToast } from "@heroui/toast";
import useNavigate from "./useNavigate";

const useVerifyUser = () => {
  const navigate = useNavigate(false);
  const appActions = useAppStore("appActions");

  useLayoutEffect(() => {
    (async () => {
      let user = cryptoDecrypt(localStorage.getItem("profile"));
      if (!user) return;

      user = JSON.parse(user);
      appActions.change({ user, ready: true });
      const { isRfTokenExpired } = await verifyUserToken();
      if (isRfTokenExpired) {
        addToast({ color: "danger", title: "Phiên đăng nhập hết hạn!", description: "Vui lòng đăng nhập lại." });
        navigate("/login");
        resetAppData();
      }
    })();
  }, [appActions, navigate]);

  return null;
};

export default useVerifyUser;
