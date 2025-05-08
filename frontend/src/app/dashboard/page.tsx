'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AppHeader } from "@/components/app-header";
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, login } = useAuth();
  const router = useRouter();

  // 로딩이 끝난 후 로그인되지 않은 상태면 홈으로 리다이렉트
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // 리다이렉트보다 UI 표시로 변경
      console.log('로그인되지 않은 상태입니다.');
    }
  }, [isLoading, isAuthenticated, router]);

  // 로그인되지 않은 상태에 대한 UI
  if (!isLoading && !isAuthenticated) {
    return (
      <>
        <AppHeader />
        <div className="flex flex-1 flex-col items-center justify-center p-8">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
            <p className="text-muted-foreground mb-6">
              대시보드에 접근하려면 로그인이 필요합니다. 아래 버튼을 클릭하여 로그인해주세요.
            </p>
            <Button onClick={login} size="lg">
              Google로 로그인
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  )
}
