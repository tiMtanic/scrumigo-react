import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Chip,
  ComboBox,
  DateField,
  DateRangePicker,
  Form,
  Input,
  Label,
  ListBox,
  RangeCalendar,
  Select,
  Spinner,
  TextArea,
  TextField,
  Typography,
} from "@heroui/react";
import { CalendarDays, NotebookText, Save, X } from "lucide-react";
import { parseDate } from "@internationalized/date";
import { useNavigate, useParams } from "react-router-dom";

import {
  createSprintAsync,
  getSprintAsync,
  getUserStoriesAsync,
  updateSprintAsync,
} from "../services/scrumigoApi.service";

function AddEditSprintPage({ mode }) {
  const { sprintId } = useParams();
  const navigate = useNavigate();
  const isEditMode = mode === "edit";
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [status, setStatus] = useState("draft");
  const [dateRange, setDateRange] = useState(null);
  const [allUserStories, setAllUserStories] = useState([]);
  const [selectedUserStories, setSelectedUserStories] = useState([]);
  const [storySearch, setStorySearch] = useState("");
  const [sprintNumber, setSprintNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    loadPage();
  }, [mode, sprintId]);

  const loadPage = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const stories = await getUserStoriesAsync();
      setAllUserStories(stories);

      if (isEditMode) {
        const sprint = await getSprintAsync(sprintId);

        setSprintNumber(sprint.sprintNumber);
        setName(sprint.name ?? "");
        setGoal(sprint.goal ?? "");
        setStatus(sprint.status ?? "draft");
        setSelectedUserStories(sprint.userStories ?? []);

        if (sprint.startDate && sprint.endDate) {
          setDateRange({
            start: parseDate(sprint.startDate.slice(0, 10)),
            end: parseDate(sprint.endDate.slice(0, 10)),
          });
        } else {
          setDateRange(null);
        }
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(
        isEditMode ? "Could not load sprint." : "Could not load sprint data.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUserStories = useMemo(() => {
    const search = storySearch.trim().toLowerCase();

    if (!search) {
      return [];
    }

    const selectedIds = new Set(selectedUserStories.map((story) => story._id));

    return allUserStories.filter((story) => {
      if (selectedIds.has(story._id)) {
        return false;
      }

      const storyNumber = `US-${story.userStoryNumber}`.toLowerCase();
      const title = story.title?.toLowerCase() ?? "";
      const description = story.description?.toLowerCase() ?? "";

      return (
        storyNumber.includes(search) ||
        title.includes(search) ||
        description.includes(search)
      );
    });
  }, [storySearch, allUserStories, selectedUserStories]);

  const addUserStory = (storyId) => {
    if (!storyId) {
      return;
    }

    const story = allUserStories.find((item) => item._id === String(storyId));

    if (!story) {
      return;
    }

    setSelectedUserStories((current) => {
      const alreadyAdded = current.some((item) => item._id === story._id);

      if (alreadyAdded) {
        return current;
      }

      return [...current, story];
    });

    setStorySearch("");
  };

  const removeUserStory = (storyId) => {
    setSelectedUserStories((current) =>
      current.filter((story) => story._id !== storyId),
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setIsSaving(true);
    setErrorMessage(null);

    const sprintData = {
      name: name.trim(),
      goal: goal.trim(),
      status,

      startDate: dateRange ? dateRange.start.toString() : null,

      endDate: dateRange ? dateRange.end.toString() : null,

      userStories: selectedUserStories.map((story) => story._id),
    };

    try {
      if (isEditMode) {
        await updateSprintAsync(sprintId, sprintData);

        navigate(`/sprints/${sprintId}`);
      } else {
        const result = await createSprintAsync(sprintData);

        navigate(`/sprints/${result._id}`);
      }
    } catch (error) {
      console.log(error);

      setErrorMessage(
        error.response?.data?.errorMessage ??
          `Could not ${isEditMode ? "update" : "create"} sprint.`,
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
      {/* Header */}
      <div className="mb-6">
        <div>
          {isEditMode && (
            <p className="mb-1 text-sm font-medium text-muted">
              Sprint-{sprintNumber}
            </p>
          )}
          <Typography type="h2">
            {isEditMode ? "Edit Sprint" : "Create Sprint"}
          </Typography>
          <p className="mt-1 text-sm text-muted">
            {isEditMode
              ? "Update the sprint details and assigned user stories."
              : "Create a new sprint and assign user stories."}
          </p>
        </div>
      </div>
      <Form onSubmit={onSubmit}>
        <div className="flex w-full flex-col gap-6">
          {/* General info */}
          <Card>
            <Card.Header>
              <div>
                <Card.Title>Sprint Details</Card.Title>
                <Card.Description>
                  General information about this sprint.
                </Card.Description>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Name */}
                <TextField isRequired className="w-full">
                  <Label>Name</Label>
                  <Input
                    value={name}
                    variant="secondary"
                    placeholder="Sprint"
                    onChange={(e) => setName(e.target.value)}
                  />
                </TextField>

                {/* Status */}
                <Select
                  value={status}
                  onChange={(value) => setStatus(String(value))}
                  placeholder="Select a status"
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
                      <ListBox.Item id="active" textValue="Active">
                        Active
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="completed" textValue="Completed">
                        Completed
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>

                {/* Goal */}
                <TextField className="md:col-span-2">
                  <Label>Sprint Goal</Label>
                  <TextArea
                    value={goal}
                    variant="secondary"
                    placeholder="What should be achieved during this sprint?"
                    rows={5}
                    onChange={(e) => setGoal(e.target.value)}
                  />
                </TextField>
              </div>
            </Card.Content>
          </Card>

          {/* Dates */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <CalendarDays className="size-5 text-muted" />
                <div>
                  <Card.Title>Sprint Dates</Card.Title>
                  <Card.Description>
                    Set the start and end date of the sprint.
                  </Card.Description>
                </div>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    className="w-full"
                  >
                    <Label>Date Range</Label>
                    <DateField.Group className="w-full">
                      <DateField.InputContainer>
                        <DateField.Input slot="start">
                          {(segment) => <DateField.Segment segment={segment} />}
                        </DateField.Input>
                        <DateRangePicker.RangeSeparator />
                        <DateField.Input slot="end">
                          {(segment) => <DateField.Segment segment={segment} />}
                        </DateField.Input>
                      </DateField.InputContainer>
                      <DateField.Suffix>
                        <DateRangePicker.Trigger>
                          <DateRangePicker.TriggerIndicator />
                        </DateRangePicker.Trigger>
                      </DateField.Suffix>
                    </DateField.Group>
                    <DateRangePicker.Popover>
                      <RangeCalendar aria-label="Sprint dates">
                        <RangeCalendar.Header>
                          <RangeCalendar.YearPickerTrigger>
                            <RangeCalendar.YearPickerTriggerHeading />
                            <RangeCalendar.YearPickerTriggerIndicator />
                          </RangeCalendar.YearPickerTrigger>
                          <RangeCalendar.NavButton slot="previous" />
                          <RangeCalendar.NavButton slot="next" />
                        </RangeCalendar.Header>
                        <RangeCalendar.Grid>
                          <RangeCalendar.GridHeader>
                            {(day) => (
                              <RangeCalendar.HeaderCell>
                                {day}
                              </RangeCalendar.HeaderCell>
                            )}
                          </RangeCalendar.GridHeader>
                          <RangeCalendar.GridBody>
                            {(date) => <RangeCalendar.Cell date={date} />}
                          </RangeCalendar.GridBody>
                        </RangeCalendar.Grid>
                      </RangeCalendar>
                    </DateRangePicker.Popover>
                  </DateRangePicker>
                </div>
                {dateRange && (
                  <Button
                    type="button"
                    variant="ghost"
                    onPress={() => setDateRange(null)}
                  >
                    <X className="size-4" />
                    Clear dates
                  </Button>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* User Stories */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <NotebookText className="size-5 text-muted" />

                <div>
                  <Card.Title>User Stories</Card.Title>
                  <Card.Description>
                    Search for stories and assign them to this sprint.
                  </Card.Description>
                </div>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="flex flex-col gap-5">
                {/* Search */}
                <ComboBox
                  fullWidth
                  allowsEmptyCollection
                  menuTrigger="input"
                  inputValue={storySearch}
                  onInputChange={setStorySearch}
                  value={null}
                  onChange={addUserStory}
                >
                  <Label>Add User Story</Label>
                  <ComboBox.InputGroup>
                    <Input
                      variant="secondary"
                      placeholder="Search by US number, title or description..."
                    />
                    <ComboBox.Trigger />
                  </ComboBox.InputGroup>
                  <ComboBox.Popover>
                    <ListBox>
                      {filteredUserStories.map((story) => (
                        <ListBox.Item
                          key={story._id}
                          id={story._id}
                          textValue={`US-${story.userStoryNumber} ${story.title}`}
                        >
                          <div className="flex w-full items-center justify-between gap-4">
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {story.title}
                              </p>

                              <p className="text-xs text-muted">
                                US-{story.userStoryNumber}
                              </p>
                            </div>
                            {story.storyPoints != null && (
                              <Chip
                                size="sm"
                                variant="soft"
                                className="shrink-0"
                              >
                                {story.storyPoints} pts
                              </Chip>
                            )}
                          </div>
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </ComboBox.Popover>
                </ComboBox>

                {/* Assigned Stories */}
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">Assigned Stories</p>
                    <Chip size="sm" variant="soft">
                      {selectedUserStories.length}
                    </Chip>
                  </div>
                  {selectedUserStories.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-separator px-4 py-8 text-center">
                      <NotebookText className="mx-auto mb-2 size-6 text-muted" />
                      <p className="text-sm font-medium">
                        No user stories assigned
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Search above to add stories to this sprint.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col divide-y divide-separator overflow-hidden rounded-xl border border-separator">
                      {selectedUserStories.map((story) => (
                        <div
                          key={story._id}
                          className="flex items-center gap-3 p-3 sm:p-4"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-medium text-muted">
                                US-{story.userStoryNumber}
                              </span>
                              <p className="truncate text-sm font-medium">
                                {story.title}
                              </p>
                            </div>
                            {story.description && (
                              <p className="mt-1 line-clamp-1 text-xs text-muted">
                                {story.description}
                              </p>
                            )}
                          </div>
                          {story.storyPoints != null && (
                            <Chip
                              size="sm"
                              variant="soft"
                              className="hidden shrink-0 sm:flex"
                            >
                              {story.storyPoints} pts
                            </Chip>
                          )}
                          <Button
                            isIconOnly
                            type="button"
                            variant="ghost"
                            aria-label={`Remove ${story.title}`}
                            onPress={() => removeUserStory(story._id)}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card.Content>
          </Card>
          {errorMessage && (
            <div className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger-soft-foreground">
              {errorMessage}
            </div>
          )}

          {/* Actions */}
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
                  : "Create Sprint"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default AddEditSprintPage;
