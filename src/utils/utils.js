import Compressor from "compressorjs";
import { CLASS_STATUSES, currentDate } from "@/constants";
import { format } from "date-fns";

export const getVietQrQuickLink = ({
  bankId = "970423",
  stk = "0978520403",
  format = "print",
  amount = 0,
  content = "",
  accountName = "NGUYEN HOANG HUY",
}) => {
  return `https://img.vietqr.io/image/${bankId}-${stk}-${format}.png?amount=${amount}&addInfo=${content}&accountName=${accountName}`;
};

export const isIOS = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /iPhone|iPad|iPod/i.test(userAgent);
};

export const checkOnline = async (imageUrl) => {
  try {
    await fetch(imageUrl, { cache: "no-cache", headers: { "Cache-Control": "no-cache" } });
    return true;
  } catch (e) {
    return false;
  }
};

export const orderBy = (list, cb = (item) => item, options = { sortOrder: "asc" }) => {
  const cloned = [...list];
  cloned.sort((a, b) => {
    const aValue = cb(a);
    const bValue = cb(b);
    if (typeof aValue === "string") {
      return options.sortOrder === "asc"
        ? aValue.localeCompare(bValue, "vi", { sensitivity: "base" })
        : bValue.localeCompare(aValue, "vi", { sensitivity: "base" });
    }
    return options.sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });
  return cloned;
};

export const getClassStatus = (classData) => {
  const status = { color: "success", text: CLASS_STATUSES.active };
  if (new Date(classData.openingDay) > currentDate) {
    status.color = "warning";
    status.text = CLASS_STATUSES.pending;
  }
  if (new Date(classData.closingDay) < currentDate) {
    status.color = "danger";
    status.text = CLASS_STATUSES.stopped;
  }

  return status;
};

export const unique = (arr, field) => {
  const uniqueCheck = new Set([]);
  return arr.filter((item) => {
    let key = item[field];
    if (typeof field === "function") key = field(item);
    return uniqueCheck.has(key) ? false : uniqueCheck.add(key);
  });
};

export const shuffleArray = (array) => {
  const cloned = [...array];
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
};

export const blurEmail = (email) => {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain || localPart.length <= 3) return email;

  const visiblePart = localPart.slice(0, 3);
  const hiddenPart = "•".repeat(localPart.length - 3);

  return `${visiblePart}${hiddenPart}@${domain}`;
};

export const removeNullish = (obj) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined));
};

export const arrayToObject = (arr = [], property = "id") => {
  return arr.reduce(
    (acc, curr) => ({ ...acc, [typeof property === "string" ? curr[property] : property(curr)]: curr }),
    {}
  );
};

export const timeFormat = (text) => text && text.slice(0, 5);
export const splitTime = (text) => text.split(":").map((t) => Number(t));
export const displayDate = (value) => (value ? format(new Date(value), "dd-MM-yyyy") : "");
export const dayFormat = (date) => {
  const day = new Date(date).getDay();
  if (day === 0) return "Chủ nhật";
  return "Thứ " + (day + 1);
};
export const shiftFormat = ({ startTime, endTime } = {}) => `${timeFormat(startTime)} - ${timeFormat(endTime)}`;

const maxSize = 2 * 1024 * 1024; // 2MB
export const compressImg = async (file) => {
  let quality = Number((maxSize / file.size).toFixed(1));
  if (quality > 1) quality = 1;

  return new Promise((res, rej) => {
    new Compressor(file, {
      quality,
      mimeType: "image/jpeg",
      success(result) {
        res(result);
      },
      error(err) {
        rej(err.message);
      },
    });
  });
};

export const alpha = (hex, alpha) => {
  // Kiểm tra định dạng hex #RGBRGB #RGB
  if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)) {
    return;
  }

  // Chuyển đổi mã màu 3 ký tự sang 6 ký tự
  if (hex.length === 4) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }

  // Tách thành các thành phần màu
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Trả về chuỗi màu rgba
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getIdFromSrc = (src) => {
  if (!src) return null;
  const splitted = src.split("/");
  const splitted2 = splitted[splitted.length - 1].split("?v=");
  return splitted2[0];
};

export const shortenNumber = (number) => {
  if (!number || number <= 0) return "0đ";
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1).replaceAll(".", ",").replaceAll(",0", "") + " T";
  }
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replaceAll(".", ",").replaceAll(",0", "") + " Tr";
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1).replaceAll(".", ",").replaceAll(",0", "") + " N";
  }
  return number;
};

export const getCloudinaryPublicIdFromUrl = (url) => {
  if (!url) return null;
  const splitted = url.split("/");
  const length = splitted.length;
  const folder = splitted[length - 2];
  const id = splitted[length - 1].split(".")[0];
  return `${folder}/${id}`;
};

