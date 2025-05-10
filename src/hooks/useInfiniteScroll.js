/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";

const scrollHandler = (hasMore, onLoadMore, scrollerRef, isLoading) => () => {
  if (!hasMore || isLoading) return;

  const { scrollHeight, scrollTop } = scrollerRef.current;
  const wrapperHeight = scrollerRef.current.clientHeight;

  console.log({ scrollHeight, scrollTop, wrapperHeight });

  if (wrapperHeight + scrollTop + wrapperHeight / 3 < scrollHeight) return;
  onLoadMore();
};

const useInfiniteScroll = ({ hasMore, onLoadMore, isEnabled, isLoading }) => {
  const scrollerRef = useRef();
  const scrollHandlerRef = useRef(scrollHandler(hasMore, onLoadMore, scrollerRef, isLoading));

  useEffect(() => {
    scrollHandlerRef.current = scrollHandler(hasMore, onLoadMore, scrollerRef, isLoading);
  });

  useEffect(() => {
    if (scrollerRef.current && hasMore && isEnabled) {
      scrollerRef.current.addEventListener("scroll", scrollHandlerRef.current);
    }

    return () => {
      if (scrollerRef.current) scrollerRef.current.removeEventListener("scroll", scrollHandlerRef.current);
    };
  }, [scrollerRef, scrollHandlerRef.current, hasMore, isEnabled, isLoading]);

  return { scrollerRef };
};

export default useInfiniteScroll;
