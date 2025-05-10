import API from "./api";
import { getCommonParams, getServerErrorMessage } from "./utils";

export const getShifts = async (pager, order, search, filters) => {
  const params = getCommonParams(pager, order, search, filters);
  if (filters.levels) {
    params.push("filter=level:in:" + filters.levels.join(","));
  }
  if (filters.status) {
    params.push("filter=status:eq:" + filters.status);
  }
  const result = await API.get(`/api-v1/shifts?${params.join("&")}`);
  return result.data;
};

export const getShiftById = async (id) => {
  const result = await API.get(`/api-v1/shifts/${id}`);
  return result.data;
};

export const createShift = async (data) => {
  try {
    const result = await API.post(`/api-v1/shifts`, data);
    return { ok: true, newShift: result.data.newShift };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

export const updateShift = async (id, newData) => {
  try {
    const result = await API.patch(`/api-v1/shifts/${id}`, newData);
    return { ok: true, updatedShift: result.data.updatedShift };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

export const deleteShift = async (id) => {
  try {
    await API.delete(`/api-v1/shifts/${id}`);
    return { ok: true };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};
