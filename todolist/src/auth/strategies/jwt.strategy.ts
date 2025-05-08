// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // 쿠키에서 JWT 읽기 추가 (헤더에서도 계속 지원)
      jwtFromRequest: ExtractJwt.fromExtractors([
        // HTTP-Only 쿠키에서 토큰 읽기
        (request: Request) => {
          const token = request?.cookies?.access_token;
          if (!token) {
            return null;
          }
          return token;
        },
        // 기존 헤더 방식도 유지
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret', 'your-secret-key'),
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub, // userId 대신 id로 통일 (TaskController에서 사용)
      email: payload.email,
      name: payload.name
    };
  }
}