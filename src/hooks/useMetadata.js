import { shiftApi } from "@/apis";
import { arrayToObject } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useMetadata = () => {
  const { data: shiftData, isLoading: shiftLoading } = useQuery({
    queryKey: ["shifts", "as-options"],
    queryFn: () => shiftApi.get({ paging: "false" }, { orderBy: "name", order: "asc" }, null, {}, ["fields=:basic"]),
  });

  const shiftObj = useMemo(() => {
    if (!shiftData?.rows) return {};
    return arrayToObject(shiftData?.rows, "id");
  }, [shiftData]);

  return { loading: shiftLoading, shifts: shiftData?.rows || [], shiftObj };
};

export default useMetadata;
