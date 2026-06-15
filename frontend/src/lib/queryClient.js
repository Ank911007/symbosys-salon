import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 401, 403, 404, or if we've failed twice already
        if ([401, 403, 404].includes(error?.response?.status)) return false;
        // Don't retry more than once for 503/504 to avoid long hangs
        if ([503, 504].includes(error?.response?.status)) return failureCount < 1;
        return failureCount < 2;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
      refetchOnWindowFocus: false, // Don't aggressively refetch unless necessary
    },
    mutations: {
      retry: 0, // No retries for mutations to prevent double-submissions
    },
  },
});
