import { getAppActions } from "./useAppStore";
import { getStudentActions } from "./useStudentStore";

export { default as useAppStore, useAppStoreBase, getAppActions } from "./useAppStore";
export { default as useStudentStore, useStudentStoreBase, getStudentActions } from "./useStudentStore";

export const resetAppData = () => {
  getAppActions().reset();
  getStudentActions().reset();
  localStorage.clear("profile");
  //   localStorage.clear("userSetting");
};
