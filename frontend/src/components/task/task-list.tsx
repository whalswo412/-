// components/task/task-list.tsx
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTaskStore } from "@/store/task-store";
import { TaskItem } from "./task-item";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function TaskList() {
  const { getAuthFetch, isAuthenticated } = useAuth();
  const { 
    tasks,
    isLoading,
    error,
    setAuthFetch,
    fetchTasks,
    toggleTaskStatus, // toggleTaskCompletion 대신 toggleTaskStatus 사용
    deleteTask
  } = useTaskStore();

  // 인증된 fetch 함수를 스토어에 설정
  useEffect(() => {
    if (isAuthenticated) {
      const authFetch = getAuthFetch();
      setAuthFetch(authFetch);
      
      // 할 일 목록 가져오기
      fetchTasks();
    }
  }, [isAuthenticated, getAuthFetch, setAuthFetch, fetchTasks]);
  
  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">할 일 목록을 불러오는 중...</span>
      </div>
    );
  }
  
  // 오류 상태 표시
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-500 mb-4">{error}</p>
        <Button 
          onClick={fetchTasks}
          variant="outline"
          size="sm"
        >
          다시 시도
        </Button>
      </div>
    );
  }
  
  // 할 일이 없는 경우
  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center border rounded-md bg-muted/20">
        <p className="text-muted-foreground mb-4">할 일이 없습니다. 새로운 할 일을 추가해보세요!</p>
        <Button
          onClick={fetchTasks}
          variant="outline"
          size="sm"
          className="mt-2"
        >
          새로고침
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">할 일 목록 ({tasks.length})</h2>
        <Button
          onClick={fetchTasks}
          variant="outline"
          size="sm"
        >
          새로고침
        </Button>
      </div>
      
      {tasks.map(task => (
        <TaskItem 
          key={task.id}
          task={task}
          onComplete={toggleTaskStatus} // toggleTaskCompletion 대신 toggleTaskStatus 사용
          onDelete={deleteTask}
        />
      ))}
    </div>
  );
}

export default TaskList;