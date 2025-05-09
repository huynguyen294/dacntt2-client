import API from "./api";
import { getCommonParams } from "./utils";

export const getCertificates = async (pager, order, search, filters) => {
  const params = getCommonParams(pager, order, search, filters);
  const result = await API.get(`/api-v1/certificates?${params.join("&")}`);
  return result.data;
};
