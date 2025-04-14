import { create } from "zustand";
import { createActionGetter, createStoreSelector } from "./utils";
import { generateCommonActions } from "../utils";

const initialStore = {
  users: [],
};

export const useAdminStoreBase = create((set) => ({
  ...initialStore,
  adminActions: {
    ...generateCommonActions(set),
    reset: () => set(() => initialStore),
  },
}));

export const getAppActions = createActionGetter(useAdminStoreBase, "adminActions");
const useAdminStore = createStoreSelector(useAdminStoreBase);

export default useAdminStore;
