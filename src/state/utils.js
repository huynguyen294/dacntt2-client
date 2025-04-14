/* eslint-disable react-hooks/rules-of-hooks */
import { produce } from "immer";
import { useShallow } from "zustand/shallow";

export const valueWithPrevious = (value, previous) => (typeof value === "function" ? value(previous) : value);

export const createStoreSelector = (storeHook, properties) => {
  //default with shallow
  if (typeof properties === "function") return storeHook(useShallow(properties));
  //single
  if (typeof properties === "string") return storeHook(useShallow((state) => state[properties]));
  //multiple
  return storeHook(
    useShallow((state) => properties.reduce((result, prop) => ({ ...result, [prop]: state[prop] }), {}))
  );
};

export const createActionGetter = (storeHook, actionKey) => storeHook.getState()[actionKey];

export const generateCommonActions = (set) => ({
  change: (property, value) => {
    set(produce((state) => ({ [property]: valueWithPrevious(value, state[property]) })));
  },
  add: (property, value, isUnshift) => {
    set(
      produce((state) => {
        if (!isUnshift) {
          state[property].push(value);
        } else {
          state[property].unshift(value);
        }
      })
    );
  },
  update: (property, newValue, key = "id") => {
    set(
      produce((state) => {
        const indexFound = state[property].findIndex(({ id }) => newValue[key] === id);
        if (indexFound >= 0) state[property][indexFound] = newValue;
      })
    );
  },
  delete: (property, id) => {
    set(
      produce((state) => {
        state[property] = state[property].filter((item) => item.id !== id);
      })
    );
  },
});
