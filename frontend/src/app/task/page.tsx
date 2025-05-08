'use client';

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Ellipsis, Loader2, Plus, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { TaskItem } from "@/components/task/task-item";
import { TaskDetailPanel } from "@/components/task/task-detail-panel";
import { useTasksQuery } from "@/hooks/use-task-query";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const { data: tasks, isLoading, error } = useTasksQuery();

  // 할 일 선택 핸들러
  const handleTaskSelect = (taskId: number) => {
    setSelectedTaskId(taskId);
  };

  // 할 일 선택 해제 핸들러
  const handleClosePanel = () => {
    setSelectedTaskId(null);
  };

  // 검색 필터링
  const filteredTasks = tasks?.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* 헤더 - 고정 높이 */}
      <div className="flex-shrink-0">
        <AppHeader />
      </div>
      
      {/* 메인 컨텐츠 - 남은 높이 모두 차지 */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full"
        >
          <ResizablePanel defaultSize={40} minSize={25} className="min-w-[200px]">
            <div className="flex flex-col h-full">
              {/* 검색바 - 고정 높이 */}
              <div className="h-15 flex-shrink-0 p-4 flex items-center gap-2">
                <Input 
                  type="text" 
                  placeholder="검색" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
              {/* 태스크 목록 - 스크롤 가능 */}
              <ScrollArea className="flex-1 min-h-0 w-full">
                <div className="pl-4 pr-4 pb-8">
                  {isLoading && (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2">할 일 목록을 불러오는 중...</span>
                    </div>
                  )}
                  
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-500 mb-4">{(error as Error).message}</p>
                    </div>
                  )}
                  
                  {!isLoading && !error && filteredTasks?.length === 0 && (
                    <div className="p-8 text-center border rounded-md bg-muted/20">
                      <p className="text-muted-foreground mb-4">
                        {searchTerm ? "검색 결과가 없습니다." : "할 일이 없습니다. 새로운 할 일을 추가해보세요!"}
                      </p>
                    </div>
                  )}
                  
                  {filteredTasks?.map((task) => (
                    <div key={task.id} 
                      onClick={() => handleTaskSelect(task.id)}
                      className={`cursor-pointer hover:bg-accent/50 rounded-md transition-colors ${selectedTaskId === task.id ? 'bg-accent' : ''}`}
                    >
                      <TaskItem
                        task={task}
                        onComplete={() => {}}
                        onDelete={() => {}}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={60}>
            <div className="h-full p-4 overflow-auto">
              {selectedTaskId ? (
                <TaskDetailPanel 
                  taskId={selectedTaskId} 
                  onClose={handleClosePanel}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <div className="flex flex-col items-center text-center p-8 max-w-md">
                    <div className="bg-muted rounded-full p-3 mb-4">
                      <SlidersHorizontal className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">할 일 세부 정보</h3>
                    <p className="text-muted-foreground">
                      왼쪽에서 할 일을 선택하면 자세한 내용이 여기에 표시됩니다.
                    </p>
                  </div>
                </div>
              )}
                  </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
