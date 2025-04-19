import { isExpired } from "react-jwt";
import { getNewAccessToken } from "@/apis";
import CryptoJS from "crypto-js";

export const verifyUserToken = async () => {
  let user = cryptoDecrypt(localStorage.getItem("profile"));
  if (!user) return {};
  user = JSON.parse(user);

  const { accessToken } = user;

  const isAcTokenExpired = isExpired(accessToken);
  if (!isAcTokenExpired) return { isAcTokenExpired };

  const result = await getNewAccessToken();
  if (result.ok) {
    const newUser = { ...user, accessToken: result.newAccessToken };
    localStorage.setItem("profile", cryptoEncrypt(JSON.stringify(newUser)));
    return { isAcTokenExpired };
  } else {
    // toast.error(result.message);
    return { isRfTokenExpired: true };
  }
};

// Encrypt
export const cryptoEncrypt = (string) => CryptoJS.AES.encrypt(string, import.meta.env.VITE_CRYPTO_SECRET).toString();

// Decrypt
export const cryptoDecrypt = (encodedString) => {
  if (!encodedString) return;
  const bytes = CryptoJS.AES.decrypt(encodedString, import.meta.env.VITE_CRYPTO_SECRET);
  const data = bytes.toString(CryptoJS.enc.Utf8);
  return data;
};
