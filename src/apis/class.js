import API from "./api";
import { getCommonParams } from "./utils";

const getClassStudents = async (classId, order = null, otherParams = []) => {
  const params = getCommonParams(null, order, null, {});
  params.push(...otherParams);
  const result = await API.get(`/api-v1/classes/${classId}/students?${params.join("&")}`);
  return result.data;
};

const otherClassApis = {
  getClassStudents,
  get: async (pager = null, order = null, search = null, filters = {}, otherParams = []) => {
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
