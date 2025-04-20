import { getServerErrorMessage } from "./utils";
import { cryptoEncrypt } from "@/utils/auth";
import API from "./api";
import axios from "axios";
import { getAppActions } from "@/state";

const serverUrl = import.meta.env.VITE_SERVER_URL;
export const getNewAccessToken = async () => {
  try {
    const result = await axios.get(`${serverUrl}/api-v1/auth/new-access-token`, {
      withCredentials: true,
    });
    return { ok: true, newAccessToken: result.data.newAccessToken };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

export const signIn = async (data, navigate) => {
  const appActions = getAppActions();
  try {
    const res = await API.post("/api-v1/auth/sign-in", data);
    const user = res.data.user;
    if (!user.imageUrl) user.imageUrl = "";
    user.accessToken = res.data.accessToken;
    localStorage.setItem("profile", cryptoEncrypt(JSON.stringify(user)));
    appActions.change({ user });
    navigate("/" + (user.role !== "student" ? user.role : ""));
    return { ok: true, user };
  } catch (error) {
    return getServerErrorMessage(error);
  }
};

export const signOut = async () => {
  try {
    // clear refresh token
    await API.get("/api-v1/sign-out", { withCredentials: true });
  } catch (error) {
    return getServerErrorMessage(error);
  }
};
