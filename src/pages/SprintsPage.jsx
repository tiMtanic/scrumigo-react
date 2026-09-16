import { Button, Chip, EmptyState, Table } from "@heroui/react";
import React, { useEffect, useState } from "react";
import {
  deleteSprintAsync,
  getSprintsAsync,
} from "../services/scrumigoApi.service";
import { Edit2Icon, Inbox, Plus, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeleteSprintModal from "../components/DeleteSprintModal";

function SprintsPage() {
  const [sprints, setSprints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadSprints();
  }, []);

  const loadSprints = async () => {
    setIsLoading(true);

    try {
      const result = await getSprintsAsync(true);
      setSprints(result);
    } catch (error) {
      // TODO: error handling
      console.log(error);
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

  return (
    <div className="flex flex-col gap-2">
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Sprints"
            className="h-full min-w-180"
            onRowAction={(id) => navigate(`/sprints/${id}`)}
          >
            <Table.Header>
              <Table.Column>ID</Table.Column>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Start</Table.Column>
              <Table.Column>End</Table.Column>
              <Table.Column>Stories</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column>Actions</Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                  <Inbox className="size-6 text-muted" />
                  <span className="text-sm text-muted">No sprints found</span>
                </EmptyState>
              )}
            >
              {sprints.map((sprint) => (
                <Table.Row
                  id={sprint._id}
                  key={sprint._id}
                  className="cursor-pointer hover:bg-default-100"
                >
                  <Table.Cell>S-{sprint.sprintNumber}</Table.Cell>
                  <Table.Cell>
                    <div className="flex max-w-100 flex-col">
                      <span className="font-medium">{sprint.name}</span>

                      {sprint.goal && (
                        <span className="truncate text-xs text-muted">
                          {sprint.goal}
                        </span>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{formatDate(sprint.startDate)}</Table.Cell>
                  <Table.Cell>{formatDate(sprint.endDate)}</Table.Cell>
                  <Table.Cell>
                    <Chip size="sm" variant="soft" className="px-2">
                      {sprint.userStories?.length ?? 0}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    <Chip
                      size="sm"
                      variant="soft"
                      color={getStatusColor(sprint.status)}
                      className="px-2"
                    >
                      {sprint.status}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-1">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="tertiary"
                        aria-label="Edit sprint"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/sprints/${sprint._id}/edit`);
                        }}
                      >
                        <Edit2Icon />
                      </Button>
                      <DeleteSprintModal
                        sprint={sprint}
                        trigger={
                          <Button
                            isIconOnly
                            size="sm"
                            variant="danger-soft"
                            aria-label="Delete sprint"
                          >
                            <Trash />
                          </Button>
                        }
                        onDelete={async (sprintId) => {
                          await deleteSprintAsync(sprintId);
                          setSprints((current) =>
                            current.filter((item) => item._id !== sprintId),
                          );
                        }}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <Button
        variant="primary"
        className="self-end px-8"
        onClick={() => navigate("/sprints/add")}
      >
        <Plus />
        Add Sprint
      </Button>
    </div>
  );
}

export default SprintsPage;
