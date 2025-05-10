/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import useDebounce from "./useDebounce";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { addToast } from "@heroui/toast";
import { getServerErrorMessage } from "@/apis";

const useAutocompleteInfinity = ({
  delay = 300,
  queryKey,
  queryFn,
  pageSize = 20,
  select = (data) => data[queryKey[0]],
}) => {
  const [items, setItems] = useState([]);
  const [pager, setPager] = useState({ page: 1, pageCount: null, pageSize });
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query);

  const { isLoading, data, isError, isSuccess, error } = useQuery({
    queryKey: [...queryKey, pager.page, debounceQuery],
    queryFn: () => queryFn(pager, debounceQuery),
  });

  const hasMore = useMemo(() => (pager.pageCount ? pager.page < pager.pageCount : true), [pager.page, pager.pageCount]);

  const onLoadMore = () => {
    console.log("here");
    if (isLoading) return;
    setPager((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  useEffect(() => {
    if (isSuccess && data?.pager) {
      const currentData = select(data);
      setItems((prev) => [...prev, ...currentData]);
      setPager(data.pager);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) addToast({ color: "danger", title: "Lỗi tải!", description: getServerErrorMessage(error) });
  }, [isError, error]);

  return { items, isLoading, hasMore, onLoadMore };
};

export default useAutocompleteInfinity;
