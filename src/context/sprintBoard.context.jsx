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
