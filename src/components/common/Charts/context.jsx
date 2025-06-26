import { createContext, useContext } from "react";

export const initialState = {};
export const ChartContext = createContext();
export const useChartContext = () => {
  const context = useContext(ChartContext);
  return context;
};
