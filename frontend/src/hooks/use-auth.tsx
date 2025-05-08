'use client'

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode, 
  useCallback
} from 'react'

// 사용자 타입 정의
type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
} | null;

// 인증 컨텍스트 타입 정의
type AuthContextType = {
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  getAuthFetch: () => (url: string, options?: RequestInit) => Promise<Response>;
};

// API 기본 URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// 기본값 설정
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  checkAuth: async () => false,
  getAuthFetch: () => fetch,
});

// AuthProvider 컴포넌트
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshAttempt, setLastRefreshAttempt] = useState(0); // 토큰 갱신 요청 중복 방지용
  
  // 사용자 상태 업데이트 래퍼 함수
  const updateUser = useCallback((newUser: User) => {
    console.log('유저 상태 업데이트:', newUser);
    setUser(newUser);
  }, []);
  
  // 쿠키에서 사용자 정보 가져오기
  const getUserFromCookie = (): User => {
    try {
      const cookies = document.cookie.split(';');
      const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='));
      
      if (!userCookie) return null;
      
      const userValue = userCookie.split('=')[1];
      const decodedValue = decodeURIComponent(userValue);
      const parsedUser = JSON.parse(decodedValue);
      
      return parsedUser;
    } catch (error) {
      console.error('쿠키에서 사용자 정보를 파싱하는 중 오류 발생:', error);
      return null;
    }
  };

  // 토큰 갱신 함수
  const refreshToken = useCallback(async (): Promise<boolean> => {
    // 마지막 갱신 요청으로부터 5초 이내라면 중복 요청 방지
    const now = Date.now();
    if (now - lastRefreshAttempt < 5000) {
      console.log('토큰 갱신 요청이 최근에 실행됨 (5초 이내), 건너뜀');
      return false;
    }
    
    setLastRefreshAttempt(now);
    setIsRefreshing(true);
    console.log('토큰 갱신 시도 중...');
    
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // 쿠키 포함
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('토큰 갱신 성공');
        setIsRefreshing(false);
        return true;
      } else {
        console.log('토큰 갱신 실패:', response.status);
        setIsRefreshing(false);
        return false;
      }
    } catch (error) {
      console.error('토큰 갱신 중 오류:', error);
      setIsRefreshing(false);
      return false;
    }
  }, [lastRefreshAttempt]);

  // 인증이 필요한 API 호출을 위한 fetch 함수 제공
  const getAuthFetch = useCallback(() => {
    return async (url: string, options: RequestInit = {}): Promise<Response> => {
      const fetchOptions: RequestInit = {
        ...options,
        credentials: 'include', // 모든 요청에 쿠키 포함
      };
      
      // API 호출 시도
      let response = await fetch(url, fetchOptions);
      
      // 401 오류 (인증 실패)면 토큰 갱신 시도
      if (response.status === 401) {
        console.log('API 호출 401 오류, 토큰 갱신 시도');
        const refreshSuccessful = await refreshToken();
        
        if (refreshSuccessful) {
          // 토큰 갱신에 성공하면 원래 요청 재시도
          console.log('토큰 갱신 후 API 호출 재시도');
          response = await fetch(url, fetchOptions);
        }
      }
      
      return response;
    };
  }, [refreshToken]);

  // 인증 상태 확인 함수
  const checkAuth = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('인증 상태 확인 중...');
      
      // 쿠키에서 사용자 정보 확인
      const cookieUser = getUserFromCookie();
      console.log('쿠키에서 사용자 정보:', cookieUser ? '존재함' : '없음');
      
      // 쿠키에 사용자 정보가 있으면 인증된 것으로 간주
      if (cookieUser) {
        console.log('쿠키에 사용자 정보 존재함 - 인증됨');
        updateUser(cookieUser);
        setIsLoading(false);
        return true;
      }
      
      // 사용자 정보가 없으면 서버에서 가져오기 시도
      console.log('백엔드에서 사용자 정보 확인 시도');
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
        credentials: 'include', // 쿠키 포함
          headers: {
            'Accept': 'application/json'
          }
      });
      
      if (response.ok) {
        const data = await response.json();
          console.log('백엔드에서 사용자 정보 가져옴:', data);
          
          if (data.user) {
          updateUser(data.user);
          setIsLoading(false);
          return true;
        }
        } else {
          console.log('사용자 정보 가져오기 실패:', response.status);
          // 401 오류 발생 시 토큰 갱신 시도
          if (response.status === 401) {
            const refreshSuccessful = await refreshToken();
            if (refreshSuccessful) {
              // 토큰 갱신 성공 시 인증 확인 재시도
              return await checkAuth();
            }
          }
        }
      } catch (error) {
        console.error('백엔드 API 호출 중 오류:', error);
      }
      
      // 인증 실패 처리
      if (window.location.pathname === '/dashboard') {
        console.log('대시보드 페이지에서 인증 실패 - 로그인 UI 표시 예정');
      } else if (
        window.location.pathname.startsWith('/auth/success') ||
        window.location.pathname.startsWith('/api/auth')
      ) {
        console.log('인증 플로우 진행 중 - 처리 계속');
      } else {
        console.log('인증 실패: 유효한 세션이나 토큰이 없음');
      }
      
      updateUser(null);
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('인증 확인 중 오류 발생:', error);
      updateUser(null);
      setIsLoading(false);
      return false;
    }
  };

  // 로그인 함수
  const login = useCallback(() => {
    console.log('로그인 함수 호출 - 구글 로그인으로 리다이렉트');
    window.location.href = '/api/auth/google/login';
  }, []);

  // 로그아웃 함수
  const logout = useCallback(async () => {
    try {
      console.log('로그아웃 함수 호출');
      
      // 백엔드에 로그아웃 요청 (모든 쿠키를 삭제하기 위함)
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          credentials: 'include'
        });
        console.log('백엔드 로그아웃 성공');
      } catch (error) {
        console.warn('백엔드 로그아웃 실패 (무시됨):', error);
      }
      
      // 클라이언트 측에서 사용자 쿠키 삭제
      document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // 상태 초기화
      updateUser(null);
      
      // 홈으로 리다이렉트
      window.location.href = '/';
      
      console.log('로그아웃 완료');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  }, [updateUser]);

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
      checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        checkAuth,
        getAuthFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// useAuth 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}