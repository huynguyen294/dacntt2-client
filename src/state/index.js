import { getAppActions } from "./useAppStore";

export { default as useAppStore, useAppStoreBase, getAppActions } from "./useAppStore";

export const resetAppData = () => {
  getAppActions().reset();

  localStorage.clear("profile");
  //   localStorage.clear("userSetting");
};
