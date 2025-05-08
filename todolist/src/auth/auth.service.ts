// src/auth/auth.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    // ID로 사용자 찾기
    async findUserById(id: number): Promise<User | null> {
        try {
            return await this.userRepository.findOne({ where: { id } });
        } catch (error) {
            this.logger.error(`사용자 ID ${id}로 조회 중 오류: ${error.message}`);
            return null;
        }
    }

    async googleLogin(googleUser: any) {
        this.logger.log(`구글 로그인 요청: ${googleUser.email}`);
        
        if (!googleUser) {
            this.logger.error('인증 실패: 구글 사용자 정보 없음');
            return '인증 실패';
        }

        try {
            // 이메일로 사용자 검색
            let user = await this.userRepository.findOne({ where: { email: googleUser.email } });
            this.logger.log(`기존 사용자 검색 결과: ${user ? '찾음' : '없음'}`);

            // 사용자가 없으면 새로 생성
            if (!user) {
                this.logger.log('새 사용자 생성 중...');
                try {
                    user = this.userRepository.create({
                        email: googleUser.email,
                        firstName: googleUser.name.givenName,
                        lastName: googleUser.name.familyName,
                        provider: googleUser.provider,
                        providerId: googleUser.providerId,
                    });
                    
                    console.log('저장 전 사용자 객체:', user);
                    user = await this.userRepository.save(user);
                    console.log('저장 후 사용자 객체:', user);
                } catch (error) {
                    console.error('사용자 저장 중 오류:', error);
                    throw error;
                }
            }

            // 토큰 생성
            const { accessToken, refreshToken } = await this.generateTokens(user);
            this.logger.log('JWT 토큰 발급 완료');

            return {
                access_token: accessToken,
                refresh_token: refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
                }
            };
        } catch (error) {
            this.logger.error(`구글 로그인 처리 중 오류: ${error.message}`);
            throw error;
        }
    }

    // Access Token과 Refresh Token 생성 메소드
    async generateTokens(user: User) {
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
        };

        // Access Token - 짧은 유효 기간 (15분)
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m'
        });

        // Refresh Token - 긴 유효 기간 (7일)
        const refreshToken = this.jwtService.sign({ sub: user.id }, {
            expiresIn: '7d'
        });

        return { accessToken, refreshToken };
    }

    // Refresh Token으로 새 Access Token 발급
    async refreshAccessToken(refreshToken: string) {
        try {
            // Refresh Token 검증
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.userRepository.findOne({ where: { id: payload.sub } });

            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다');
            }

            // 새로운 Access Token 생성
            const accessPayload = {
                sub: user.id,
                email: user.email,
                name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
            };

            const accessToken = this.jwtService.sign(accessPayload, {
                expiresIn: '15m'
            });

            return { accessToken };
        } catch (error) {
            this.logger.error(`토큰 갱신 중 오류: ${error.message}`);
            throw error;
        }
    }
}