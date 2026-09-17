import React from "react";
import TaskBoardCard from "./TaskBoardCard";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function DraggableTask({ task, storyId, onUpdateTask, onDeleteTask }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task._id,
      data: {
        task,
        storyId,
      },
    });

  const dragStyle = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.6 : undefined,
    touchAction: "none",
  };

  return (
    <TaskBoardCard
      task={task}
      onUpdateTask={onUpdateTask}
      onDeleteTask={onDeleteTask}
      dragRef={setNodeRef}
      dragListeners={listeners}
      dragAttributes={attributes}
      dragStyle={dragStyle}
      isDragging={isDragging}
    />
  );
}

export default DraggableTask;
