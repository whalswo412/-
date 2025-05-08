"use client"
import Link from "next/link";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  LogIn,
  Sparkles,
  User,
  Settings
} from "lucide-react"

import { useAuth } from "@/hooks/use-auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const { isMobile } = useSidebar();

  // 사용자 정보 - 로그인 상태에 따라 표시할 내용 결정
  const userInfo = isAuthenticated && user ? {
    name: user.name,
    email: user.email,
    avatar: user.avatar || ''
  } : {
    name: '게스트',
    email: '로그인이 필요합니다',
    avatar: ''
  };

  // 로그인 버튼 클릭 핸들러
  const handleLogin = () => {
    login();
  };

  // 로그인 중 상태 표시를 위한 변수
  const showLoadingState = isLoading;
  const avatarInitials = userInfo.name.substring(0, 2).toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {showLoadingState ? (
                  <AvatarFallback className="rounded-lg animate-pulse">...</AvatarFallback>
                ) : (
                  <>
                <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                <AvatarFallback className="rounded-lg">
                      {avatarInitials}
                </AvatarFallback>
                  </>
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {showLoadingState ? '로딩 중...' : userInfo.name}
                </span>
                <span className="truncate text-xs">
                  {showLoadingState ? '' : userInfo.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {showLoadingState ? (
                    <AvatarFallback className="rounded-lg">...</AvatarFallback>
                  ) : (
                    <>
                  <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                  <AvatarFallback className="rounded-lg">
                        {avatarInitials}
                  </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userInfo.name}</span>
                  <span className="truncate text-xs">{userInfo.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {isLoading ? (
              // 로딩 중 표시
              <DropdownMenuGroup>
                <DropdownMenuItem disabled>
                  <div className="flex items-center w-full justify-center py-1">
                    <span className="text-muted-foreground">로딩 중...</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            ) : isAuthenticated ? (
              // 로그인된 경우 표시할 메뉴
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    내 프로필
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    설정
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles className="mr-2 h-4 w-4" />
                    프리미엄 업그레이드
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    결제 정보
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    알림
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </>
            ) : (
              // 로그인되지 않은 경우 표시할 메뉴
              <>
                <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <button 
                      className="flex w-full items-center px-2 py-1.5 text-sm"
                      onClick={handleLogin}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Google로 로그인
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles className="mr-2 h-4 w-4" />
                    서비스 소개
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    공지사항
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}