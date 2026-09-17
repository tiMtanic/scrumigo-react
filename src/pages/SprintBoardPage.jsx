import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Chip,
  EmptyState,
  Spinner,
  Tabs,
  Typography,
} from "@heroui/react";
import {
  CheckCircle2,
  Circle,
  Inbox,
  Layers3,
  LoaderCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DesktopBoard from "../components/DesktopBoard";
import MobileStoriesPanel from "../components/MobileStoriesPanel";
import MobileTaskPanel from "../components/MobileTaskPanel";
import { SprintBoardContext } from "../context/sprintBoard.context";

const taskStatuses = [
  {
    id: "todo",
    label: "Todo",
    icon: Circle,
    color: "default",
  },
  {
    id: "in_progress",
    label: "In Progress",
    icon: LoaderCircle,
    color: "accent",
  },
  {
    id: "done",
    label: "Done",
    icon: CheckCircle2,
    color: "success",
  },
];

function SprintBoardPage() {
  const navigate = useNavigate();
  const [mobileColumn, setMobileColumn] = useState("stories");
  const {
    sprint,
    isLoading,
    errorMessage,
    loadSprint,
    handleUpdateTask,
    handleDeleteTask,
    handleTaskStatusChange,
    getTasksByStatus,
    countTasksByStatus,
  } = useContext(SprintBoardContext);

  useEffect(() => {
    loadSprint(false);
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  const getRemainingTime = (endDate) => {
    if (!endDate) return null;

    const today = new Date();
    const end = new Date(endDate);

    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const days = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

    if (days > 1) return `${days} days left`;
    if (days === 1) return "1 day left";
    if (days === 0) return "Ends today";

    return "Sprint ended";
  };

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-danger">{errorMessage}</p>
      </div>
    );
  }

  if (!sprint) {
    return (
      <Card className="min-h-64">
        <Card.Content className="flex items-center justify-center">
          <EmptyState className="flex flex-col items-center gap-3 text-center">
            <Inbox className="size-8 text-muted" />
            <div>
              <p className="font-medium">No active sprint</p>
              <p className="mt-1 text-sm text-muted">
                Set a sprint to active to display its board.
              </p>
            </div>
          </EmptyState>
        </Card.Content>
      </Card>
    );
  }

  return (
    <div className="mx-auto w-full">
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted">
            Sprint-{sprint.sprintNumber}
          </span>
          <Chip size="sm" variant="soft" color="success" className="px-2">
            Active
          </Chip>
        </div>
        <Typography type="h2">{sprint.name}</Typography>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
          <span>{formatDate(sprint.startDate)}</span>
          <span>–</span>
          <span>{formatDate(sprint.endDate)}</span>
          {getRemainingTime(sprint.endDate) && (
            <>
              <span>•</span>
              <span className="font-medium">
                {getRemainingTime(sprint.endDate)}
              </span>
            </>
          )}
        </div>
      </div>
      {!sprint.userStories.length ? (
        <Card className="min-h-64">
          <Card.Content className="flex items-center justify-center">
            <EmptyState className="flex flex-col items-center gap-3 text-center">
              <Layers3 className="size-8 text-muted" />
              <div>
                <p className="font-medium">No user stories</p>
                <p className="mt-1 text-sm text-muted">
                  This sprint does not contain any user stories yet.
                </p>
              </div>
            </EmptyState>
          </Card.Content>
        </Card>
      ) : (
        <>
          <DesktopBoard
            userStories={sprint.userStories}
            taskStatuses={taskStatuses}
            onStoryClick={(storyId) => navigate(`/userStories/${storyId}`)}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onTaskStatusChange={handleTaskStatusChange}
            countTasksByStatus={countTasksByStatus}
            getTasksByStatus={getTasksByStatus}
          />
          <div className="md:hidden">
            <Tabs
              selectedKey={mobileColumn}
              onSelectionChange={(key) => setMobileColumn(String(key))}
              variant="secondary"
              className="w-full"
            >
              <Tabs.ListContainer className="overflow-x-auto">
                <Tabs.List
                  aria-label="Sprint board columns"
                  className="w-max min-w-full"
                >
                  <Tabs.Tab id="stories" className="shrink-0 whitespace-nowrap">
                    <span className="whitespace-nowrap">Stories</span>
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  {taskStatuses.map((status) => (
                    <Tabs.Tab
                      key={status.id}
                      id={status.id}
                      className="shrink-0 whitespace-nowrap"
                    >
                      <span className="whitespace-nowrap">{status.label}</span>
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs.ListContainer>
              <Tabs.Panel id="stories">
                <MobileStoriesPanel
                  userStories={sprint.userStories}
                  onStoryClick={(storyId) =>
                    navigate(`/userStories/${storyId}`)
                  }
                />
              </Tabs.Panel>
              {taskStatuses.map((status) => (
                <Tabs.Panel key={status.id} id={status.id}>
                  <MobileTaskPanel
                    userStories={sprint.userStories}
                    status={status}
                    countTasksByStatus={countTasksByStatus}
                    getTasksByStatus={getTasksByStatus}
                    onStoryClick={(storyId) =>
                      navigate(`/userStories/${storyId}`)
                    }
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </Tabs.Panel>
              ))}
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
}

export default SprintBoardPage;
