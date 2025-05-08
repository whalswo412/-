import React from 'react';

interface TaskDetailProps {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TaskDetail({ title, description, status, priority, onEdit, onDelete }: TaskDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {priority && (
          <span className={`text-xs px-2 py-1 rounded ${priority === 'high' ? 'bg-red-100 text-red-600' : priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
            {priority}
          </span>
        )}
      </div>
      {description && <p className="text-gray-700 mb-2">{description}</p>}
      {status && (
        <span className={`text-xs px-2 py-1 rounded ${status === 'completed' ? 'bg-green-100 text-green-700' : status === 'overdue' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
          {status}
        </span>
      )}
      <div className="flex gap-2 mt-4">
        {onEdit && (
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={onEdit}>
            수정
          </button>
        )}
        {onDelete && (
          <button className="px-4 py-2 rounded bg-red-500 text-white" onClick={onDelete}>
            삭제
          </button>
        )}
      </div>
    </div>
  );
} 