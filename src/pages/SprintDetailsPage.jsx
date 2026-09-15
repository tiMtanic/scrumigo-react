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
  ArrowLeft,
  CalendarDays,
  Clock3,
  Edit2Icon,
  Layers3,
  NotebookText,
  Target,
  Trash,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSprintAsync,
  deleteSprintAsync,
} from "../services/scrumigoApi.service";
import InfoCard from "../components/InfoCard";
import UserStoryRow from "../components/UserStoryRow";
import DeleteSprintModal from "../components/DeleteSprintModal";

function SprintDetailsPage() {
  const { sprintId } = useParams();
  const navigate = useNavigate();
  const [sprint, setSprint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    loadSprint();
  }, [sprintId]);

  const loadSprint = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await getSprintAsync(sprintId);
      setSprint(result);
    } catch (error) {
      console.log(error);
      setErrorMessage("Could not load sprint.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "warning";
      case "planned":
        return "accent";
      case "active":
        return "success";
      case "completed":
        return "default";
      default:
        return "default";
    }
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
      <div className="flex min-h-64 flex-col items-center justify-center gap-4">
        <p className="text-danger">{errorMessage}</p>
        <Button variant="secondary" onPress={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full">
        {/* Sprint header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted">
                Sprint-{sprint.sprintNumber}
              </span>
              <Chip
                color={getStatusColor(sprint.status)}
                className="px-2"
                variant="soft"
                size="sm"
              >
                {sprint.status}
              </Chip>
            </div>
            <Typography type="h2">{sprint.name}</Typography>
          </div>
        </div>

        {/* Overview */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <InfoCard
            icon={CalendarDays}
            label="Start date"
            value={formatDate(sprint.startDate)}
          />
          <InfoCard
            icon={CalendarDays}
            label="End date"
            value={formatDate(sprint.endDate)}
          />
          <InfoCard
            icon={Layers3}
            label="User stories"
            value={sprint.userStories?.length ?? 0}
          />
        </div>

        {/* Sprint goal */}
        <Card className="mb-6">
          <Card.Header>
            <div className="flex items-center gap-2">
              <Target className="size-5 text-muted" />

              <Card.Title>Sprint Goal</Card.Title>
            </div>
          </Card.Header>
          <Card.Content>
            <p className="whitespace-pre-line leading-relaxed text-muted">
              {sprint.goal || "No sprint goal has been defined."}
            </p>
          </Card.Content>
        </Card>

        {/* User stories */}
        <Card>
          <Card.Header className="flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <NotebookText className="size-5 text-muted" />
                <Card.Title>User Stories</Card.Title>
              </div>
              <Card.Description className="mt-1">
                Stories assigned to this sprint
              </Card.Description>
            </div>
          </Card.Header>
          <Separator />
          <Card.Content className="p-0">
            {!sprint.userStories?.length ? (
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                <NotebookText className="mb-3 size-8 text-muted" />
                <p className="font-medium">No user stories</p>
                <p className="mt-1 text-sm text-muted">
                  This sprint does not contain any user stories yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-separator">
                {sprint.userStories.map((story) => (
                  <UserStoryRow key={story._id} story={story} />
                ))}
              </div>
            )}
          </Card.Content>
        </Card>
        <div className="flex items-center gap-4 justify-self-end mt-4">
          <DeleteSprintModal
            sprint={sprint}
            trigger={
              <Button className="px-8" variant="danger-soft">
                <Trash />
                Delete Sprint
              </Button>
            }
            onDelete={async (sprintId) => {
              await deleteSprintAsync(sprintId);
              navigate("/sprints");
            }}
          />
          <Button
            className="px-8"
            variant="primary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/sprints/${sprint._id}/edit`);
            }}
          >
            <Edit2Icon />
            Edit Sprint
          </Button>
        </div>
      </div>
    </>
  );
}

export default SprintDetailsPage;
