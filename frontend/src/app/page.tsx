'use client'

import { AppHeader } from "@/components/app-header";

// 로그인 페이지 (루트 페이지)
export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-2xl font-bold">메인 영역</h1>
      </div>
    </div>
  );
}
