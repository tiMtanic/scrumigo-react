import { Chip } from "@heroui/react";
import React from "react";
import TaskBoardCard from "./TaskBoardCard";

function MobileTaskPanel({
  userStories,
  status,
  countTasksByStatus,
  getTasksByStatus,
  onStoryClick,
  onUpdateTask,
  onDeleteTask,
}) {
  const Icon = status.icon;
  const taskCount = countTasksByStatus(userStories, status.id);

  return (
    <div className="pt-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="size-5 text-muted" />
          <span className="font-semibold">{status.label}</span>
        </div>
        <Chip size="sm" variant="soft" color={status.color} className="px-2">
          {taskCount}
        </Chip>
      </div>
      <div className="flex flex-col gap-5">
        {userStories.map((story) => {
          const tasks = getTasksByStatus(story, status.id);
          return (
            <section key={story._id}>
              <button
                type="button"
                className="sticky top-16 z-10 flex w-full items-center justify-between gap-3 rounded-xl border border-separator bg-background/95 px-3 py-2 text-left backdrop-blur transition-colors hover:bg-default/30"
                onClick={() => onStoryClick(story._id)}
              >
                <div className="min-w-0">
                  <span className="text-xs text-muted">
                    US-{story.userStoryNumber}
                  </span>
                  <p className="truncate text-sm font-medium">{story.title}</p>
                </div>
                <Chip size="sm" variant="soft" className="shrink-0 px-2">
                  {tasks.length}
                </Chip>
              </button>
              <div className="mt-2 flex flex-col gap-2">
                {tasks.length ? (
                  tasks.map((task) => (
                    <TaskBoardCard
                      key={task._id}
                      task={task}
                      onUpdateTask={onUpdateTask}
                      onDeleteTask={onDeleteTask}
                    />
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-separator px-4 py-6 text-center">
                    <span className="text-xs text-muted">
                      No {status.label.toLowerCase()} tasks
                    </span>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default MobileTaskPanel;
