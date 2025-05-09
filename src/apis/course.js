import API from "./api";
import { getCommonParams, getServerErrorMessage } from "./utils";

export const getCourses = async (pager, order, search, filters) => {
  const params = getCommonParams(pager, order, search, filters);
  if (filters.levels) {
    params.push("filter=level:in:" + filters.levels.join(","));
  }
  if (filters.status) {
    params.push("filter=status:eq:" + filters.status);
  }
  const result = await API.get(`/api-v1/courses?${params.join("&")}`);
  return result.data;
};

export const getCourseById = async (id) => {
  const result = await API.get(`/api-v1/courses/${id}`);
  return result.data;
};

export const createCourse = async (data) => {
  try {
    const result = await API.post(`/api-v1/courses`, data);
    return { ok: true, newCourse: result.data.newCourse };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

export const updateCourse = async (id, newData) => {
  try {
    const result = await API.patch(`/api-v1/courses/${id}`, newData);
    return { ok: true, updatedCourse: result.data.updatedCourse };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

export const deleteCourse = async (id) => {
  try {
    await API.delete(`/api-v1/courses/${id}`);
    return { ok: true };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};
