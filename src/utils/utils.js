import Compressor from "compressorjs";
import { format } from "date-fns";

export const arrayToObject = (arr = [], property = "id") => {
  return arr.reduce((acc, curr) => ({ ...acc, [curr[property]]: curr }), {});
};

export const timeFormat = (text) => text && text.slice(0, 5);

export const displayDate = (value) => (value ? format(new Date(value), "dd/MM/yyyy") : "");

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
