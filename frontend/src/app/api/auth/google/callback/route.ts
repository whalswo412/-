import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { search } = new URL(req.url);
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    // 백엔드 콜백 API 직접 호출
    const backendResponse = await fetch(`${api}/auth/google/callback${search}`, {
      credentials: 'include'
    });

    // 상태 및 응답 체크
    if (!backendResponse.ok) {
      console.error('백엔드 인증 실패:', await backendResponse.text());
      return NextResponse.redirect(new URL('/auth/failed', req.url));
    }

    // 응답 본문에서 토큰 및 사용자 정보 추출
    const authData = await backendResponse.json();
    console.log('인증 응답 데이터:', authData);

    // 프론트엔드 성공 페이지로 리다이렉트 (토큰 및 사용자 정보 전달)
    const successUrl = new URL('/auth/success', req.url);
    
    // 쿼리 파라미터로 토큰 및 사용자 정보 전달
    if (authData.access_token) {
      successUrl.searchParams.set('access_token', authData.access_token);
    }
    if (authData.refresh_token) {
      successUrl.searchParams.set('refresh_token', authData.refresh_token);
    }
    if (authData.user) {
      successUrl.searchParams.set('user', encodeURIComponent(JSON.stringify(authData.user)));
    }

    console.log('access_token', authData.access_token);


    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error('인증 콜백 처리 중 오류:', error);
    return NextResponse.redirect(new URL('/auth/failed', req.url));
  }
}