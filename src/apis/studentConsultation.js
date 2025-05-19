import API from "./api";
import { getCommonParams } from "./utils";

const otherStudentConsultationApis = {
  get: async (pager, order, search, filters, otherParams = []) => {
    const params = getCommonParams(pager, order, search, filters);
    params.push(...otherParams);
    if (filters.status) {
      params.push("filter=status:eq:" + filters.status);
    }
    if (filters.consultantId) {
      params.push("filter=consultantId:eq:" + filters.consultantId);
    }
    const result = await API.get(`/api-v1/student-consultation?${params.join("&")}`);
    return result.data;
  },
};

export default otherStudentConsultationApis;
