import { useMemo } from "react";
import { createBrowserRouter } from "react-router";

import appRoutes from "@/routes";

const useRouter = () => {
  const routes = useMemo(() => {
    const list = [...appRoutes.auth, ...appRoutes.admin];
    return createBrowserRouter(list);
  }, []);

  return routes;
};

export default useRouter;
