import { useEffect } from "react";

import { resetAppData, useAppStore } from "@/state";
import { cryptoDecrypt, verifyUserToken } from "@/utils";
import { addToast } from "@heroui/toast";
import useNavigate from "./useNavigate";

const useVerifyUser = () => {
  const navigate = useNavigate();
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

      addToast({ color: "danger", title: "Phiên đăng nhập hết hạn!", description: "Vui lòng đăng nhập lại." });
      navigate("/login");
      resetAppData();
    })();
  }, [appActions, navigate]);

  return null;
};

export default useVerifyUser;
