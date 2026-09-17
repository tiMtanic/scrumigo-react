import React from "react";
import TaskBoardCard from "./TaskBoardCard";

function TaskCell({ tasks, onUpdateTask, onDeleteTask }) {
  return (
    <div className="min-h-30 rounded-xl bg-default/20 p-2">
      {tasks.length ? (
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskBoardCard
              key={task._id}
              task={task}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-full min-h-26 items-center justify-center">
          <span className="text-xs text-muted">No tasks</span>
        </div>
      )}
    </div>
  );
}

export default TaskCell;
