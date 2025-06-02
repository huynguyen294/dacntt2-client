import API from "./api";

const checkLessons = async (classId) => {
  const result = await API.get(`/api-v1/class-attendances/check-lessons/${classId}`);
  return result.data;
};

const otherAttendanceApis = { checkLessons };
export default otherAttendanceApis;
