export const getServerErrorMessage = (error) => {
  // const online = isOnline();
  //   if (online === false) return { ok: false, message: "Không kết nối internet." };
  if (error?.response?.data) return { ok: false, message: error?.response?.data.message, status: error.status };

  console.log(error);
  return { ok: false, status: error.status, message: "Hệ thống lỗi, vui lòng thử lại sau." };
};
