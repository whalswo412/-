// frontend/src/components/task/AddTaskSheet.tsx
'use client';

import React, { useState } from "react";
import { useAddTaskMutation } from "@/hooks/use-task-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, XCircleIcon, X } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "../ui/separator";

interface AddTaskSheetProps {
  trigger?: React.ReactNode;
}

export function AddTaskSheet({ trigger }: AddTaskSheetProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const addTaskMutation = useAddTaskMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addTaskMutation.mutateAsync({
        title,
        description: description || undefined,
        priority,
        dueDate: date ? date.toISOString() : null,
      });
      
      // 폼 초기화
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDate(undefined);
    } catch (error) {
      console.error("할 일 추가 실패:", error);
    }
  };

  const priorityColors = {
    high: "text-red-400",
    medium: "text-amber-400",
    low: "text-green-400"
  };

  const priorityLabels = {
    high: "높음",
    medium: "중간",
    low: "낮음"
  };

  // 날짜 초기화 함수
  const resetDate = (e: React.MouseEvent) => {
    e.stopPropagation(); // 버블링 방지
    setDate(undefined);
    setPopoverOpen(false); // 팝오버 닫기
  };

  // trigger가 있을 때만 SheetTrigger를 렌더링
  const sheetContent = (
    <SheetContent className="bg-[oklch(0.98_0_0)] text-[oklch(0.35_0_0)] border-l-[oklch(0.9_0_0)]">
      <form onSubmit={handleSubmit}>
        <SheetHeader className="">
          <SheetTitle className="text-2xl font-semibold pl-1 text-[oklch(0.4_0_0)]">할 일 추가</SheetTitle>
          <SheetDescription className="text-[oklch(0.5_0_0)] text-sm pl-1">
            새로운 할 일을 등록하세요.
          </SheetDescription>
        </SheetHeader>
        
        <div className="pr-4 pl-4">
          <div className="space-y-3 pl-1">
            <Input 
              id="title" 
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border-none text-xl font-medium text-[oklch(0.4_0_0)] placeholder:text-[oklch(0.65_0_0)] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 bg-transparent"
            />
          </div>
          <Separator className="bg-[oklch(0.9_0_0)]" />
          <div className="space-y-3 pl-1">
            <Textarea
              id="description"
              placeholder="자세한 설명을 입력하세요..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-35 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 placeholder:text-[oklch(0.65_0_0)] bg-transparent text-[oklch(0.4_0_0)]"
            />
          </div>
        </div>

        <div className="pr-4 pl-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select 
                value={priority} 
                onValueChange={setPriority}
              >
                <SelectTrigger 
                  className="border-[oklch(0.9_0_0)] bg-[oklch(0.98_0_0)] hover:bg-[oklch(0.93_0_0)] transition-colors text-[oklch(0.4_0_0)] h-10 justify-between"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[oklch(0.5_0_0)]">중요도</span>
                    <span className={cn("font-medium", priorityColors[priority as keyof typeof priorityColors])}>
                      {priorityLabels[priority as keyof typeof priorityLabels]}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent position="popper" className="w-full bg-[oklch(0.98_0_0)] border-[oklch(0.9_0_0)]">
                  <SelectItem value="high" className="text-red-400 font-medium">높음</SelectItem>
                  <SelectItem value="medium" className="text-amber-400 font-medium">중간</SelectItem>
                  <SelectItem value="low" className="text-green-400 font-medium">낮음</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 px-3 bg-[oklch(0.98_0_0)] border-[oklch(0.9_0_0)] hover:bg-[oklch(0.93_0_0)] transition-colors"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4 text-[oklch(0.5_0_0)]" />
                        <span className={date ? "text-[oklch(0.4_0_0)]" : "text-[oklch(0.5_0_0)]"}>
                          {date ? format(date, 'PPP', { locale: ko }) : "마감일"}
                        </span>
                      </div>
                      <button 
                        onClick={resetDate}
                        className="transition-colors focus:outline-none"
                        aria-label="날짜 초기화"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" side="bottom">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="pr-4 pl-4 mt-6">
          <Separator className="bg-[oklch(0.9_0_0)]" />
          <SheetFooter className="pt-6 flex gap-2">
            <SheetClose asChild>
              <Button 
                variant="outline" 
                type="button" 
                className="flex-1 border-[oklch(0.9_0_0)] bg-[oklch(0.98_0_0)] hover:bg-[oklch(0.93_0_0)] text-[oklch(0.4_0_0)]"
              >
                취소
              </Button>
            </SheetClose>
            <Button 
              type="submit" 
              className="flex-1 bg-sidebar-primary hover:bg-sidebar-primary/90 text-white"
              disabled={!title || addTaskMutation.isPending}
            >
              {addTaskMutation.isPending ? "저장 중..." : "저장"}
            </Button>
          </SheetFooter>
        </div>
      </form>
    </SheetContent>
  );

  // trigger가 있는 경우와 없는 경우 각각 다르게 렌더링
  if (trigger) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          {trigger}
        </SheetTrigger>
        {sheetContent}
      </Sheet>
    );
  }
  
  // trigger가 없을 경우 컨텐츠만 반환 (외부에서 Sheet와 SheetTrigger 관리)
  return sheetContent;
}