import { DATE_FORMAT } from "@/constants";
import { format, subDays } from "date-fns";
import camelCase from "camelcase";
import API from "./api";

export const generateCrudApi = (key) => {
  return {
    get: async (pager, order, search, filters, otherParams = []) => {
      const params = getCommonParams(pager, order, search, filters);
      params.push(...otherParams);

      const result = await API.get(`/api-v1/${key}?${params.join("&")}`);
      return result.data;
    },

    getById: async (id, otherParams = []) => {
      const params = [];
      params.push(...otherParams);

      const result = await API.get(`/api-v1/${key}/${id}?${params.join("&")}`);
      return result.data;
    },

    create: async (data) => {
      try {
        if (Array.isArray(data)) {
          const result = await API.post(`/api-v1/${key}`, { [camelCase(key)]: data });
          return { ok: true, created: result.data.created };
        }
        const result = await API.post(`/api-v1/${key}`, data);
        return { ok: true, created: result.data.created };
      } catch (error) {
        return getServerErrorMessage(error);
      }
    },

    update: async (id, newData) => {
      try {
        if (Array.isArray(id)) {
          const result = await API.patch(`/api-v1/${key}`, { [camelCase(key)]: id });
          return { ok: true, updated: result.data.updated };
        }
        const result = await API.patch(`/api-v1/${key}/${id}`, newData);
        return { ok: true, updated: result.data.updated };
      } catch (error) {
        return getServerErrorMessage(error);
      }
    },

    delete: async (id) => {
      try {
        await API.delete(`/api-v1/${key}/${id}`);
        return { ok: true };
      } catch (error) {
        return getServerErrorMessage(error);
      }
    },
  };
};

export const getServerErrorMessage = (error) => {
  // const online = isOnline();
  //   if (online === false) return { ok: false, message: "Không kết nối internet." };
  if (error?.response?.data) return { ok: false, message: error?.response?.data.message, status: error.status };

  console.log(error);
  return { ok: false, status: error.status, message: "Hệ thống lỗi, vui lòng thử lại sau." };
};

export const generateFilterParams = (filter = {}) => {
  const params = [];
  if (Object.values(filter).filter(Boolean).length === 0) return params;

  const generateCondition = (field, value, operator = "eq") => {
    if (typeof value === "object" && value !== null) {
      const [opKey] = Object.keys(value);
      operator = opKey;
      value = value[opKey];
    }

    return `filter=${field}:${operator}:${value}`;
  };

  Object.keys(filter).forEach((field) => {
    let value = filter[field];

    if (Array.isArray(value)) {
      params.push(generateCondition(field, value.join(","), "in"));
    } else {
      params.push(generateCondition(field, value));
    }
  });

  return params;
};

export const getCommonParams = (pager, order, search, filters = {}) => {
  const params = [];
  if (pager?.pageSize) params.push("pageSize=" + pager.pageSize);
  if (pager?.page) params.push("page=" + pager.page);
  if (!pager?.pageSize && !pager?.page) params.push("paging=false");
  if (search) params.push("searchQuery=" + search);
  if (order?.order) params.push("order=" + order.order);
  if (order?.orderBy) params.push("orderBy=" + order.orderBy);

  const { createdAt, ...otherFilters } = filters;
  if (createdAt) {
    const date = format(subDays(new Date(), createdAt), DATE_FORMAT);
    params.push("filter=createdAt:gte:" + date);
  }

  params.push(...generateFilterParams(otherFilters));

  return params;
};
