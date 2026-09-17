import React from "react";
import BoardColumnHeader from "./BoardColumnHeader";
import StoryCard from "./StoryCard";
import { Layers3 } from "lucide-react";
import TaskCell from "./TaskCell";

function DesktopBoard({
  userStories,
  taskStatuses,
  onStoryClick,
  onUpdateTask,
  onDeleteTask,
  countTasksByStatus,
  getTasksByStatus,
}) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <div className="min-w-275">
        <div className="mb-3 grid grid-cols-[260px_repeat(3,minmax(260px,1fr))] gap-3">
          <BoardColumnHeader
            icon={Layers3}
            label="User Stories"
            count={userStories.length}
          />
          {taskStatuses.map((status) => (
            <BoardColumnHeader
              key={status.id}
              icon={status.icon}
              label={status.label}
              count={countTasksByStatus(userStories, status.id)}
              color={status.color}
            />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {userStories.map((story) => (
            <div
              key={story._id}
              className="grid grid-cols-[260px_repeat(3,minmax(260px,1fr))] items-stretch gap-3"
            >
              <StoryCard
                story={story}
                onClick={() => onStoryClick(story._id)}
              />
              {taskStatuses.map((status) => (
                <TaskCell
                  key={status.id}
                  tasks={getTasksByStatus(story, status.id)}
                  onUpdateTask={onUpdateTask}
                  onDeleteTask={onDeleteTask}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DesktopBoard;
