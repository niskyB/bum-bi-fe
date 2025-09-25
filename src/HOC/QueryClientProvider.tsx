"use client";

import {
  QueryClient,
  QueryClientProvider as Provider,
} from "@tanstack/react-query";
import reactQueryConfig from "main/config/reactQuery";
import React, { useState } from "react";

const QueryClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queryClient] = useState(() => new QueryClient(reactQueryConfig));
  return <Provider client={queryClient}>{children}</Provider>;
};

export default QueryClientProvider;
