import { getServerErrorMessage } from "./utils";
import API from "./api";

export const getUsers = async (pager, order, search, filters) => {
  const params = [];
  if (pager.pageSize) params.push("pageSize=" + pager.pageSize);
  if (pager.page) params.push("page=" + pager.page);
  if (search) params.push("searchQuery=" + search);

  const result = await API.get(`/api-v1/users?${params.join("&")}`);
  return result.data;
};

export const getUserById = async (id) => {
  const result = await API.get(`/api-v1/users/${id}`);
  return result.data;
};

export const signUp = async (data) => {
  try {
    await API.post(`/api-v1/users/sign-up`, data);
    return { ok: true };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

export const createUser = async (data) => {
  try {
    await API.post(`/api-v1/users`, data);
    return { ok: true };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

export const updateUser = async (id, newData) => {
  try {
    await API.patch(`/api-v1/users/${id}`, newData);
    return { ok: true };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};
