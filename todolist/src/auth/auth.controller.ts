import { Controller, Get, Post, Req, Res, UseGuards, Body, UnauthorizedException, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // google 로그인 클릭시 호출
    @Get('google/login')
    @UseGuards(AuthGuard('google'))
    async googleLogin(@Req() req: Request) {
        console.log('GET /auth/google/login 실행');
    }

    // 구글 로그인 콜백 처리
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res, @Headers('accept') accept) {
        console.log('GET auth/google/callback - googleAuthRedirect 실행');
        const result = await this.authService.googleLogin(req.user);
        console.log('로그인 결과 : ', result);
        
        // 로그인 실패 처리
        if (result === '인증 실패') {
            return res.status(401).redirect('http://localhost:3000?error=auth_failed');
        }
        
        // JSON 요청인 경우 (프론트엔드 API 라우트에서 요청)
        if (accept && accept.includes('application/json')) {
            console.log('JSON 응답 반환');
            // JSON 응답에는 사용자 정보만 포함 (토큰 정보는 쿠키로만 전송)
            return res.status(200).json({ user: result.user });
        }
        
        // 아닌 경우 기존처럼 쿠키 설정 후 리다이렉트 (브라우저 직접 요청)
        console.log('쿠키 설정 및 리다이렉트');
        
        // Access Token - HTTP-Only 쿠키 (JS 접근 불가)
        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송
            path: '/',
            maxAge: 15 * 60 * 1000 // 15분
        });
        
        // Refresh Token - HTTP-Only 쿠키 (JS 접근 불가)
        res.cookie('refresh_token', result.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/auth', // /auth 경로에서만 사용 가능하도록 제한
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7일
        });
        
        // 사용자 정보는 JS에서 접근할 수 있게 함 (선택 사항)
        res.cookie('user', JSON.stringify(result.user), {
            httpOnly: false, // JS에서 읽을 수 있음
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        // 프론트엔드 대시보드로 리다이렉트
        return res.redirect('http://localhost:3000/auth/success');
    }
    
    // Access Token 갱신 엔드포인트
    @Post('refresh')
    async refreshToken(@Req() req, @Res() res) {
        try {
            // Refresh Token은 쿠키에서 읽기
            const refreshToken = req.cookies['refresh_token'];
            
            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh Token이 없습니다' });
            }
            
            // 새 Access Token 발급
            const { accessToken } = await this.authService.refreshAccessToken(refreshToken);
            
            // 새 Access Token을 쿠키에 설정
            res.cookie('access_token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 15 * 60 * 1000 // 15분
            });
            
            return res.status(200).json({ success: true });
            
        } catch (error) {
            // Refresh Token이 유효하지 않으면 쿠키 삭제
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
            res.clearCookie('user');
            
            return res.status(401).json({ message: '인증 만료. 다시 로그인하세요.' });
        }
    }
    
    // 현재 인증된 사용자 정보 조회 (클라이언트용)
    @Get('me')
    async getProfile(@Req() req, @Res() res) {
        try {
            console.log('GET /auth/me 호출됨');
            console.log('쿠키:', req.cookies);
            
            // 사용자 쿠키 확인
            const userCookie = req.cookies['user'];
            const accessToken = req.cookies['access_token']; 
            const refreshToken = req.cookies['refresh_token'];
            
            // 사용자 쿠키가 없으면 인증 실패
            if (!userCookie) {
                console.log('사용자 쿠키가 없음');
                return res.status(401).json({ message: '인증되지 않은 사용자' });
            }
            
            // 액세스 토큰이 없으면 리프레시 토큰으로 갱신 시도
            if (!accessToken && refreshToken) {
                console.log('액세스 토큰 없음, 리프레시 토큰으로 갱신 시도');
                try {
                    const refreshResult = await this.authService.refreshAccessToken(refreshToken);
                    
                    // 새 액세스 토큰 발급 성공
                    if (refreshResult.accessToken) {
                        // 새 액세스 토큰을 쿠키에 설정
                        res.cookie('access_token', refreshResult.accessToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            path: '/',
                            maxAge: 15 * 60 * 1000 // 15분
                        });
                    }
                } catch (error) {
                    console.error('토큰 갱신 실패:', error.message);
                    // 리프레시 토큰이 유효하지 않으면 모든 인증 쿠키 삭제
                    res.clearCookie('access_token');
                    res.clearCookie('refresh_token');
                    res.clearCookie('user');
                    return res.status(401).json({ message: '인증 만료. 다시 로그인하세요.' });
                }
            }
            
            // 사용자 정보 파싱
            const user = JSON.parse(userCookie);
            console.log('사용자 정보:', user);
            
            // 액세스 토큰이 없거나 만료되었고, 리프레시 토큰도 없는 경우 새 토큰 발급
            if (!accessToken && !refreshToken) {
                console.log('액세스 토큰 및 리프레시 토큰 없음, 새 토큰 발급');
                // 사용자 ID로 DB에서 사용자 조회
                const userEntity = await this.authService.findUserById(user.id);
                
                if (userEntity) {
                    // 새 토큰 발급
                    const tokens = await this.authService.generateTokens(userEntity);
                    
                    // 쿠키에 새 토큰 설정
                    res.cookie('access_token', tokens.accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        path: '/',
                        maxAge: 15 * 60 * 1000 // 15분
                    });
                    
                    res.cookie('refresh_token', tokens.refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        path: '/auth',
                        maxAge: 7 * 24 * 60 * 60 * 1000 // 7일
                    });
                    
                    console.log('새 토큰 발급 완료');
                }
            }
            
            // 응답에는 사용자 정보만 포함 (토큰 정보는 쿠키로만 전송)
            return res.status(200).json({ user });
            
        } catch (error) {
            console.error('인증 정보 조회 오류:', error);
            return res.status(401).json({ message: '인증 정보를 읽을 수 없습니다', error: error.message });
        }
    }

    // 로그아웃 엔드포인트 - 모든 인증 쿠키 삭제
    @Post('logout')
    async logout(@Req() req, @Res() res) {
        console.log('POST /auth/logout 호출됨');
        
        // 모든 인증 관련 쿠키 삭제
        res.clearCookie('access_token', { path: '/' });
        res.clearCookie('refresh_token', { path: '/auth' });
        res.clearCookie('user', { path: '/' });
        
        return res.status(200).json({ message: '로그아웃 성공' });
    }
}