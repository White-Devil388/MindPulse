import { useEffect, useRef, useCallback } from 'react';

/**
 * useInfiniteScroll
 * Attaches an IntersectionObserver to a target sentinel element (loading trigger)
 * and invokes callback when the element enters the viewport.
 */
export function useInfiniteScroll(onLoadMore, hasMore = true, isLoading = false, options = {}) {
  const sentinelRef = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [onLoadMore, hasMore, isLoading]
  );

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
      ...options,
    });

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
      observer.disconnect();
    };
  }, [handleObserver, options]);

  return { sentinelRef };
}

