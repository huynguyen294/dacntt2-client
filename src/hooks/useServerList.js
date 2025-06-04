import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { PAGER } from "@/constants";
import { debounceFn } from "@/utils";

const useServerList = (
  dataKey = "users",
  getFn = (pager, order, query, filters, otherParams) => {},
  { filters = {}, otherParams = ["fields=:basic"], selectList = (data) => data.rows, paging = true } = {}
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pager, setPager] = useState(PAGER);
  const [list, setList] = useState([]);

  const changePager = (key, value) => setPager((prev) => ({ ...prev, [key]: value }));
  const onLoadMore = () => changePager("page", pager.page + 1);
  const onQueryChange = useCallback(
    debounceFn((newQuery) => {
      setQuery(newQuery);
      setPager(PAGER);
    }),
    []
  );

  const { isLoading, data } = useQuery({
    queryKey: [dataKey, "basic-list", query, pager.page, JSON.stringify(filters), [...otherParams]],
    queryFn: () => getFn(paging && pager, null, query, filters, otherParams),
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

  const ready = Boolean(data);
  const hasMore = ready && pager.pageCount && pager.page < pager.pageCount;

  return { isLoading, query, list, onQueryChange, onLoadMore, hasMore, isOpen, setIsOpen, ready };
};

export default useServerList;
