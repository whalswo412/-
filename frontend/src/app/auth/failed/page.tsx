'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

export default function AuthFailedPage() {
  const router = useRouter();

  useEffect(() => {
    // 5초 후 홈으로 리다이렉트
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold mb-2">로그인 실패</h1>
        <p className="text-muted-foreground mb-4">
          로그인 과정에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
} 