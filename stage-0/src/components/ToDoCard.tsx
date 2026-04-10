"use client";

import { useState, useMemo } from "react";
import { Trash2, Edit2 } from "lucide-react";

/**
 * Priority type for todo items
 */
type Priority = "Low" | "Medium" | "High";

/**
 * Status type for todo items
 */
type Status = "Pending" | "In Progress" | "Done";

/**
 * Props for the TodoCard component
 */
interface TodoCardProps {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: Date;
  status: Status;
  tags: string[];
  isCompleted?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleComplete?: (completed: boolean) => void;
}

/**
 * Utility function to calculate time remaining from now to a given date
 */
function calculateTimeRemaining(dueDate: Date): string {
  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    const absDiffMins = Math.abs(diffMins);
    const absDiffHours = Math.abs(diffHours);
    const absDiffDays = Math.abs(diffDays);

    if (absDiffDays > 0) {
      return `Overdue by ${absDiffDays} day${absDiffDays !== 1 ? "s" : ""}`;
    } else if (absDiffHours > 0) {
      return `Overdue by ${absDiffHours} hour${absDiffHours !== 1 ? "s" : ""}`;
    } else if (absDiffMins > 0) {
      return `Overdue by ${absDiffMins} minute${absDiffMins !== 1 ? "s" : ""}`;
    }
    return "Overdue";
  }

  if (diffMins === 0) {
    return "Due now!";
  } else if (diffHours === 0) {
    return `Due in ${diffMins} minute${diffMins !== 1 ? "s" : ""}`;
  } else if (diffDays === 0) {
    return `Due in ${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
  } else if (diffDays === 1) {
    return "Due tomorrow";
  }
  return `Due in ${diffDays} days`;
}

/**
 * Get priority color classes
 */
function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 border-red-300";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "Low":
      return "bg-green-100 text-green-800 border-green-300";
  }
}

/**
 * Get status color classes
 */
function getStatusColor(status: Status): string {
  switch (status) {
    case "Done":
      return "text-green-700";
    case "In Progress":
      return "text-blue-700";
    case "Pending":
      return "text-gray-700";
  }
}

/**
 * Format date for display
 */
function formatDueDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

/**
 * TodoCard component - displays a task with title, description, priority, due date, and more
 */
export default function TodoCard({
  id,
  title,
  description,
  priority,
  dueDate,
  status,
  tags,
  isCompleted = false,
  onEdit,
  onDelete,
  onToggleComplete,
}: TodoCardProps) {
  const [completed, setCompleted] = useState(isCompleted);

  // Memoize time remaining calculation to prevent unnecessary recalculations
  const timeRemaining = useMemo(
    () => calculateTimeRemaining(dueDate),
    [dueDate],
  );

  // Format the due date
  const formattedDate = useMemo(
    () => `Due ${formatDueDate(dueDate)}`,
    [dueDate],
  );

  // Determine the current status display
  const displayStatus: Status = completed ? "Done" : status;

  // Handle checkbox toggle
  const handleToggleComplete = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCompleted = e.target.checked;
    setCompleted(newCompleted);
    onToggleComplete?.(newCompleted);
  };

  // Handle edit button
  const handleEdit = () => {
    console.log("Edit todo clicked");
    onEdit?.();
  };

  // Handle delete button
  const handleDelete = () => {
    console.log(`[v0] Delete todo with id: ${id}`);
    onDelete?.();
  };

  return (
    <article
      data-testid="test-todo-card"
      className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Header with checkbox and title */}
      <div className="mb-4 flex items-start gap-3">
        <input
          type="checkbox"
          id={`todo-checkbox-${id}`}
          data-testid="test-todo-complete-toggle"
          checked={completed}
          onChange={handleToggleComplete}
          className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 transition-all hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={`Mark "${title}" as ${completed ? "incomplete" : "complete"}`}
        />
        <div className="flex-1">
          <label
            htmlFor={`todo-checkbox-${id}`}
            data-testid="test-todo-title"
            className={`text-lg font-semibold transition-all cursor-pointer ${
              completed ? "line-through text-gray-500" : "text-gray-900"
            }`}
          >
            <h3>{title}</h3>
          </label>
        </div>
      </div>

      {/* Description */}
      <p
        data-testid="test-todo-description"
        className="mb-4 text-sm text-gray-600 leading-relaxed"
      >
        {description}
      </p>

      {/* Priority and Status badges */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span
          data-testid="test-todo-priority"
          className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${getPriorityColor(priority)}`}
          aria-label={`Priority: ${priority}`}
        >
          {priority}
        </span>
        <span
          data-testid="test-todo-status"
          className={`text-xs font-medium ${getStatusColor(displayStatus)}`}
        >
          {displayStatus}
        </span>
      </div>

      {/* Due date and time remaining */}
      <div className="mb-4 space-y-1 text-xs text-gray-600">
        <time
          data-testid="test-todo-due-date"
          dateTime={dueDate.toISOString()}
          className="block"
        >
          {formattedDate}
        </time>
        <time
          data-testid="test-todo-time-remaining"
          className="block font-medium text-gray-700"
        >
          {timeRemaining}
        </time>
      </div>

      {/* Tags */}
      <ul
        data-testid="test-todo-tags"
        role="list"
        className="mb-5 flex flex-wrap gap-2"
      >
        {tags.map((tag) => (
          <li key={tag}>
            <span
              data-testid={`test-todo-tag-${tag.toLowerCase()}`}
              className="inline-block rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
            >
              #{tag}
            </span>
          </li>
        ))}
      </ul>

      {/* Action buttons */}
      <div className="flex gap-2 pt-4">
        <button
          data-testid="test-todo-edit-button"
          onClick={handleEdit}
          className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={`Edit "${title}"`}
        >
          <Edit2 className="h-4 w-4" />
          Edit
        </button>
        <button
          data-testid="test-todo-delete-button"
          onClick={handleDelete}
          className="flex items-center justify-center gap-2 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-all hover:bg-red-50 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label={`Delete "${title}"`}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </article>
  );
}

/**
 * Example usage of TodoCard component
 */
export function TodoCardExample() {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3); // 3 days from now

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <TodoCard
        id="todo-1"
        title="Complete project documentation"
        description="Write comprehensive documentation for the new API endpoints including examples and error handling."
        priority="High"
        dueDate={dueDate}
        status="In Progress"
        tags={["work", "urgent"]}
        isCompleted={false}
        onEdit={() => alert("Edit button clicked!")}
        onDelete={() => alert("Delete button clicked!")}
        onToggleComplete={(completed) =>
          console.log("Todo completed:", completed)
        }
      />
    </div>
  );
}
