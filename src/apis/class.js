import API from "./api";
import { getCommonParams } from "./utils";

const getClassStudents = async (classId, order = null, otherParams = []) => {
  const params = getCommonParams(null, order, null, {});
  params.push(...otherParams);
  const result = await API.get(`/api-v1/classes/${classId}/students?${params.join("&")}`);
  return result.data;
};

const otherClassApis = { getClassStudents };

export default otherClassApis;
