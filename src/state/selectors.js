export const selectStoreObject = (property, key = "id") => {
  return (state) => arrayToObject(state[property], key);
};
