// API 엔드포인트 기본 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Task 인터페이스 정의
export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  tags?: Tag[];
}

// Tag 인터페이스 정의
export interface Tag {
  id: number;
  name: string;
  color: string;
}

// API 에러 처리 함수
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || '서버에 문제가 발생했습니다.');
  }
  return response.json();
};

// 인증 관련 설정
const getAuthHeader = (): RequestInit => {
  return {
    credentials: 'include' // 쿠키 포함하여 요청
  };
};

// Tasks API 서비스
export const tasksApi = {
  // 모든 할 일 가져오기
  getAllTasks: async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks/all`, {
      ...getAuthHeader(),
    });
    return handleResponse(response);
  },
  
  // 할 일 생성
  createTask: async (task: Omit<Task, 'id'>): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
      ...getAuthHeader(),
    });
    return handleResponse(response);
  },
  
  // 할 일 수정
  updateTask: async (id: number, task: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
      ...getAuthHeader(),
    });
    return handleResponse(response);
  },
  
  // 할 일 삭제
  deleteTask: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      ...getAuthHeader(),
    });
    return handleResponse(response);
  },
  
  // 태그 업데이트
  updateTaskTags: async (taskId: number, tagIds: number[]): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/tags`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tagIds }),
      ...getAuthHeader(),
    });
    return handleResponse(response);
  },
};

// Tags API 서비스
export const tagsApi = {
  // 모든 태그 가져오기
  getAllTags: async (): Promise<Tag[]> => {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      ...getAuthHeader(),
    });
    return handleResponse(response);
  },
  
  // 태그 생성
  createTag: async (tag: Omit<Tag, 'id'>): Promise<Tag> => {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tag),
      ...getAuthHeader(),
    });
    return handleResponse(response);
  },
};