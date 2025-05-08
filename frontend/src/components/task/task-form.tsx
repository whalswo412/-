import React, { useState } from 'react';

interface TaskFormProps {
  onSave: (data: { title: string; description?: string; priority?: string; status?: string }) => void;
  onCancel?: () => void;
  initialData?: { title: string; description?: string; priority?: string; status?: string };
}

export function TaskForm({ onSave, onCancel, initialData }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState(initialData?.priority || 'medium');
  const [status, setStatus] = useState(initialData?.status || 'pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, priority, status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium mb-1">제목</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">설명</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">우선순위</label>
          <select
            className="border rounded px-2 py-1"
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            <option value="high">높음</option>
            <option value="medium">중간</option>
            <option value="low">낮음</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">상태</label>
          <select
            className="border rounded px-2 py-1"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="pending">대기</option>
            <option value="completed">완료</option>
            <option value="overdue">기한초과</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={onCancel}>
            취소
          </button>
        )}
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
          저장
        </button>
      </div>
    </form>
  );
} 