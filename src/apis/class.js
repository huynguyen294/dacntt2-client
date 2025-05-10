import API from "./api";
import { getCommonParams, getServerErrorMessage } from "./utils";

export const getClasses = async (pager, order, search, filters) => {
  const params = getCommonParams(pager, order, search, filters);
  if (filters.levels) {
    params.push("filter=level:in:" + filters.levels.join(","));
  }
  if (filters.status) {
    params.push("filter=status:eq:" + filters.status);
  }
  const result = await API.get(`/api-v1/classes?${params.join("&")}`);
  return result.data;
};

export const getClassById = async (id) => {
  const result = await API.get(`/api-v1/classes/${id}`);
  return result.data;
};

export const createClass = async (data) => {
  try {
    const result = await API.post(`/api-v1/classes`, data);
    return { ok: true, newClass: result.data.newClass };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

export const updateClass = async (id, newData) => {
  try {
    const result = await API.patch(`/api-v1/classes/${id}`, newData);
    return { ok: true, updatedClass: result.data.updatedClass };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

export const deleteClass = async (id) => {
  try {
    await API.delete(`/api-v1/classes/${id}`);
    return { ok: true };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};
