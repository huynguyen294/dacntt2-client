import { isIOS } from "@/utils";
import { useState, useEffect } from "react";

let mounted = false;
const usePwaInstaller = (onOpen = () => {}) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const handleInstall = async () => {
    if (isIOS()) return onOpen();

    if (deferredPrompt) {
      deferredPrompt.prompt();
    }
  };

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    if (!mounted) {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
      if (!isStandalone) window.addEventListener("beforeinstallprompt", handler);
      mounted = true;
    }

    // Cleanup listeners
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  return (deferredPrompt || isIOS()) && handleInstall;
};

export default usePwaInstaller;
