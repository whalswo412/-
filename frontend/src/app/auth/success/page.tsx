'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';

export default function AuthSuccessPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // 디버그 로그 함수
  const addDebugLog = (message: string) => {
    console.log(message);
    setDebugInfo(prev => [...prev, message]);
  };

  useEffect(() => {
    // 백엔드에서 HTTP-Only 쿠키로 토큰이 자동 설정됨
    addDebugLog('백엔드에서 설정한 쿠키 확인 중...');

    // 쿠키에서 사용자 정보만 확인 (토큰은 HTTP-Only라 접근 불가)
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find(c => c.trim().startsWith('user='));
    
    addDebugLog(`사용자 쿠키: ${userCookie ? '존재함' : '없음'}`);

    if (userCookie) {
      try {
        // 사용자 정보 파싱
        const userValue = userCookie.split('=')[1];
        const decodedValue = decodeURIComponent(userValue);
        const userObj = JSON.parse(decodedValue);
        
        addDebugLog(`사용자 정보 확인: ${JSON.stringify(userObj)}`);
        
        // 인증 성공 - 대시보드로 리다이렉트
        setTimeout(() => {
          addDebugLog('인증 성공, 대시보드로 이동 중...');
          router.replace('/dashboard');
        }, 1000);
      } catch (e: any) {
        setError(`사용자 정보 파싱 오류: ${e?.message || '알 수 없는 오류'}`);
        addDebugLog(`사용자 정보 파싱 오류: ${e?.message || '알 수 없는 오류'}`);
        
        // 오류 발생 시 5초 후 홈으로 리다이렉트
        setTimeout(() => {
          router.replace('/');
        }, 5000);
      }
    } else {
      setError('인증 정보가 없습니다. 로그인이 실패했거나 세션이 만료되었습니다.');
      addDebugLog('사용자 쿠키를 찾을 수 없음');
      
      // 5초 후 홈으로 리다이렉트
      setTimeout(() => {
        router.replace('/');
      }, 5000);
    }
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center max-w-md">
        {error ? (
          <>
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-2">로그인 처리 실패</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <p className="text-sm mb-4">잠시 후 홈페이지로 이동합니다...</p>
            
            {debugInfo.length > 0 && (
              <div className="mt-8 text-left p-4 bg-muted rounded-md text-xs overflow-auto max-h-60">
                <p className="font-medium mb-2">디버깅 정보:</p>
                <ul className="space-y-1">
                  {debugInfo.map((log, i) => (
                    <li key={i}>{log}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <>
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-semibold mb-2">로그인 성공!</h1>
            <p className="text-muted-foreground mb-4">인증 정보를 처리 중입니다...</p>
            
            {debugInfo.length > 0 && (
              <div className="mt-8 text-left p-4 bg-muted rounded-md text-xs overflow-auto max-h-60">
                <p className="font-medium mb-2">처리 진행상황:</p>
                <ul className="space-y-1">
                  {debugInfo.map((log, i) => (
                    <li key={i}>{log}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 