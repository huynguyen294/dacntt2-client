import API from "./api";
import { getServerErrorMessage } from "./utils";

const create = async (list) => {
  try {
    const result = await API.post(`/api-v1/class-attendances`, { classAttendances: list });
    return { ok: true, created: result.data.created };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

const update = async (list) => {
  try {
    const result = await API.patch(`/api-v1/class-attendances`, { classAttendances: list });
    return { ok: true, updated: result.data.updated };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

const checkLessons = async (classId) => {
  const result = await API.get(`/api-v1/class-attendances/check-lessons/${classId}`);
  return result.data;
};

const otherAttendanceApis = { create, update, checkLessons };
export default otherAttendanceApis;
