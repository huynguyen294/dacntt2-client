import API from "./api";
import { generateCrudApi, getServerErrorMessage } from "./utils";
import { getAppActions } from "@/state";
import { cryptoDecrypt, cryptoEncrypt } from "@/utils";

const refreshProfile = async () => {
  let profile = cryptoDecrypt(localStorage.getItem("profile"));
  if (!profile) return;
  profile = JSON.parse(profile);

  const appActions = getAppActions();
  const result = await API.get(`/api-v1/users/${profile.id}`);

  const user = { ...profile, ...result.data.user };
  localStorage.setItem("profile", cryptoEncrypt(JSON.stringify(user)));
  appActions.change({ user });

  return result.data;
};

const signUp = async (data) => {
  try {
    await API.post(`/api-v1/users/sign-up`, data);
    return { ok: true };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

const createUser = async (data, role) => {
  try {
    const params = [];
    if (role) params.push("role=" + role);

    await API.post(`/api-v1/users?${params.join("&")}`, data);
    return { ok: true };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

const updateUser = async (id, newData, { role = "", resetPassword = false }) => {
  try {
    const params = [];
    if (role) params.push("role=" + role);
    if (resetPassword) params.push("resetPassword=true");
    await API.patch(`/api-v1/users/${id}?${params.join("&")}`, newData);

    let profile = cryptoDecrypt(localStorage.getItem("profile"));
    if (profile) {
      profile = JSON.parse(profile);
      if (profile.id === id) refreshProfile();
    }
    return { ok: true };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

const updateProfile = async (id, newData, resetPassword) => {
  const appActions = getAppActions();

  try {
    const params = [];
    if (resetPassword) params.push("resetPassword=true");
    const result = await API.patch(`/api-v1/users/${id}?${params.join("&")}`, newData);

    let profile = cryptoDecrypt(localStorage.getItem("profile"));
    profile = JSON.parse(profile);
    const user = { ...profile, ...result.data.updated };
    localStorage.setItem("profile", cryptoEncrypt(JSON.stringify(user)));
    appActions.change("user", user);
    return { ok: true };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

const checkEmailAvailable = async (email) => {
  try {
    const result = await API.get(`/api-v1/users/check-email/` + email);
    if (result.data.exists) {
      return { ok: false, message: "Email này đã đăng ký!" };
    }

    return { ok: true };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

const commonUserApi = generateCrudApi("users");

export default {
  ...commonUserApi,
  update: updateUser,
  updateProfile,
  signUp,
  checkEmailAvailable,
  refreshProfile,
};
