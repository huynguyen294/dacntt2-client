import { getServerErrorMessage } from "./utils";
import { format, subDays } from "date-fns";
import API from "./api";
import { DATE_FORMAT } from "@/constants";

export const getUsers = async (pager, order, search, filters) => {
  const params = [];
  if (pager.pageSize) params.push("pageSize=" + pager.pageSize);
  if (pager.page) params.push("page=" + pager.page);
  if (search) params.push("searchQuery=" + search);
  if (order) {
    params.push("order=" + order.order);
    params.push("orderBy=" + order.orderBy);
  }
  if (filters.roles) {
    params.push("filter=role:in:" + filters.roles.join(","));
  }
  if (filters.createdAt) {
    const date = format(subDays(new Date(), filters.createdAt), DATE_FORMAT);
    params.push("filter=createdAt:gte:" + date);
  }

  const result = await API.get(`/api-v1/users?${params.join("&")}`);
  return result.data;
};

export const getUsersWithRole = async (pager, order, search, filters, role) => {
  const params = [];
  if (pager.pageSize) params.push("pageSize=" + pager.pageSize);
  if (pager.page) params.push("page=" + pager.page);
  if (search) params.push("searchQuery=" + search);
  if (order) {
    params.push("order=" + order.order);
    params.push("orderBy=" + order.orderBy);
  }
  if (filters.roles) {
    params.push("filter=role:in:" + filters.roles.join(","));
  }
  if (filters.createdAt) {
    const date = format(subDays(new Date(), filters.createdAt), DATE_FORMAT);
    params.push("filter=createdAt:gte:" + date);
  }

  const result = await API.get(`/api-v1/users/with-role/${role}?${params.join("&")}`);
  return result.data;
};

export const getUserById = async (id) => {
  const result = await API.get(`/api-v1/users/${id}`);
  return result.data;
};

export const getUserByIdWithRole = async (id, role) => {
  const result = await API.get(`/api-v1/users/${role}/${id}`);
  return result.data;
};

export const deleteUserById = async (id) => {
  try {
    await API.delete(`/api-v1/users/${id}`);
    return { ok: true };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

export const signUp = async (data) => {
  try {
    await API.post(`/api-v1/users/sign-up`, data);
    return { ok: true };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

export const createUserWithRole = async (data, role) => {
  try {
    await API.post(`/api-v1/users/${role}`, data);
    return { ok: true };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

export const updateUserWithRole = async (id, newData, role) => {
  try {
    await API.patch(`/api-v1/users/${role}/${id}`, newData);
    return { ok: true };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};
