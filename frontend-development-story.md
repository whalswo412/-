# 🌐 프론트엔드 개발 이야기 (Next.js)

백엔드 API 서버를 만들고 나니, 자연스럽게 이걸 사용할 수 있는 프론트엔드를 만들어보고 싶어졌다. 특별히 "프론트를 잘해야겠다!"는 아니었고, 그냥 **내가 만든 API를 직접 써보는 경험**이 재밌을 것 같았다.

## 🚀 왜 Next.js였을까?

솔직히 이유는 단순했다. **Next.js를 한번 써보고 싶었기 때문**이다.

SSR(서버사이드 렌더링)도 그렇고, 파일 기반 라우팅이나 API 라우트 같은 기능들이 궁금했다.

리액트는 조금 써봤지만, Next.js는 거의 처음이라 배우면서 만들었다.

## 🎨 TailwindCSS + Shadcn UI 조합

스타일은 무조건 **Tailwind CSS**로. 이유는 하나, 클래스만으로 스타일을 짜는 게 간단하고 빠르기 때문.

하지만 마크업을 일일이 다 짜기에는 시간이 오래 걸리고, 디자인적으로 부족할 수도 있어서 **shadcn/ui** 컴포넌트를 많이 활용했다.

덕분에 기본적인 폼, 버튼, 모달 같은 건 빠르게 만들 수 있었다.

## 🧩 화면 구성 방식

처음에는 진짜 간단하게 만들려고 했다. "그냥 할 일만 등록하고 완료 체크할 수 있으면 되지!" 정도였는데...

하다 보니 **"이왕이면 좀 보기 좋게 만들까?"** 싶은 욕심이 생겼고, 결국 통계 대시보드나 태그 필터도 나름 예쁘게 구성했다.

**구성한 주요 화면들**:

- ✅ 할 일 목록
- ➕ 할 일 등록/수정 폼
- 🏷️ 태그 선택 및 필터링
- 📊 통계 대시보드 (완료 수, 우선순위 분포 등)

기본적인 레이아웃은 반응형으로 짰고, 모바일에서도 크게 불편하지 않게 만들었다.

처음보다 화면 구성이 훨씬 풍성해졌지만, 결과적으로는 내가 더 자주 쓰게 된 것 같다.

## 🛠️ 사용한 프론트엔드 기술

- **Next.js 14 (App Router)**
- **React**
- **Tailwind CSS**
- **Shadcn UI**
- **React Hook Form / Zod** – 폼 검증 및 유효성 체크
- **React Query** – 비동기 데이터 관리 및 캐싱

## 🧱 레이아웃 구조 리팩터링

shadcn/ui 공식 문서를 살펴보다가 대시보드 예제가 눈에 띄어서, 그냥 그대로 복사해서 써봤다.

