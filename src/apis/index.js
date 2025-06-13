export { default as API } from "./api";
export * from "./utils";
export * from "./auth";

import otherAttendanceApis from "./attendance";
import otherClassApis from "./class";
import otherEnrollmentApis from "./enrollment";
import otherExerciseScoreApis from "./exerciseScore";
import { generateCrudApi } from "./utils";

// images
export { default as imageApi } from "./image";
export { default as studentApi } from "./student/index";

// users
export { default as userApi } from "./user";

// certificates
export const certificateApi = generateCrudApi("certificates");

// exams
export const examApi = generateCrudApi("exams");

// classes
const commonClassApi = generateCrudApi("classes");
export const classApi = { ...commonClassApi, ...otherClassApis };

// courses
const commonCourseApi = generateCrudApi("courses");
export const courseApi = { ...commonCourseApi };

// student-consultation
export const commonStudentConsultationApi = generateCrudApi("student-consultation");
export const studentConsultationApi = { ...commonStudentConsultationApi };

// enrollments
export const commonEnrollmentApi = generateCrudApi("enrollments");
export const enrollmentApi = { ...commonEnrollmentApi, ...otherEnrollmentApis };

// shifts
const commonShiftApi = generateCrudApi("shifts");
export const shiftApi = { ...commonShiftApi };

// schedules
const commonScheduleApi = generateCrudApi("class-schedules");
export const scheduleApi = { ...commonScheduleApi };

// schedules
const commonTopicApi = generateCrudApi("class-topics");
export const topicApi = { ...commonTopicApi };

// exercises
const commonExerciseApi = generateCrudApi("class-exercises");
export const exerciseApi = { ...commonExerciseApi };

// attendances
const commonAttendanceApi = generateCrudApi("class-attendances");
export const attendanceApi = { ...commonAttendanceApi, ...otherAttendanceApis };

// exercise scores
const commonExerciseScoreApi = generateCrudApi("class-exercise-scores");
export const exerciseScoreApi = { ...commonExerciseScoreApi, ...otherExerciseScoreApis };
