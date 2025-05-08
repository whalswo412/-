'use client';

import { useAuth } from "@/hooks/use-auth";
import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Task 인터페이스 정의
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

// 새 Task 생성시 필요한 인터페이스
export interface NewTask {
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string | null;
  tags?: number[];
}

// API 기본 URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * 모든 Task를 가져오는 훅
 */
export function useTasksQuery() {
  const { getAuthFetch, isAuthenticated } = useAuth();
  const authFetch = useMemo(() => getAuthFetch(), [getAuthFetch]);

  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const response = await authFetch(
        `${API_URL}/tasks/all`
      );
      if (!response.ok) throw new Error("할 일 목록을 불러올 수 없습니다.");
      return response.json();
    },
    enabled: isAuthenticated,
  });
}

/**
 * 단일 Task를 가져오는 훅
 */
export function useTaskQuery(taskId: number) {
  const { getAuthFetch, isAuthenticated } = useAuth();
  const authFetch = useMemo(() => getAuthFetch(), [getAuthFetch]);

  return useQuery<Task>({
    queryKey: ["task", taskId],
    queryFn: async () => {
      if (!isAuthenticated || !taskId) throw new Error("인증이 필요하거나 유효한 ID가 필요합니다.");
      const response = await authFetch(
        `${API_URL}/tasks/${taskId}`
      );
      if (!response.ok) throw new Error("할 일을 불러올 수 없습니다.");
      return response.json();
    },
    enabled: isAuthenticated && !!taskId,
  });
}

/**
 * Task 상태 토글 Mutation
 */
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

/**
 * Task 삭제 Mutation
 */
export function useDeleteTaskMutation() {
  const { getAuthFetch } = useAuth();
  const authFetch = useMemo(() => getAuthFetch(), [getAuthFetch]);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: number) => {
      const response = await authFetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error("할 일을 삭제할 수 없습니다");
      return taskId;
    },
    onSuccess: () => {
      // 성공시 task 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });
}

/**
 * Task 추가 Mutation
 */
export function useAddTaskMutation() {
  const { getAuthFetch } = useAuth();
  const authFetch = useMemo(() => getAuthFetch(), [getAuthFetch]);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTask: NewTask) => {
      const response = await authFetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      });

      if (!response.ok) throw new Error("할 일을 추가할 수 없습니다");
      return response.json();
    },
    onSuccess: () => {
      // 성공시 task 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });
}

/**
 * Task 업데이트 Mutation
 */
export function useUpdateTaskMutation() {
  const { getAuthFetch } = useAuth();
  const authFetch = useMemo(() => getAuthFetch(), [getAuthFetch]);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: number, updates: Partial<Task> }) => {
      const response = await authFetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error("할 일을 업데이트할 수 없습니다");
      return response.json();
    },
    onSuccess: (data) => {
      // 성공시 단일 task 및 전체 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["task", data.id] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });
} 