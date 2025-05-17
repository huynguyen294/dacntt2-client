import API from "./api";

const otherEnrollmentApis = {
  getByStudents: async (studentIds = [], otherParams = []) => {
    const params = [`filter=studentId:in:${studentIds.join(",")}`];
    params.push(...otherParams);
    const result = await API.get(`/api-v1/enrollments?${params.join("&")}`);
    return result.data;
  },
};

export default otherEnrollmentApis;
