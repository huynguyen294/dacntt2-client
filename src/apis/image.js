import API from "./api";
import { convertBase64 } from "@/utils";
import { getServerErrorMessage } from "./utils";

export const createImage = async (base64, folder) => {
  try {
    await API.post(`/api-v1/images`, { base64, folder });
    return { ok: true };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

export const updateImage = async (id, base64) => {
  try {
    await API.patch(`/api-v1/images/${id}`, { base64 });
    return { ok: true };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

export const saveImage = async ({ id, file, link }, folder = null) => {
  if (!file) return { ok: true, url: link };

  try {
    let result;
    const base64 = await convertBase64(file);
    if (id) {
      result = await API.patch(`/api-v1/images/${id}`, { base64 });
    } else {
      result = await API.post(`/api-v1/images`, { base64, folder });
    }

    return { ok: true, url: result.data.url };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

export const deleteImageById = async (id) => {
  try {
    await API.delete(`/api-v1/images/${id}`);
    return { ok: true };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};
