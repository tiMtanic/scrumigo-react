import { Button } from "@heroui/react";
import { Edit2Icon, Trash2 } from "lucide-react";
import React from "react";
import TaskStatusChip from "./TaskStatusChip";

function TaskRow({ task, onEdit, onDelete }) {
  return (
    <div className="flex flex-col gap-4 p-4 transition-colors hover:bg-default/30 md:flex-row md:items-start md:justify-between md:p-5">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted">
            T-{task.taskNumber}
          </span>
          <h3 className="font-medium">{task.title}</h3>
          <TaskStatusChip status={task.status} />
        </div>
        {task.description && (
          <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-muted">
            {task.description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          isIconOnly
          size="sm"
          variant="tertiary"
          aria-label="Edit task"
          onPress={onEdit}
        >
          <Edit2Icon className="size-4" />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="danger-soft"
          aria-label="Delete task"
          onPress={onDelete}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export default TaskRow;
