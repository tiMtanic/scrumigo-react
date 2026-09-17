import React from "react";
import { useDroppable } from "@dnd-kit/core";
import DraggableTask from "./DraggableTask";

function TaskCell({
  storyId,
  status,
  tasks,
  activeDrag,
  onUpdateTask,
  onDeleteTask,
}) {
  const canAccept =
    activeDrag &&
    String(activeDrag.storyId) === String(storyId) &&
    activeDrag.status !== status;

  const { isOver, setNodeRef } = useDroppable({
    id: `lane-${storyId}-${status}`,
    data: {
      storyId,
      status,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-30 rounded-xl p-2 transition-colors ${
        isOver && canAccept
          ? "bg-accent/10 ring-2 ring-accent/40"
          : "bg-default/20"
      }`}
    >
      {tasks.length ? (
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <DraggableTask
              key={task._id}
              task={task}
              storyId={storyId}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-full min-h-26 items-center justify-center">
          <span
            className={`text-xs ${
              isOver && canAccept ? "font-medium text-accent" : "text-muted"
            }`}
          >
            {isOver && canAccept ? "Drop task here" : "No tasks"}
          </span>
        </div>
      )}
    </div>
  );
}

export default TaskCell;
