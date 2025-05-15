import API from "./api";
import { getCommonParams } from "./utils";

const otherShiftApis = {
  get: async (pager, order, search, filters, otherParams = []) => {
    const params = getCommonParams(pager, order, search, filters);
    params.push(...otherParams);

    if (filters.levels) {
      params.push("filter=level:in:" + filters.levels.join(","));
    }
    if (filters.status) {
      params.push("filter=status:eq:" + filters.status);
    }

    const result = await API.get(`/api-v1/shifts?${params.join("&")}`);
    return result.data;
  },
};

export default otherShiftApis;
