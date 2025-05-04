import { DEFAULT_PAGER } from "@/constants";
import { useCallback, useEffect, useState } from "react";
import useDebounce from "./useDebounce";

const useTable = ({ defaultSelectedColumns = [] }) => {
  const [query, setQuery] = useState("");
  const [pager, setPager] = useState(DEFAULT_PAGER);
  const [order, setOrder] = useState({ order: "desc", orderBy: "createdAt" });
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [selectedColumns, setSelectedColumns] = useState(new Set(defaultSelectedColumns));
  const [filters, setFilters] = useState({});
  const debounceQuery = useDebounce(query);

  const changePager = useCallback((prop, value) => setPager((prev) => ({ ...prev, [prop]: value })), []);

  const reset = useCallback(() => {
    setQuery("");
    setPager(DEFAULT_PAGER);
    setOrder({ order: "desc", orderBy: "createdAt" });
    setSelectedKeys(new Set([]));
    setSelectedColumns(new Set(defaultSelectedColumns));
    setFilters({});
  }, [defaultSelectedColumns]);

  useEffect(() => {
    setSelectedColumns(new Set(defaultSelectedColumns));

    return () => {
      reset();
    };
  }, [reset, defaultSelectedColumns]);

  return {
    setQuery,
    pager,
    setPager,
    order,
    reset,
    changePager,
    setOrder,
    selectedKeys,
    setSelectedKeys,
    selectedColumns,
    setSelectedColumns,
    filters,
    setFilters,
    debounceQuery,
  };
};

export default useTable;
