"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import AuthProvider from "@/providers/AuthProvider";

export default function Providers({ children }) {
  // useState로 생성해야 컴포넌트마다 QueryClient 인스턴스가 공유되지 않음.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // 1분 동안 fresh 상태 유지
            retry: 1, // 실패 시 1회만 재시도
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
