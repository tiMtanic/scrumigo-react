import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Chip,
  Separator,
  Spinner,
  Typography,
} from "@heroui/react";
import {
  CircleDot,
  Edit2Icon,
  ListTodo,
  Plus,
  Timer,
  Trash,
  ArrowLeft,
  AlignLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createTaskAsync,
  deleteTaskAsync,
  deleteUserStoryAsync,
  getUserStoryAsync,
  updateTaskAsync,
} from "../services/scrumigoApi.service";
import DeleteUserStoryModal from "../components/DeleteUserStoryModal";
import InfoCard from "../components/InfoCard";
import TaskForm from "../components/TaskForm";
import TaskRow from "../components/TaskRow";

function UserStoryDetailsPage() {
  const { userStoryId } = useParams();
  const navigate = useNavigate();
  const [userStory, setUserStory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    loadUserStory();
  }, [userStoryId]);

  const loadUserStory = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await getUserStoryAsync(userStoryId, true, true);
      setUserStory(result);
    } catch (error) {
      console.log(error);
      setErrorMessage("Could not load user story.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    await createTaskAsync(userStoryId, taskData);
    setIsAddingTask(false);
    await loadUserStory();
  };

  const handleUpdateTask = async (taskId, taskData) => {
    await updateTaskAsync(taskId, taskData);
    setEditingTaskId(null);
    await loadUserStory();
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTaskAsync(taskId);
      await loadUserStory();
    } catch (error) {
      console.log(error);
      setErrorMessage("Could not delete task.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "default";
      case "planned":
        return "accent";
      case "in_progress":
        return "warning";
      case "done":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "planned":
        return "Planned";
      case "in_progress":
        return "In Progress";
      case "done":
        return "Done";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (errorMessage && !userStory) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-4">
        <p className="text-danger">{errorMessage}</p>
        <Button variant="secondary" onPress={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full">
      <div className="mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <Button
              isIconOnly
              variant="ghost"
              aria-label="Go back"
              onPress={() => navigate(-1)}
            >
              <ArrowLeft className="size-5" />
            </Button>
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-muted">
                  US-{userStory.userStoryNumber}
                </span>
                <Chip
                  size="sm"
                  variant="soft"
                  color={getStatusColor(userStory.status)}
                  className="px-2"
                >
                  {getStatusLabel(userStory.status)}
                </Chip>
              </div>
              <Typography type="h2">{userStory.title}</Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <InfoCard
          icon={Timer}
          label="Sprint"
          value={
            userStory.sprintId
              ? `Sprint-${userStory.sprintId.sprintNumber}`
              : "Unassigned"
          }
          description={userStory.sprintId?.name}
        />
        <InfoCard
          icon={CircleDot}
          label="Story Points"
          value={userStory.storyPoints ?? "-"}
        />
        <InfoCard
          icon={ListTodo}
          label="Tasks"
          value={userStory.tasks?.length ?? 0}
        />
      </div>
      <Card className="mb-6">
        <Card.Header>
          <div className="flex items-center gap-2">
            <AlignLeft className="size-5 text-muted" />
            <Card.Title>Description</Card.Title>
          </div>
        </Card.Header>
        <Card.Content>
          <p className="whitespace-pre-line leading-relaxed text-muted">
            {userStory.description || "No description has been defined."}
          </p>
        </Card.Content>
      </Card>
      <Card>
        <Card.Header className="flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ListTodo className="size-5 text-muted" />
            <div>
              <Card.Title>Tasks</Card.Title>
              <Card.Description>
                Tasks belonging to this User Story.
              </Card.Description>
            </div>
          </div>
          {!isAddingTask && (
            <Button
              size="sm"
              variant="primary"
              onPress={() => {
                setEditingTaskId(null);
                setIsAddingTask(true);
              }}
            >
              <Plus className="size-4" />
              Add Task
            </Button>
          )}
        </Card.Header>
        <Separator />
        <Card.Content className="p-0">
          {isAddingTask && (
            <>
              <div className="p-4 md:p-5">
                <TaskForm
                  title="Add Task"
                  submitLabel="Add Task"
                  onSubmit={handleCreateTask}
                  onCancel={() => setIsAddingTask(false)}
                />
              </div>
              <Separator />
            </>
          )}

          {!userStory.tasks?.length && !isAddingTask ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <ListTodo className="mb-3 size-8 text-muted" />
              <p className="font-medium">No tasks yet</p>
              <p className="mt-1 text-sm text-muted">
                Add the first task for this user story.
              </p>
              <Button
                className="mt-4"
                variant="secondary"
                onPress={() => setIsAddingTask(true)}
              >
                <Plus className="size-4" />
                Add Task
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-separator">
              {userStory.tasks?.map((task) => (
                <div key={task._id}>
                  {editingTaskId === task._id ? (
                    <div className="p-4 md:p-5">
                      <TaskForm
                        title={`Edit T-${task.taskNumber}`}
                        submitLabel="Save Changes"
                        task={task}
                        onSubmit={(taskData) =>
                          handleUpdateTask(task._id, taskData)
                        }
                        onCancel={() => setEditingTaskId(null)}
                      />
                    </div>
                  ) : (
                    <TaskRow
                      task={task}
                      onEdit={() => {
                        setIsAddingTask(false);
                        setEditingTaskId(task._id);
                      }}
                      onDelete={() => handleDeleteTask(task._id)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </Card.Content>
      </Card>

      {errorMessage && (
        <div className="mt-4 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {errorMessage}
        </div>
      )}

      <div className="flex items-center gap-4 justify-self-end mt-4">
        <DeleteUserStoryModal
          userStory={userStory}
          trigger={
            <Button className="px-8" variant="danger-soft">
              <Trash />
              Delete Story
            </Button>
          }
          onDelete={async (userStoryId) => {
            await deleteUserStoryAsync(userStoryId);
            navigate("/userStories");
          }}
        />
        <Button
          className="px-8"
          variant="primary"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/userStories/${userStoryId}/edit`);
          }}
        >
          <Edit2Icon />
          Edit Story
        </Button>
      </div>
    </div>
  );
}

export default UserStoryDetailsPage;
