import API from "./api";
import { getCommonParams } from "./utils";

const otherScheduleApis = {
  getByClass: async (classId, order, otherParams = []) => {
    const params = getCommonParams(null, order);
    params.push(...otherParams);

    const result = await API.get(`/api-v1/class-schedules/by-class/${classId}?${params.join("&")}`);
    return result.data;
  },
};

export default otherScheduleApis;
