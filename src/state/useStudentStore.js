import { create } from "zustand";
import { generateCommonActions, createActionGetter, createStoreSelector } from "./utils";

const initialStore = {
  ready: false,
  additionalReady: false,
  shifts: [],
  classes: [],
  teachers: [],
  schedules: [],
  attendances: [],
  classExercises: [],
  classExerciseScores: [],
  tuitions: [],
  tuitionDiscounts: [],
};

export const useStudentStoreBase = create((set) => ({
  ...initialStore,
  studentActions: {
    ...generateCommonActions(set),
    reset: () => set(() => initialStore),
  },
}));

export const getStudentActions = () => createActionGetter(useStudentStoreBase, "studentActions");

const useStudentStore = (properties) => createStoreSelector(useStudentStoreBase, properties);
export default useStudentStore;
