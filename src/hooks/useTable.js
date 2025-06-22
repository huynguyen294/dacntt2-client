/* eslint-disable react-hooks/exhaustive-deps */
import { DEFAULT_PAGER, ORDER_BY_CREATED_AT } from "@/constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import useDebounce from "./useDebounce";

const tableDefaultSelectedColumns = [];
const tableAllColumns = [];

const useTable = ({
  defaultSelectedColumns = tableDefaultSelectedColumns,
  allColumns = tableAllColumns,
  defaultOrder = ORDER_BY_CREATED_AT,
  Api,
} = {}) => {
  const [query, setQuery] = useState("");
  const [pager, setPager] = useState(DEFAULT_PAGER);
  const [order, setOrder] = useState(defaultOrder);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [selectedColumns, setSelectedColumns] = useState(new Set(defaultSelectedColumns));
  const [filters, setFilters] = useState({});
  const debounceQuery = useDebounce(query);

  const columns = useMemo(() => allColumns.filter((col) => selectedColumns.has(col.uid)), [selectedColumns]);
  const getRowIndex = useCallback((rowIndex) => rowIndex + (pager.page - 1) * pager.pageSize, [pager]);
  const changePager = useCallback((prop, value) => setPager((prev) => ({ ...prev, [prop]: value })), []);

  useEffect(() => {
    if (debounceQuery) {
      changePager("page", 1);
    }
  }, [changePager, debounceQuery]);

  const reset = useCallback(() => {
    setQuery("");
    setPager(DEFAULT_PAGER);
    setOrder(defaultOrder);
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
    Api,
    setQuery,
    pager,
    columns,
    allColumns,
    setPager,
    order,
    reset,
    changePager,
    getRowIndex,
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