export const convertImageSrc = (link) => ({ link, id: getCloudinaryPublicIdFromUrl(link), file: null });

export const currencyToNumber = (str = "") => parseInt(String(str).replaceAll(/[.,]/g, ""));

export const localeString = (number) => Number(number || 0).toLocaleString("zh-CN");

export const calcTotal = (list = [], field = "amount") => list.reduce((acc, curr) => acc + curr[field], 0);

const sample = (d = [], fn = Math.random) => {
  if (d.length === 0) return;
  return d[Math.round(fn() * (d.length - 1))];
};
export const generateUid = ({ limit = 8, randomFn = Math.random, numeric = true, upper = true, lower = true } = {}) => {
  const allowed = [];
  if (numeric) allowed.push("0123456789");
  if (upper) allowed.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if (lower) allowed.push("abcdefghijklmnopqrstuvwxyz");
  if (!numeric && !upper && !lower)
    throw new Error(
      "Sample error! At least one of the following is required: a numeric character, an uppercase letter, or a lowercase letter."
    );
  const allowedChars = allowed.join("");
  const arr = [sample(allowedChars, randomFn)];
  for (let i = 0; i < limit - 1; i++) {
    arr.push(sample(allowedChars, randomFn));
  }

  return arr.join("");
};

export const debounceFn = (cb, delay = 300) => {
  let timerId;

  return (...args) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      cb(...args);
    }, delay);
  };
};

export const removeVietnameseTones = (str) => {
  const mapAccents = {
    à: "a",
    á: "a",
    ả: "a",
    ã: "a",
    ạ: "a",
    ă: "a",
    ằ: "a",
    ắ: "a",
    ẳ: "a",
    ẵ: "a",
    ặ: "a",
    â: "a",
    ầ: "a",
    ấ: "a",
    ẩ: "a",
    ẫ: "a",
    ậ: "a",
    è: "e",
    é: "e",
    ẻ: "e",
    ẽ: "e",
    ẹ: "e",
    ê: "e",
    ề: "e",
    ế: "e",
    ể: "e",
    ễ: "e",
    ệ: "e",
    ì: "i",
    í: "i",
    ỉ: "i",
    ĩ: "i",
    ị: "i",
    ò: "o",
    ó: "o",
    ỏ: "o",
    õ: "o",
    ọ: "o",
    ô: "o",
    ồ: "o",
    ố: "o",
    ổ: "o",
    ỗ: "o",
    ộ: "o",
    ơ: "o",
    ờ: "o",
    ớ: "o",
    ở: "o",
    ỡ: "o",
    ợ: "o",
    ù: "u",
    ú: "u",
    ủ: "u",
    ũ: "u",
    ụ: "u",
    ư: "u",
    ừ: "u",
    ứ: "u",
    ử: "u",
    ữ: "u",
    ự: "u",
    ỳ: "y",
    ý: "y",
    ỷ: "y",
    ỹ: "y",
    ỵ: "y",
    À: "A",
    Á: "A",
    Ả: "A",
    Ã: "A",
    Ạ: "A",
    Ă: "A",
    Ằ: "A",
    Ắ: "A",
    Ẳ: "A",
    Ẵ: "A",
    Ặ: "A",
    Â: "A",
    Ầ: "A",
    Ấ: "A",
    Ẩ: "A",
    Ẫ: "A",
    Ậ: "A",
    È: "E",
    É: "E",
    Ẻ: "E",
    Ẽ: "E",
    Ẹ: "E",
    Ê: "E",
    Ề: "E",
    Ế: "E",
    Ể: "E",
    Ễ: "E",
    Ệ: "E",
    Ì: "I",
    Í: "I",
    Ỉ: "I",
    Ĩ: "I",
    Ị: "I",
    Ò: "O",
    Ó: "O",
    Ỏ: "O",
    Õ: "O",
    Ọ: "O",
    Ô: "O",
    Ồ: "O",
    Ố: "O",
    Ổ: "O",
    Ỗ: "O",
    Ộ: "O",
    Ơ: "O",
    Ờ: "O",
    Ớ: "O",
    Ở: "O",
    Ỡ: "O",
    Ợ: "O",
    Ù: "U",
    Ú: "U",
    Ủ: "U",
    Ũ: "U",
    Ụ: "U",
    Ư: "U",
    Ừ: "U",
    Ứ: "U",
    Ử: "U",
    Ữ: "U",
    Ự: "U",
    Ỳ: "Y",
    Ý: "Y",
    Ỷ: "Y",
    Ỹ: "Y",
    Ỵ: "Y",
  };

  return str.replace(
    /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴ]/g,
    function (match) {
      return mapAccents[match];
    }
  );
};
