import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  Spinner,
  TextArea,
  TextField,
  Typography,
} from "@heroui/react";
import { BookOpenText, Layers3, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createUserStoryAsync,
  getSprintsAsync,
  getUserStoryAsync,
  updateUserStoryAsync,
} from "../services/scrumigoApi.service";
import SprintPreview from "../components/SprintPreview";

function AddEditUserStoryPage({ mode }) {
  const { userStoryId } = useParams();
  const navigate = useNavigate();
  const isEditMode = mode === "edit";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [storyPoints, setStoryPoints] = useState("");
  const [sprintId, setSprintId] = useState(null);
  const [userStoryNumber, setUserStoryNumber] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    loadPage();
  }, [mode, userStoryId]);

  const loadPage = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const sprintResult = await getSprintsAsync();
      setSprints(sprintResult);

      if (isEditMode) {
        const userStory = await getUserStoryAsync(userStoryId);
        setUserStoryNumber(userStory.userStoryNumber);
        setTitle(userStory.title ?? "");
        setDescription(userStory.description ?? "");
        setStatus(userStory.status ?? "draft");
        setStoryPoints(
          userStory.storyPoints != null ? String(userStory.storyPoints) : "",
        );
        setSprintId(userStory.sprintId?._id ?? userStory.sprintId ?? null);
      }
    } catch (error) {
      setErrorMessage(
        isEditMode
          ? "Could not load user story."
          : "Could not load user story data.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    const userStoryData = {
      title: title.trim(),
      description: description.trim(),
      status,
      storyPoints: storyPoints === "" ? null : Number(storyPoints),
      sprintId: sprintId || null,
    };

    try {
      if (isEditMode) {
        await updateUserStoryAsync(userStoryId, userStoryData);
        navigate(`/userStories/${userStoryId}`);
      } else {
        const result = await createUserStoryAsync(userStoryData);
        navigate(`/userStories/${result._id}`);
      }
    } catch (error) {
      console.log(error);

      setErrorMessage(
        error.response?.data?.errorMessage ??
          `Could not ${isEditMode ? "update" : "create"} user story.`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <div>
          {isEditMode && (
            <p className="mb-1 text-sm font-medium text-muted">
              US-{userStoryNumber}
            </p>
          )}
          <Typography type="h2">
            {isEditMode ? "Edit User Story" : "Create User Story"}
          </Typography>
          <p className="mt-1 text-sm text-muted">
            {isEditMode
              ? "Update the user story details and sprint assignment."
              : "Create a new user story and optionally assign it to a sprint."}
          </p>
        </div>
      </div>

      <Form onSubmit={onSubmit}>
        <div className="flex w-full flex-col gap-6">
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <BookOpenText className="size-5 text-muted" />
                <div>
                  <Card.Title>User Story Details</Card.Title>
                  <Card.Description>
                    Define the story and its estimated complexity.
                  </Card.Description>
                </div>
              </div>
            </Card.Header>

            <Card.Content>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <TextField isRequired className="md:col-span-2">
                  <Label>Title</Label>
                  <Input
                    value={title}
                    variant="secondary"
                    placeholder="As a user, I want to..."
                    maxLength={200}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </TextField>

                <TextField>
                  <Label>Story Points</Label>
                  <Input
                    type="number"
                    min="0"
                    value={storyPoints}
                    variant="secondary"
                    placeholder="e.g. 5"
                    onChange={(e) => setStoryPoints(e.target.value)}
                  />
                </TextField>

                <Select
                  value={status}
                  variant="secondary"
                  onChange={(value) => setStatus(String(value))}
                  className="w-full"
                >
                  <Label>Status</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="draft" textValue="Draft">
                        Draft
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="planned" textValue="Planned">
                        Planned
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="in_progress" textValue="In Progress">
                        In Progress
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="done" textValue="Done">
                        Done
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>

                <Select
                  value={sprintId}
                  variant="secondary"
                  onChange={(value) =>
                    setSprintId(value ? String(value) : null)
                  }
                  placeholder="Unassigned"
                  className="w-full md:col-span-2"
                >
                  <Label>Sprint</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.ClearButton />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {sprints.map((sprint) => (
                        <ListBox.Item
                          key={sprint._id}
                          id={sprint._id}
                          textValue={`Sprint-${sprint.sprintNumber} ${sprint.name}`}
                        >
                          <div>
                            <span className="text-xs text-muted">
                              S-{sprint.sprintNumber}: {sprint.name}
                            </span>
                          </div>
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <TextField className="md:col-span-2">
                  <Label>Description</Label>
                  <TextArea
                    value={description}
                    variant="secondary"
                    rows={6}
                    maxLength={5000}
                    placeholder="Describe what the user needs and why..."
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </TextField>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <Layers3 className="size-5 text-muted" />
                <div>
                  <Card.Title>Sprint Assignment</Card.Title>
                  <Card.Description>
                    Additional information about the Sprint.
                  </Card.Description>
                </div>
              </div>
            </Card.Header>
            <Card.Content>
              {sprintId ? (
                <SprintPreview
                  sprint={sprints.find((sprint) => sprint._id === sprintId)}
                />
              ) : (
                <div className="rounded-xl border border-dashed border-separator px-4 py-8 text-center">
                  <Layers3 className="mx-auto mb-2 size-6 text-muted" />
                  <p className="text-sm font-medium">No sprint assigned</p>
                  <p className="mt-1 text-xs text-muted">
                    This user story will remain in the backlog until it is
                    assigned to a sprint.
                  </p>
                </div>
              )}
            </Card.Content>
          </Card>

          {errorMessage && (
            <div className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pb-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              className="sm:px-8"
              isDisabled={isSaving}
              onPress={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="sm:px-8"
              isDisabled={isSaving}
            >
              {isSaving ? <Spinner size="sm" /> : <Save className="size-4" />}
              {isSaving
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Create User Story"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default AddEditUserStoryPage;
