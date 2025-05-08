// frontend/src/components/task/task.tsx
import { Separator } from "@radix-ui/react-separator";
import { Badge } from "@/components/ui/badge";
import { Task as TaskType } from "@/store/task-store";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

interface TaskProps {
  task: TaskType;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

function Task({ task, onComplete, onDelete }: TaskProps) {
  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 태그 추출 (설명에서 #태그 형식 추출)
  const extractTags = (text: string) => {
    const tagRegex = /#(\w+)/g;
    const tags = [];
    let match;
    
    while ((match = tagRegex.exec(text)) !== null) {
      tags.push(match[1]);
    }
    
    return tags;
  };

  const tags = task.description ? extractTags(task.description) : [];
  
  return (
    <div className="rounded-md border p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div className="space-y-1 flex-1">
          <div className="flex items-center space-x-2">
            <Checkbox 
              checked={task.completed} 
              onCheckedChange={() => onComplete(task.id)}
              className="h-5 w-5"
            />
            <h4 className={`text-sm font-medium leading-none ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h4>
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mt-2 ml-7">
              {task.description}
            </p>
          )}
          
          {task.createdAt && (
            <p className="text-xs text-muted-foreground mt-2 ml-7">
              생성일: {formatDate(task.createdAt)}
            </p>
          )}
        </div>
        
        <button 
          onClick={() => onDelete(task.id)}
          className="text-muted-foreground hover:text-destructive transition-colors"
          aria-label="할 일 삭제"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      {tags.length > 0 && (
        <>
          <Separator className="my-4" />
          <div className="flex h-5 items-center space-x-1 text-sm">
            {tags.map((tag, index) => (
              <Badge key={index}>{tag}</Badge>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Task;