import { getAppActions } from "./useAppStore";
import { getStudentActions } from "./useStudentStore";

export { default as useAppStore, useAppStoreBase, getAppActions } from "./useAppStore";

export const resetAppData = () => {
  getAppActions().reset();
  getStudentActions().reset();

  localStorage.clear("profile");
  //   localStorage.clear("userSetting");
};
