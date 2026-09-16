import {
  Button,
  Form,
  Input,
  Label,
  ListBox,
  Spinner,
  TextField,
  Select,
  TextArea,
} from "@heroui/react";
import { Save, X } from "lucide-react";
import React, { useState } from "react";

function TaskForm({ task = null, title, submitLabel, onSubmit, onCancel }) {
  const [taskTitle, setTaskTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState(task?.status ?? "todo");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    try {
      await onSubmit({
        title: taskTitle.trim(),
        description: description.trim(),
        status,
      });
    } catch (error) {
      console.log(error);

      setErrorMessage(
        error.response?.data?.errorMessage ?? "Could not save task.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-semibold">{title}</h3>
          <Button
            isIconOnly
            size="sm"
            type="button"
            variant="ghost"
            aria-label="Cancel"
            isDisabled={isSaving}
            onPress={onCancel}
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TextField isRequired className="md:col-span-2">
            <Label>Title</Label>
            <Input
              value={taskTitle}
              variant="secondary"
              maxLength={200}
              placeholder="Implement..."
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </TextField>
          <Select
            value={status}
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
                <ListBox.Item id="todo" textValue="Todo">
                  Todo
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
          <TextField className="md:col-span-3">
            <Label>Description</Label>
            <TextArea
              value={description}
              variant="secondary"
              rows={4}
              maxLength={5000}
              placeholder="Describe the task..."
              onChange={(e) => setDescription(e.target.value)}
            />
          </TextField>
        </div>
        {errorMessage && (
          <div className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
            {errorMessage}
          </div>
        )}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            isDisabled={isSaving}
            onPress={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isDisabled={isSaving}>
            {isSaving ? <Spinner size="sm" /> : <Save className="size-4" />}
            {isSaving ? "Saving..." : submitLabel}
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default TaskForm;
