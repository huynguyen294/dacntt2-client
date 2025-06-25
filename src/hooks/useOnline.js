import { useAppStore } from "@/state";
import { checkOnline } from "@/utils";
import { addToast } from "@heroui/toast";
import { useEffect } from "react";

const useOnline = () => {
  const user = useAppStore("user");
  const appActions = useAppStore("appActions");

  useEffect(() => {
    (async () => {
      const isOnline = await checkOnline("/favicon.ico");
      appActions.change("isOnline", isOnline);
    })();

    const handleOnline = () => {
      appActions.change("isOnline", true);
      // toast.error("Đã có kết nối internet trở lại");
    };
    const handleOffline = () => {
      appActions.change("isOnline", false);
      addToast({ color: "danger", title: "Lỗi!", description: "Mất kết nối internet" });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [user?.id]);
};

export default useOnline;
