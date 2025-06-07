import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { PAGER } from "@/constants";
import { debounceFn } from "@/utils";
import useDebounce from "./useDebounce";

const useServerList = (
  dataKey = "users",
  getFn = (pager, order, query, filters, otherParams) => {},
  {
    filters = {},
    paging = true,
    otherParams = ["fields=:basic"],
    searchQuery = "",
    selectList = (data) => data.rows,
  } = {}
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pager, setPager] = useState(PAGER);
  const [list, setList] = useState([]);

  const changePager = (key, value) => setPager((prev) => ({ ...prev, [key]: value }));
  const onLoadMore = () => changePager("page", pager.page + 1);
  const clearQuery = () => setQuery("");

  const debounceReSetPager = useCallback(
    debounceFn(() => setPager(PAGER)),
    []
  );

  const onQueryChange = (newQuery) => {
    debounceReSetPager();
    setQuery(newQuery);
  };

  const debounceQuery = useDebounce(searchQuery || query);
  const { isLoading, data } = useQuery({
    queryKey: [dataKey, "basic-list", debounceQuery, pager.page, JSON.stringify(filters), [...otherParams]],
    queryFn: () => getFn(paging && pager, null, debounceQuery, filters, otherParams),
  });

  useEffect(() => {
    if (data) {
      paging && setPager(data.pager);
      if (pager.page === 1 || !paging) {
        setList(selectList(data));
      } else {
        setList((prev) => [...prev, ...selectList(data)]);
      }
    }
  }, [data]);

  const ready = Boolean(list?.length);
  const hasMore = ready && pager.pageCount && pager.page < pager.pageCount;

  return { isLoading, query, list, clearQuery, onQueryChange, onLoadMore, hasMore, isOpen, setIsOpen, ready };
};

export default useServerList;
