import { getStudentActions } from "@/state/useStudentStore";
import { addToast } from "@heroui/toast";
import API from "../api";
import localDB from "@/configs/db";

export const init = async (studentId) => {
  const actions = getStudentActions();
  try {
    const mainResult = await API.get(`/api-v1/student-data/main/${studentId}`);
    actions.change("ready", true);
    Object.keys(mainResult.data).forEach((key) => {
      actions.change(key, mainResult.data[key]);
    });

    const otherResult = await API.get(`/api-v1/student-data/other/${studentId}`);
    actions.change("additionalReady", true);
    Object.keys(otherResult.data).forEach((key) => {
      actions.change(key, otherResult.data[key]);
    });
  } catch (error) {
    addToast({
      color: "danger",
      title: "Lỗi!",
      description: "Có lỗi xẩy ra trong quá trình khởi tạo, vui lòng thử lại!",
    });
  }
};

const studentApi = { init };
export default studentApi;
