import { Separator } from "@radix-ui/react-separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Calendar, ArrowUp, ArrowRight, ArrowDown } from "lucide-react";
import { Task } from "@/hooks/use-task-query";
interface TaskItemProps {
  task: Task;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TaskItem({ task, onComplete, onDelete }: TaskItemProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getPriorityIcon = () => {
    switch(task.priority?.toLowerCase()) {
      case 'high':
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <ArrowRight className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const isCompleted = task.status === 'completed';

  return (
    <div className="rounded-md border p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div className="space-y-1 flex-1">
          <div className="flex items-center space-x-2">
            <Checkbox 
              checked={isCompleted} 
              onCheckedChange={() => onComplete(task.id)}
              className="h-5 w-5"
            />
            <h4 className={`text-sm font-medium leading-none ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h4>
            {getPriorityIcon()}
          </div>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-2 ml-7">
              {task.description}
            </p>
          )}
          <div className="flex items-center text-xs text-muted-foreground mt-2 ml-7 space-x-3">
            <span>생성: {formatDate(task.createdAt)}</span>
            {task.dueDate && (
              <span className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                마감: {formatDate(task.dueDate)}
              </span>
            )}
            <span className="capitalize">
              상태: {task.status}
            </span>
          </div>
        </div>
        <button 
          onClick={() => onDelete(task.id)}
          className="text-muted-foreground hover:text-destructive transition-colors"
          aria-label="할 일 삭제"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {task.tags.length > 0 && (
        <>
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.map((tag) => (
              <Badge key={tag.id}>
                {tag.name}
              </Badge>
            ))}
          </div>
        </>
      )}
    </div>
  );
}