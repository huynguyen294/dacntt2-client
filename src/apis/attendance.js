import API from "./api";

const create = async (list) => {
  try {
    const result = await API.post(`/api-v1/${key}`, { classAttendances: list });
    return { ok: true, created: result.data.created };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

const updateByClass = async (list) => {
  try {
    const result = await API.patch(`/api-v1/${key}`, { classAttendances: list });
    return { ok: true, updated: result.data.updated };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

const otherAttendanceApis = { create, updateByClass };
export default otherAttendanceApis;
