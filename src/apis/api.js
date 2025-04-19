// import { cryptoDecrypt, verifyUserToken } from "@/utils";
import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_SERVER_URL });

const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuaGh1eTIwOTlAZ21haWwuY29tIiwiaWQiOjEsInVzZXJSb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDUwMzA1MzIsImV4cCI6MTc0NTAzNDEzMn0.dufr7cOEPLqU5sifDPDODgRaKtw_EFGK8jy1JVZjpfs";

API.interceptors.request.use(async (req) => {
  try {
    // await verifyUserToken();
    // let user = cryptoDecrypt(localStorage.getItem("profile"));
    // if (user) user = JSON.parse(user);
    // if (user?.accessToken) req.headers.Authorization = `Bearer ${user.accessToken}`;
    // req.cache = "no-cache";

    req.headers.Authorization = `Bearer ${accessToken}`;

    return Promise.resolve(req);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
});

export default API;
