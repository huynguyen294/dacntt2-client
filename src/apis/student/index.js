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
      localDB[key].bulkAdd(mainResult.data[key]);
    });

    const otherResult = await API.get(`/api-v1/student-data/other/${studentId}`);
    actions.change("additionalReady", true);
    Object.keys(otherResult.data).forEach((key) => {
      actions.change(key, otherResult.data[key]);
      localDB[key].bulkAdd(otherResult.data[key]);
    });
  } catch (error) {
    addToast({
      color: "danger",
      title: "Lỗi!",
      description: "Có lỗi xẩy ra trong quá trình khởi tạo, vui lòng thử lại!",
    });
  }
};

export const initOffline = async () => {
  const actions = getStudentActions();

  try {
    const [shifts, classes, schedules, teachers] = await Promise.all([
      localDB.shifts.toArray(),
      localDB.classes.toArray(),
      localDB.schedules.toArray(),
      localDB.teachers.toArray(),
    ]);

    actions.change("ready", true);
    actions.change("shifts", shifts);
    actions.change("classes", classes);
    actions.change("schedules", schedules);
    actions.change("teachers", teachers);

    const [
      attendances,
      classExercises,
      classExerciseScores,
      courses,
      classTopics,
      consultations,
      tuitions,
      tuitionDiscounts,
    ] = await Promise.all([
      localDB.attendances.toArray(),
      localDB.classExercises.toArray(),
      localDB.classExerciseScores.toArray(),
      localDB.courses.toArray(),
      localDB.classTopics.toArray(),
      localDB.consultations.toArray(),
      localDB.tuitions.toArray(),
      localDB.tuitionDiscounts.toArray(),
    ]);
    actions.change("additionalReady", true);
    actions.change("attendances", attendances);
    actions.change("classExercises", classExercises);
    actions.change("classExerciseScores", classExerciseScores);
    actions.change("courses", courses);
    actions.change("classTopics", classTopics);
    actions.change("consultations", consultations);
    actions.change("tuitions", tuitions);
    actions.change("tuitionDiscounts", tuitionDiscounts);
  } catch (error) {
    addToast({
      color: "danger",
      title: "Lỗi!",
      description: "Có lỗi xẩy ra trong quá trình khởi tạo, vui lòng thử lại!",
    });
  }
};

const studentApi = { init, initOffline };
export default studentApi;
