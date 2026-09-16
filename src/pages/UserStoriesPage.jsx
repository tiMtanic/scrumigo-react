import { Button, Chip, EmptyState, Table } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { Edit2Icon, Inbox, Plus, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  deleteUserStoryAsync,
  getUserStoriesAsync,
} from "../services/scrumigoApi.service";
import DeleteUserStoryModal from "../components/DeleteUserStoryModal";

function UserStoriesPage() {
  const [userStories, setUserStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserStories();
  }, []);

  const loadUserStories = async () => {
    setIsLoading(true);

    try {
      const result = await getUserStoriesAsync(true);
      setUserStories(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="flex flex-col gap-2">
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="User stories"
            className="h-full min-w-180"
            onRowAction={(id) => navigate(`/userStories/${id}`)}
          >
            <Table.Header>
              <Table.Column>ID</Table.Column>
              <Table.Column isRowHeader>Title</Table.Column>
              <Table.Column>Sprint</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column>Story Points</Table.Column>
              <Table.Column>Actions</Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                  <Inbox className="size-6 text-muted" />
                  <span className="text-sm text-muted">
                    No user stories found
                  </span>
                </EmptyState>
              )}
            >
              {userStories.map((userStory) => (
                <Table.Row
                  id={userStory._id}
                  key={userStory._id}
                  className="cursor-pointer hover:bg-default-100"
                >
                  <Table.Cell>US-{userStory.userStoryNumber}</Table.Cell>
                  <Table.Cell>
                    <div className="flex max-w-100 flex-col">
                      <span className="font-medium">{userStory.title}</span>
                      {userStory.description && (
                        <span className="truncate text-xs text-muted">
                          {userStory.description}
                        </span>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {userStory.sprintId ? (
                      <div className="flex flex-col">
                        <span className="font-medium">
                          Sprint-{userStory.sprintId.sprintNumber}
                        </span>
                        <span className="text-xs text-muted">
                          {userStory.sprintId.name}
                        </span>
                      </div>
                    ) : (
                      <Chip size="sm" variant="soft" color="default">
                        Unassigned
                      </Chip>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Chip
                      size="sm"
                      variant="soft"
                      color={getStatusColor(userStory.status)}
                      className="px-3"
                    >
                      {getStatusLabel(userStory.status)}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    {userStory.storyPoints != null ? (
                      <Chip
                        size="sm"
                        variant="soft"
                        color="accent"
                        className="px-3"
                      >
                        {userStory.storyPoints} pts
                      </Chip>
                    ) : (
                      "-"
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-1">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="tertiary"
                        aria-label="Edit user story"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/userStories/${userStory._id}/edit`);
                        }}
                      >
                        <Edit2Icon />
                      </Button>
                      <DeleteUserStoryModal
                        userStory={userStory}
                        trigger={
                          <Button
                            isIconOnly
                            size="sm"
                            variant="danger-soft"
                            aria-label="Delete user story"
                          >
                            <Trash />
                          </Button>
                        }
                        onDelete={async (userStoryId) => {
                          await deleteUserStoryAsync(userStoryId);
                          setUserStories((current) =>
                            current.filter((item) => item._id !== userStoryId),
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
        onClick={() => navigate("/userStories/add")}
      >
        <Plus />
        Add User Story
      </Button>
    </div>
  );
}

export default UserStoriesPage;
