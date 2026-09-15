import { Button, Table } from "@heroui/react";
import React, { useEffect, useState } from "react";
import {
  deleteSprintAsync,
  getSprintsAsync,
} from "../services/scrumigoApi.service";
import { Edit2Icon, Plus, Trash } from "lucide-react";
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
    try {
      const result = await getSprintsAsync(true);
      console.log(result);
      setSprints(result);
    } catch (error) {
      // TODO: error handling
      console.log(error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Team members"
              className="min-w-150"
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
              <Table.Body>
                {sprints.map((sprint) => (
                  <Table.Row
                    id={sprint._id}
                    key={sprint._id}
                    className="cursor-pointer hover:bg-default-100"
                  >
                    <Table.Cell>S-{sprint.sprintNumber}</Table.Cell>
                    <Table.Cell>{sprint.name}</Table.Cell>
                    <Table.Cell>{formatDate(sprint.startDate)}</Table.Cell>
                    <Table.Cell>{formatDate(sprint.endDate)}</Table.Cell>
                    <Table.Cell>{sprint.userStories.length}</Table.Cell>
                    <Table.Cell>{sprint.status}</Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-1">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="tertiary"
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
                              current.filter(
                                (sprint) => sprint._id !== sprintId,
                              ),
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
    </>
  );
}

export default SprintsPage;
