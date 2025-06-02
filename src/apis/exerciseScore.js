import API from "./api";

const getStudentStatuses = async (classId) => {
  const result = await API.get(`/api-v1/class-exercise-scores/student-statuses/${classId}`);
  return result.data;
};

const otherExerciseScoreApis = { getStudentStatuses };
export default otherExerciseScoreApis;
