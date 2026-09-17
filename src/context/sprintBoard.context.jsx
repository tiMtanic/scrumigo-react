import React, { createContext, useContext, useEffect, useState } from "react";
import {
  deleteTaskAsync,
  getSprintsAsync,
  getUserStoryAsync,
  updateTaskAsync,
} from "../services/scrumigoApi.service";

const SprintBoardContext = createContext(null);

export function SprintBoardProvider({ children }) {
  const [sprint, setSprint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    loadSprint();
  }, []);

  useEffect(() => {
    let socket;
    let reconnectTimeout;
    let reconnectDelay = 1000;
    let isStopped = false;
    let hasConnected = false;

    const connectWebSocket = () => {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        return;
      }

      socket = new WebSocket(import.meta.env.VITE_WS_URL, [
        "scrumigo",
        `jwt.${authToken}`,
      ]);

      socket.addEventListener("open", () => {
        reconnectDelay = 1000;

        if (hasConnected) {
          loadSprint(false);
        }

        hasConnected = true;
      });

      socket.addEventListener("message", (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === "task.created") {
            handleTaskCreatedEvent(message.payload.task);
          }

          if (message.type === "task.updated") {
            handleTaskUpdatedEvent(message.payload.task);
          }

          if (message.type === "task.deleted") {
            handleTaskDeletedEvent(message.payload);
          }
        } catch (error) {
          console.log("Could not process WebSocket message:", error);
        }
      });

      socket.addEventListener("close", () => {
        if (isStopped) {
          return;
        }

        reconnectTimeout = setTimeout(() => {
          connectWebSocket();
        }, reconnectDelay);

        reconnectDelay = Math.min(reconnectDelay * 2, 10000);
      });

      socket.addEventListener("error", (error) => {
        console.log("WebSocket error:", error);
      });
    };

    connectWebSocket();

    return () => {
      isStopped = true;
      clearTimeout(reconnectTimeout);
      socket?.close();
    };
  }, []);

  const loadSprint = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }

    setErrorMessage(null);

    try {
      const sprints = await getSprintsAsync(true);
      const activeSprint = sprints.find((sprint) => sprint.status === "active");

      if (!activeSprint) {
        setSprint(null);
        return;
      }

      const userStories = await Promise.all(
        (activeSprint.userStories ?? []).map((story) =>
          getUserStoryAsync(story._id, false, true),
        ),
      );

      setSprint({
        ...activeSprint,
        userStories,
      });
    } catch (error) {
      console.log(error);
      setErrorMessage("Could not load the sprint board.");
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  const handleTaskCreatedEvent = (task) => {
    const userStoryId =
      typeof task.userStoryId === "object"
        ? task.userStoryId._id
        : task.userStoryId;

    setSprint((currentSprint) => {
      if (!currentSprint) {
        return currentSprint;
      }

      return {
        ...currentSprint,
        userStories: currentSprint.userStories.map((userStory) => {
          if (String(userStory._id) !== String(userStoryId)) {
            return userStory;
          }

          const taskExists = (userStory.tasks ?? []).some(
            (currentTask) => String(currentTask._id) === String(task._id),
          );

          if (taskExists) {
            return userStory;
          }

          return {
            ...userStory,
            tasks: [...(userStory.tasks ?? []), task],
          };
        }),
      };
    });
  };

  const handleTaskUpdatedEvent = (task) => {
    setSprint((currentSprint) => {
      if (!currentSprint) {
        return currentSprint;
      }

      return {
        ...currentSprint,
        userStories: currentSprint.userStories.map((userStory) => ({
          ...userStory,
          tasks: (userStory.tasks ?? []).map((currentTask) =>
            String(currentTask._id) === String(task._id) ? task : currentTask,
          ),
        })),
      };
    });
  };

  const handleTaskDeletedEvent = ({ taskId, userStoryId }) => {
    setSprint((currentSprint) => {
      if (!currentSprint) {
        return currentSprint;
      }

      return {
        ...currentSprint,
        userStories: currentSprint.userStories.map((userStory) => {
          if (String(userStory._id) !== String(userStoryId)) {
            return userStory;
          }

          return {
            ...userStory,
            tasks: (userStory.tasks ?? []).filter(
              (task) => String(task._id) !== String(taskId),
            ),
          };
        }),
      };
    });
  };

  const handleUpdateTask = async (taskId, taskData) => {
    await updateTaskAsync(taskId, taskData);
    await loadSprint(false);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTaskAsync(taskId);
    await loadSprint(false);
  };

  const handleTaskStatusChange = async (task, status) => {
    if (task.status === status) return;

    const previousSprintObject = sprint;

    setSprint((currentSprint) => ({
      ...currentSprint,
      userStories: currentSprint.userStories.map((userStory) => ({
        ...userStory,
        tasks: (userStory.tasks ?? []).map((currentTask) =>
          currentTask._id === task._id
            ? {
                ...currentTask,
                status,
              }
            : currentTask,
        ),
      })),
    }));

    const assigneeId =
      task.assigneeId && typeof task.assigneeId === "object"
        ? task.assigneeId._id
        : (task.assigneeId ?? null);

    try {
      await updateTaskAsync(task._id, {
        title: task.title,
        description: task.description,
        status,
        assigneeId,
      });

      await loadSprint(false);
    } catch (error) {
      console.log(error);
      setSprint(previousSprintObject);
      setErrorMessage(
        error.response?.data?.errorMessage ?? "Could not update task status.",
      );
    }
  };

  const getTasksByStatus = (userStory, status) => {
    return (userStory.tasks ?? []).filter((task) => task.status === status);
  };

  const countTasksByStatus = (userStories, status) => {
    return userStories.reduce(
      (total, story) => total + getTasksByStatus(story, status).length,
      0,
    );
  };

  return (
    <SprintBoardContext.Provider
      value={{
        sprint,
        setSprint,
        isLoading,
        errorMessage,
        loadSprint,
        handleUpdateTask,
        handleDeleteTask,
        handleTaskStatusChange,
        getTasksByStatus,
        countTasksByStatus,
      }}
    >
      {children}
    </SprintBoardContext.Provider>
  );
}

export { SprintBoardContext };
