import React, { useState } from "react";
import {
  DndContext,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
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
  onTaskStatusChange,
  countTasksByStatus,
  getTasksByStatus,
}) {
  const [activeDrag, setActiveDrag] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const collisionDetection = (args) => {
    const sourceStoryId = args.active.data.current?.storyId;
    const sourceStatus = args.active.data.current?.task?.status;

    const droppableContainers = args.droppableContainers.filter(
      (container) =>
        String(container.data.current?.storyId) === String(sourceStoryId) &&
        container.data.current?.status !== sourceStatus,
    );

    const pointerCollisions = pointerWithin({
      ...args,
      droppableContainers,
    });

    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }

    if (!args.pointerCoordinates) {
      return rectIntersection({
        ...args,
        droppableContainers,
      });
    }

    return [];
  };

  const handleDragStart = ({ active }) => {
    const task = active.data.current?.task;
    const storyId = active.data.current?.storyId;

    if (!task || !storyId) return;

    setActiveDrag({
      taskId: task._id,
      storyId,
      status: task.status,
    });
  };

  const handleDragCancel = () => {
    setActiveDrag(null);
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveDrag(null);

    if (!over) return;

    const task = active.data.current?.task;
    const sourceStoryId = active.data.current?.storyId;
    const targetStoryId = over.data.current?.storyId;
    const targetStatus = over.data.current?.status;

    if (!task || !sourceStoryId || !targetStoryId || !targetStatus) return;
    if (String(sourceStoryId) !== String(targetStoryId)) return;
    if (task.status === targetStatus) return;

    await onTaskStatusChange(task, targetStatus);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
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
                    storyId={story._id}
                    status={status.id}
                    tasks={getTasksByStatus(story, status.id)}
                    activeDrag={activeDrag}
                    onUpdateTask={onUpdateTask}
                    onDeleteTask={onDeleteTask}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
}

export default DesktopBoard;