(https://ui.shadcn.com/blocks 참고)

**사이드바와 헤더는 한두 페이지만 쓸 게 아니라 거의 모든 화면에서 반복될 것 같아서**,

레이아웃 구조를 조금 정리해서 재사용 가능한 형태로 리팩터링했다.

### 🧩 어떻게 구조를 바꿨는지

- `RootLayout`에 `SidebarProvider`와 `AppSidebar`를 최상단으로 위치시킴
    
    → 이렇게 하면 어느 페이지로 이동하든 사이드바는 항상 유지된다.
    
- `SidebarInset`은 메인 콘텐츠를 감싸는 용도로 사용
    
    → 사이드바와 콘텐츠 영역을 자연스럽게 분리하는 역할.
    
- 그 안에서 `children`을 렌더링하면서 각 페이지의 내용을 출력.
- 전역 상태 (`AuthProvider`)는 더 바깥쪽에서 감싸서 모든 페이지에서 사용할 수 있게 했다.
- 헤더는 `AppHeader`라는 컴포넌트로 따로 분리해서 필요한 곳에만 불러서 쓸 수 있도록 구성.

```tsx
// RootLayout.tsx
<body className="flex min-h-screen">
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset className="flex-1 flex flex-col">
      {children}
    </SidebarInset>
  </SidebarProvider>
</body>

// AppHeader.tsx
<header className="flex h-16 shrink-0 items-center gap-2 border-b">
  <div className="flex items-center gap-2 px-3">
    <SidebarTrigger />
    <Separator orientation="vertical" className="mr-2 h-4" />
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>Data Fetching</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </div>
</header>
```

## ✅ 메인(할 일) 페이지

핵심 기능인 **할 일 페이지**를 만들 차례다.

이 화면은 사용자가 가장 오래 머무는 곳이기도 하고, 할 일을 추가하거나 삭제하고, 상태를 옮기는 등 **인터랙션이 굉장히 많은 곳**이다. 그래서 처음부터 기능보다는 흐름에 집중해서, 어떻게 하면 자연스럽게 작업할 수 있을지를 고민했다.

**구조는 보드 → 리스트 → 할 일 항목**처럼 트리 형태로 잡았고, 

**생각해보니깐 투두앱은 SSR이 굳이 필요 없었다. (대시보드 페이지 정도?)**

렌더링보다 중요한 건 **상태 관리와 비동기 통신** 쪽이었기 때문에, 데이터를 가져오고 저장하는 로직은 전부 클라이언트에서 처리했다.

### 📐 어떤 구조가 편할까?

막연히 시작한 건 아니고, 머릿속으로 몇 가지 UI 레이아웃을 떠올려 봤다.

- 할 일은 많아질 수 있으니까 **스크롤 가능한 리스트가 필요**했고
- 필터나 태그 기능이 점점 추가될 거라서 **좌측에 패널을 고정하는 형태**가 좋을 것 같았다
- 우측은 선택한 항목을 상세히 보여주거나, 앞으로 다른 기능들을 붙일 수 있게끔 여유를 두는 구조

그래서 최종적으로 아래와 같은 구성으로 결정:

| 영역 | 설명 |
| --- | --- |
| 좌측 패널 | 검색, 필터 버튼, 태그 리스트, 할 일 목록 등 주요 제어 UI |
| 우측 패널 | 선택된 항목의 상세 보기, 향후 기능 확장 공간 |
| 전체 구조 | shadcn/ui의 `ResizablePanelGroup`을 사용한 드래그 가능한 2분할 레이아웃 |

### 🧱 shadcn/ui 문서를 참고하면서 구현

shadcn/ui 공식 문서를 보면서 구조를 참고했고, 특히 대시보드 예제와 `Resizable` 컴포넌트 사용법이 큰 도움이 됐다.

좌우로 패널을 나누는 데는 `ResizablePanelGroup`과 `ResizablePanel`, `ResizableHandle`을 조합했고, 각각의 패널 안쪽에 내가 원하는 컴포넌트를 넣어주는 방식이다.

```tsx
<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={40} className="min-w-130">
    {/* 좌측: 검색바, 필터, 리스트 */}
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={60}>
    {/* 우측: 컨텐츠 */}
  </ResizablePanel>
</ResizablePanelGroup>
```

- `direction="horizontal"`로 가로 분할
- `defaultSize`는 퍼센트로 비율 지정
- `withHandle`을 주면 드래그 핸들이 생김
- `min-w-130`으로 최소 넓이를 지정해줘야 사이드 패널이 너무 작아지지 않음

### 🔍 좌측 패널 구성

상단엔 검색바와 버튼을 배치했다. 여기에 lucide-react 아이콘을 넣어서 필터/옵션 버튼으로 쓰고 있다.

```tsx
<div className="h-15 flex-shrink-0 p-4 flex items-center gap-2">
  <Input type="text" placeholder="검색" />
  <Button variant="outline" size="icon">
    <SlidersHorizontal className="size-5" />
  </Button>
  <Button variant="outline" size="icon">
    <Ellipsis className="size-5" />
  </Button>
</div>
```

- `Input`, `Button`은 모두 shadcn/ui 컴포넌트
- 아이콘은 lucide-react에서 가져와서 버튼 안에 넣었고, Tailwind로 크기 제어

그 아래쪽은 리스트가 길어질 걸 고려해서 `ScrollArea`로 감쌌다. 실제 할 일 리스트는 `Task-list` 컴포넌트로 따로 분리해서 불러온다.

```tsx
<ScrollArea className="h-full w-full rounded-md mt-2">
  <div className="p-4">
    <TaskList />
  </div>
</ScrollArea>
```

### 📄 우측 패널 구성

1. **사용자가 할 일(Task) 목록에서 항목을 클릭**
- 클릭한 Task의 id가 selectedTaskId 상태로 저장됨
1. **상세 패널(TaskDetailPanel)에서 해당 id로 데이터 요청**
- useTaskQuery(selectedTaskId) 훅을 사용해 백엔드 API(/tasks/{id})로 단일 Task 데이터 fetch
- 인증은 기존의 authFetch(쿠키 기반)로 처리

나중에 기능추가 예정

```tsx
<ResizablePanel defaultSize={60}>
  <div className="h-full p-6 overflow-auto">
    <TaskDetailPanel taskId={selectedTaskId} />
  </div>
</ResizablePanel>
```

### 🛠️ 개발하면서 겪은 이슈들

| 문제 | 원인 | 해결 |
| --- | --- | --- |
| 좌측 패널의 리스트가 부모 높이를 넘어서도 스크롤 안 됨 | flex에서 자식 요소에 `min-h-0`이 없으면 overflow가 작동 안 함 | `.min-h-0` 추가 |
| 전체 페이지가 스크롤되는 문제 | 루트 div에 `overflow-hidden`을 안 줬기 때문 | 가장 바깥 컨테이너에 `overflow-hidden` 설정 |
| 브레드크럼 클릭 시 페이지가 새로고침됨 | `BreadcrumbLink`가 `<a>` 태그를 직접 사용 | `next/link`로 교체해서 클라이언트 네비게이션으로 변경 |

### 📚 참고 자료

- [shadcn/ui 공식 문서](https://ui.shadcn.com/)
- [Radix UI ScrollArea](https://www.radix-ui.com/docs/primitives/components/scroll-area)
- [lucide-react 아이콘 목록](https://lucide.dev/)

## 🔐 인증 로직 통합

백엔드는 NestJS, 프론트는 Next.js를 쓰고 있는데, 로그인은 **구글 OAuth**로 처리했다.

처음엔 그냥 백엔드에서 처리하고 끝내려 했는데, 쿠키와 인증 상태를 클라이언트에서도 제대로 관리하려면 구조를 조금 더 잡아야 했다.

결론적으로는 **프론트에서는 API 라우트를 따로 두지 않고**, 모든 인증 요청을 **백엔드에 직접 보내는 구조**로 정리했고, 상태 관리는 `AuthProvider`와 `useAuth` 훅을 통해 전역에서 처리하게 만들었다.

### 🛠 백엔드 (NestJS)

| 경로 | 설명 |
| --- | --- |
| `/auth/google/login` | 구글 로그인 시작 |
| `/auth/google/callback` | `AuthGuard('google')`로 인증 → `AuthService.googleLogin()`에서 JWT 발급 및 쿠키 설정 후 `/auth/success`로 리다이렉트 |
| `/auth/me` | 쿠키 기반으로 현재 사용자 정보 반환 → 액세스 토큰 만료 시 리프레시로 자동 갱신 |
| `/auth/refresh` | 리프레시 토큰으로 액세스 토큰 재발급 |
| `/auth/logout` | 모든 인증 관련 쿠키 삭제 |

**설정하는 쿠키:**

- `access_token` (HTTP-Only)
- `refresh_token` (HTTP-Only)
- `user` (일반 쿠키, 클라이언트 접근 가능)

### 💻 프론트엔드 (Next.js)

프론트에선 더 이상 API 라우트를 사용하지 않는다. 인증 관련 요청은 전부 **백엔드와 직접 통신**하고, **HTTP-Only 쿠키**만으로 상태를 관리한다. 즉, 로컬스토리지나 세션스토리지에 토큰을 저장하지 않는다.

### 🌐 상태 관리

전역 상태는 `AuthProvider`와 `useAuth` 훅에서 처리하고 있다.

```tsx
// 로그인 요청
login() {
  window.location.href = 'http://localhost:3001/auth/google/login';
}
```

- `user`, `isAuthenticated`, `isLoading` 등의 상태 제공
- `login()`, `logout()` 함수도 훅에서 제공
- 앱 마운트 시 자동으로 인증 상태를 확인하고 갱신

```tsx
useEffect(() => {
  checkAuth();
  // 쿠키 확인 → /auth/me 요청 → 401이면 /auth/refresh → 다시 /auth/me
}, []);
```

### 🔁 자동 인증 갱신

모든 API 요청에는 `credentials: 'include'` 옵션을 주고, 만약 `401 Unauthorized` 응답이 오면 자동으로 `/auth/refresh`를 호출한 뒤 재시도한다. 이건 `getAuthFetch()` 함수에서 자동으로 처리된다.

```tsx
const getAuthFetch = useCallback(() => {
  return async (url: string, options: RequestInit = {}) => {
    const fetchOptions = { ...options, credentials: 'include' };
    let response = await fetch(url, fetchOptions);

    if (response.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) {
        response = await fetch(url, fetchOptions);
      }
    }

    return response;
  };
}, [refreshToken]);
```

이걸로 인해 각 페이지나 기능에서 별도로 인증 처리 로직을 반복하지 않아도 된다. 그냥 `useAuth()` 훅을 불러오면 현재 사용자 정보와 로그인/로그아웃 기능이 다 들어있다.

### 📌 포인트 정리

- **API 라우트 제거**: 프론트 → 백엔드 직접 호출
- **로컬스토리지 X**: 모든 토큰은 HTTP-Only 쿠키로 처리
- **자동 토큰 갱신**: `/auth/me` → 실패 시 `/auth/refresh` → 재시도
- **getAuthFetch()**: 인증 필요한 API 호출은 여기서 처리

## 🧩 개발 중 겪었던 문제와 해결 방식

| 문제 | 원인 | 해결 방법 |
| --- | --- | --- |
| NavUser가 로그인 이후에도 계속 게스트 상태로 표시됨 | `AppSidebar`가 `props`로 `data.user`를 넘기던 구조 | `useAuth`에서 직접 상태를 읽도록 변경 |
| 쿠키에 설정된 유저 정보가 안 읽힘 | `AuthProvider`가 사이드바 내부에 있어서 Context가 분리됨 | `layout.tsx`에서 `AuthProvider`를 `SidebarProvider` 바깥으로 이동 |
| API 라우트에서 백엔드 리다이렉트만 처리돼서 쿠키가 안 먹힘 | 백엔드에서만 redirect 하면 쿠키가 클라이언트에 적용되지 않음 | API 라우트에서 `fetch`로 응답 받아 직접 `response.cookies.set()` 처리 |
| `useAuth` 초기화 시 렌더링 2번씩 됨 | `setUser`, `setIsLoading`을 직접 호출해서 발생 | `useCallback`으로 묶은 `updateUser()` 래퍼 함수 사용해서 최적화 |

## 📌 아쉬운 점과 보완하고 싶은 부분

- 컴포넌트 설계가 처음부터 구조적으로 잘 되진 않아서, 중간에 리팩터링이 필요했다.
- 통계 시각화를 위해 차트를 붙이고 싶은데 아직 구현 전 상태.

## 🛠️ 백엔드 API 통신 & 상태 관리 구조 (with react-query)

처음엔 `Zustand`로 서버 데이터를 관리했는데, **react-query로 구조를 정리**하면서 더 깔끔해졌다.

앞으로는 모든 도메인에서 `"백엔드 API ↔ react-query ↔ 컴포넌트"` 구조를 기본으로 사용한다.

인증 fetch는 그대로 두고, 그 위에서 react-query가 데이터를 잘 다뤄주는 방식!

예시로 `Task` 데이터를 기준으로 흐름을 정리하면 아래와 같다👇

### 1. Task 데이터 타입 정의

```tsx
export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low' | string;
  status: 'completed' | 'pending' | 'in_progress' | string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  userId: number;
  tags: { id: number; name: string }[];
}
```

- 인터페이스는 현재 `use-task-query.ts` 내에서 정의하고 export

### 2. react-query 기반 데이터 패칭 훅

```tsx
import { useAuth } from "@/hooks/use-auth";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Task } from "@/components/task/task-item";

export function useTasksQuery() {
  const { getAuthFetch, isAuthenticated } = useAuth();
  const authFetch = useMemo(() => getAuthFetch(), [getAuthFetch]);

  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/tasks/all`
      );
      if (!response.ok) throw new Error("할 일 목록을 불러올 수 없습니다.");
      return response.json();
    },
    enabled: isAuthenticated,
  });
}
```

- `authFetch()`는 자동으로 토큰을 붙여주는 안전한 fetch 래퍼
- 로그인 상태일 때만 요청하도록 `enabled` 옵션 사용

### 3. Mutation 훅 구현

```tsx
export function useToggleTaskStatusMutation() {
  const { getAuthFetch } = useAuth();
  const authFetch = useMemo(() => getAuthFetch(), [getAuthFetch]);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: number) => {
      // 현재 task 상태 가져오기
      const tasks = queryClient.getQueryData<Task[]>(["tasks"]) || [];
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error("할 일을 찾을 수 없습니다");

      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      
      const response = await authFetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error("할 일 상태를 변경할 수 없습니다");
      return response.json();
    },
    onSuccess: () => {
      // 성공시 task 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });
}
```

- `useMutation`으로 데이터 변경 작업 처리
- 성공 시 자동으로 관련 쿼리 무효화하여 데이터 갱신

### 4. 컴포넌트에서 사용 방식

```tsx
function TaskItem({ task }: { task: Task }) {
  const toggleMutation = useToggleTaskStatusMutation();
  const deleteMutation = useDeleteTaskMutation();

  return (
    <div className="task-item">
      <Checkbox 
        checked={task.status === 'completed'}
        onCheckedChange={() => toggleMutation.mutate(task.id)}
      />
      <span>{task.title}</span>
      <Button onClick={() => deleteMutation.mutate(task.id)}>삭제</Button>
    </div>
  );
}
```

- 컴포넌트는 데이터 로직을 직접 처리하지 않고 훅에서 제공하는 메서드만 사용
- 이 방식으로 UI와 데이터 로직 관심사 분리

### ✅ 정리

- `authFetch()`는 인증 토큰을 자동으로 붙이고, 만료 시 갱신도 알아서 해주는 래퍼
- `React Query`는 API 요청을 직접 하지 않고, 훅만 작성하면 캐싱/로딩/에러 처리를 자동으로 해줌
- 이 구조 덕분에 **컴포넌트는 UI에 집중**할 수 있게 됨
</rewritten_file> 