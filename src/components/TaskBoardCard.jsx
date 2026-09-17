import React from "react";
import { User } from "lucide-react";
import TaskModal from "./TaskModal";

function TaskBoardCard({
  task,
  onUpdateTask,
  onDeleteTask,
  dragRef,
  dragListeners,
  dragAttributes,
  dragStyle,
  isDragging,
}) {
  const getAssigneeName = (task) => {
    console.log(task);
    if (!task.assigneeId) {
      return "Unassigned";
    }

    const name =
      `${task.assigneeId.name ?? ""} ${task.assigneeId.surname ?? ""}`.trim();

    return name || "Unassigned";
  };

  const getTaskStatusClasses = (status) => {
    switch (status) {
      case "todo":
        return "border-default/30 bg-default/10";
      case "in_progress":
        return "border-accent/30 bg-accent/10";
      case "done":
        return "border-success/30 bg-success/10";
      default:
        return "border-separator";
    }
  };

  const assignee = getAssigneeName(task);

  return (
    <TaskModal
      task={task}
      onUpdate={onUpdateTask}
      onDelete={onDeleteTask}
      dragRef={dragRef}
      dragListeners={dragListeners}
      dragAttributes={dragAttributes}
      dragStyle={dragStyle}
      isDragging={isDragging}
      triggerClassName={`h-auto w-full justify-start rounded-xl border p-0 text-left ${getTaskStatusClasses(task.status)}`}
      trigger={
        <div className="w-full p-3 text-left">
          <span className="text-xs font-medium text-muted">
            T-{task.taskNumber}
          </span>
          <p className="mt-1 text-sm font-medium">{task.title}</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
            <User className="size-3.5 shrink-0" />
            <span className="truncate">{assignee}</span>
          </div>
        </div>
      }
    />
  );
}

export default TaskBoardCard;
