import { QueryClientConfig } from "@tanstack/react-query";
import { queryRetry } from "main/utils/query";

const reactQueryConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: queryRetry(3),
    },
  },
};

export default reactQueryConfig;
