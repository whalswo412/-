'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/hooks/use-auth';
import { SidebarProvider } from '@/components/ui/sidebar';
// import { ThemeProvider } from '@/components/theme-provider';

import { Toaster } from '@/components/ui/toaster';
import { 
  QueryClient,
  QueryClientProvider 
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1분
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
        <AuthProvider>
          <SidebarProvider>
            {children}
            <Toaster />
          </SidebarProvider>
        </AuthProvider>
      {/* </ThemeProvider> */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
} 