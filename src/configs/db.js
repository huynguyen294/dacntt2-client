import Dexie from "dexie";

const localDB = new Dexie("dacntt2");
localDB.version(1).stores({
  shifts: "id",
  classes: "id",
  schedules: "id",
  teachers: "id",
  attendances: "++id",
  classExercises: "id",
  classExerciseScores: "id",
  courses: "id",
  classTopics: "id",
  consultations: "id",
  tuitions: "id",
  tuitionDiscounts: "id",
});

export default localDB;
