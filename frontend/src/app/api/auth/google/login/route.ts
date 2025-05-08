import { NextResponse } from "next/server";

export async function GET() {
  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  // Passport-Google 전략이 걸려 있는 NestJS 엔드포인트로 리다이렉트
  return NextResponse.redirect(`${api}/auth/google/login`);
}