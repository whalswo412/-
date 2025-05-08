'use client';

import { CalendarIcon, ClockIcon, CheckCircle, Circle, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useTaskQuery } from '@/hooks/use-task-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface TaskDetailPanelProps {
  taskId: number;
  onClose?: () => void;
}

export function TaskDetailPanel({ taskId, onClose }: TaskDetailPanelProps) {
  const { data: task, isLoading, error } = useTaskQuery(taskId);

  // 날짜 포맷팅
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'PPP', { locale: ko });
    } catch (e) {
      return dateString;
    }
  };

  // 우선순위 한글로 변환
  const getPriorityText = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return <span className="text-red-500 font-medium">높음</span>;
      case 'medium':
        return <span className="text-amber-500 font-medium">중간</span>;
      case 'low':
        return <span className="text-green-500 font-medium">낮음</span>;
      default:
        return <span className="text-muted-foreground">미지정</span>;
    }
  };

  // 상태 아이콘 가져오기
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500 mr-1" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4 text-blue-500 mr-1" />;
      case 'pending':
      default:
        return <Circle className="h-4 w-4 text-gray-500 mr-1" />;
    }
  };

  // 상태 텍스트 가져오기
  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '완료됨';
      case 'in_progress':
        return '진행 중';
      case 'pending':
      default:
        return '대기중';
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2">로딩 중...</span>
      </div>
    );
  }

  // 에러 상태
  if (error || !task) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="text-destructive mb-2">
          {error ? (error as Error).message : '할 일을 불러올 수 없습니다.'}
        </div>
        {onClose && (
          <Button variant="outline" size="sm" onClick={onClose}>
            닫기
          </Button>
        )}
      </div>
    );
  }

  // 기본 보기 모드
  return (
    <div className="py-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-1">우선순위:</span>
              {getPriorityText(task.priority)}
            </div>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-1">상태:</span>
              <div className="flex items-center">
                {getStatusIcon(task.status)}
                {getStatusText(task.status)}
              </div>
            </div>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {task.description && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">설명</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task.description}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <div className="flex items-center space-x-2">
          <ClockIcon className="h-4 w-4 text-muted-foreground" />
          <span>생성: {formatDate(task.createdAt)}</span>
        </div>
        {task.dueDate && (
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>마감: {formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>

      {task.tags && task.tags.length > 0 && (
        <>
          <Separator />
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">태그</h3>
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag) => (
                <Badge key={tag.id}>
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 