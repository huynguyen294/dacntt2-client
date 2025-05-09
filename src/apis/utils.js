import { DATE_FORMAT } from "@/constants";
import { format, subDays } from "date-fns";

export const getServerErrorMessage = (error) => {
  // const online = isOnline();
  //   if (online === false) return { ok: false, message: "Không kết nối internet." };
  if (error?.response?.data) return { ok: false, message: error?.response?.data.message, status: error.status };

  console.log(error);
  return { ok: false, status: error.status, message: "Hệ thống lỗi, vui lòng thử lại sau." };
};

export const getCommonParams = (pager, order, search, filters) => {
  const params = [];
  if (pager.pageSize) params.push("pageSize=" + pager.pageSize);
  if (pager.page) params.push("page=" + pager.page);
  if (search) params.push("searchQuery=" + search);
  if (order) {
    params.push("order=" + order.order);
    params.push("orderBy=" + order.orderBy);
  }
  if (filters.createdAt) {
    const date = format(subDays(new Date(), filters.createdAt), DATE_FORMAT);
    params.push("filter=createdAt:gte:" + date);
  }

  return params;
};
