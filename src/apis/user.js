import API from "./api";

export const getUsers = async (pager, order) => {
  const params = [];
  if (pager.pageSize) params.push("pageSize=" + pager.pageSize);
  if (pager.page) params.push("page=" + pager.page);

  const result = await API.get(`/users?${params.join("&")}`);
  return result.data;
};
