// import { cryptoDecrypt, verifyUserToken } from "@/utils";
import { cryptoDecrypt, verifyUserToken } from "@/utils";
import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_SERVER_URL });

API.interceptors.request.use(async (req) => {
  try {
    await verifyUserToken();
    let user = cryptoDecrypt(localStorage.getItem("profile"));
    if (user) user = JSON.parse(user);
    if (user?.accessToken) req.headers.Authorization = `Bearer ${user.accessToken}`;
    req.cache = "no-cache";

    return Promise.resolve(req);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
});

export default API;
