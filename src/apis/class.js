import API from "./api";
import { getCommonParams } from "./utils";

const otherClassApis = {
  get: async (pager, order, search, filters, otherParams = []) => {
    const params = getCommonParams(pager, order, search, filters);
    params.push(...otherParams);
    if (filters.levels) {
      params.push("filter=level:in:" + filters.levels.join(","));
    }
    if (filters.status) {
      params.push("filter=status:eq:" + filters.status);
    }
    if (filters.courseId) {
      params.push("filter=courseId:eq:" + filters.courseId);
    }
    if (filters.shiftId) {
      params.push("filter=shiftId:eq:" + filters.shiftId);
    }
    if (filters.teacherId) {
      params.push("filter=teacherId:eq:" + filters.teacherId);
    }
    const result = await API.get(`/api-v1/classes?${params.join("&")}`);
    return result.data;
  },
};

export default otherClassApis;
