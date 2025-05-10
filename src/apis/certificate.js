import API from "./api";
import { getCommonParams, getServerErrorMessage } from "./utils";

export const getCertificates = async (pager, order, search, filters) => {
  const params = getCommonParams(pager, order, search, filters);
  const result = await API.get(`/api-v1/certificates?${params.join("&")}`);
  return result.data;
};

export const getCertificateById = async (id) => {
  const result = await API.get(`/api-v1/certificates/${id}`);
  return result.data;
};

export const createCertificate = async (data) => {
  try {
    const result = await API.post(`/api-v1/certificates`, data);
    return { ok: true, newCertificate: result.data.newCertificate };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

export const updateCertificate = async (id, newData) => {
  try {
    const result = await API.patch(`/api-v1/certificates/${id}`, newData);
    return { ok: true, updatedCertificate: result.data.updatedCertificate };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

export const deleteCertificate = async (id) => {
  try {
    await API.delete(`/api-v1/certificates/${id}`);
    return { ok: true };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};
