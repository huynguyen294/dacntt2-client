import { create } from "zustand";
import { generateCommonActions, createActionGetter, createStoreSelector } from "./utils";

const initialStore = {
  user: null,
  ready: false,
  theme: "light",
  showInstaller: false,
  isOnline: null,
};

export const useAppStoreBase = create((set) => ({
  ...initialStore,
  appActions: {
    change: generateCommonActions(set).change,
    reset: () => set(() => initialStore),
  },
}));

export const getAppActions = () => createActionGetter(useAppStoreBase, "appActions");

const useAppStore = (properties) => createStoreSelector(useAppStoreBase, properties);
export default useAppStore;
