export { default as API } from "./api";
export * from "./utils";
export * from "./auth";

import otherClassApis from "./class";
import otherCourseApis from "./course";
import otherEnrollmentApis from "./enrollment";
import otherShiftApis from "./shift";
import otherStudentConsultationApis from "./studentConsultation";
import { generateCrudApi } from "./utils";

// images
export { default as imageApi } from "./image";

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
export const courseApi = { ...commonCourseApi, ...otherCourseApis };

// student-consultation
export const commonStudentConsultationApi = generateCrudApi("student-consultation");
export const studentConsultationApi = { ...commonStudentConsultationApi, ...otherStudentConsultationApis };

// student-consultation
export const commonEnrollmentApi = generateCrudApi("enrollments");
export const enrollmentApi = { ...commonEnrollmentApi, ...otherEnrollmentApis };

// shifts
const commonShiftApi = generateCrudApi("shifts");
export const shiftApi = { ...commonShiftApi, ...otherShiftApis };
