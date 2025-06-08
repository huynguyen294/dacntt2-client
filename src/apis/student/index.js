import { getStudentActions } from "@/state/useStudentStore";
import { addToast } from "@heroui/toast";
import API from "../api";

export const init = async (studentId) => {
  const actions = getStudentActions();
  try {
    const mainResult = await API.get(`/api-v1/student-data/main/${studentId}`);
    actions.change("ready", true);
    actions.change("shifts", mainResult.data.shifts);
    actions.change("classes", mainResult.data.classes);
    actions.change("schedules", mainResult.data.schedules);
    actions.change("teachers", mainResult.data.teachers);

    const otherResult = await API.get(`/api-v1/student-data/other/${studentId}`);
    actions.change("additionalReady", true);
    actions.change("attendances", otherResult.data.attendances);
    actions.change("classExercises", otherResult.data.classExercises);
    actions.change("classExerciseScores", otherResult.data.classExerciseScores);
    actions.change("tuitions", otherResult.data.tuitions);
    actions.change("courses", otherResult.data.courses);
    actions.change("classTopics", otherResult.data.classTopics);
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
