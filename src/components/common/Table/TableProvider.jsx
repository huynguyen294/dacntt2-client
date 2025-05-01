import { TableContext } from "./context";

const TableProvider = ({ value, children }) => {
  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
};

export default TableProvider;
