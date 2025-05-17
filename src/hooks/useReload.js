import { useCallback, useState } from "react";

const useReload = () => {
  const [lastedReloadedAt, setReload] = useState();

  const reload = useCallback(() => setReload(new Date().toString()), []);

  return [lastedReloadedAt, reload];
};

export default useReload;
