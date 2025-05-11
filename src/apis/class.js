import API from "./api";
import { generateCrudApi, getCommonParams } from "./utils";

const commonApi = generateCrudApi("classes");
const classApi = {
  ...commonApi,
  get: async (pager, order, search, filters) => {
    const params = getCommonParams(pager, order, search, filters);
    if (filters.levels) {
      params.push("filter=level:in:" + filters.levels.join(","));
    }
    if (filters.status) {
      params.push("filter=status:eq:" + filters.status);
    }
    const result = await API.get(`/api-v1/classes?${params.join("&")}`);
    return result.data;
  },
};

export default classApi;
