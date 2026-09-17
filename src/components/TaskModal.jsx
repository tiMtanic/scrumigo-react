import React, { useState } from "react";
import { Button, Modal, useOverlayState } from "@heroui/react";
import TaskRow from "./TaskRow";
import TaskForm from "./TaskForm";

function TaskModal({
  task,
  trigger,
  triggerClassName,
  onUpdate,
  onDelete,
  dragRef,
  dragListeners,
  dragAttributes,
  dragStyle,
  isDragging,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const resetState = () => {
    setIsEditing(false);
    setErrorMessage(null);
  };

  const state = useOverlayState({
    onOpenChange: (isOpen) => {
      if (!isOpen) {
        resetState();
      }
    },
  });

  const handleUpdate = async (taskData) => {
    await onUpdate(task._id, taskData);
    state.close();
  };

  const handleDelete = async () => {
    setErrorMessage(null);

    try {
      await onDelete(task._id);
      state.close();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.errorMessage ?? "Could not delete task.",
      );
    }
  };

  return (
    <Modal state={state}>
      <Button
        ref={dragRef}
        type="button"
        variant="ghost"
        className={`${triggerClassName} ${
          isDragging ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing"
        }`}
        style={dragStyle}
        {...dragListeners}
        {...dragAttributes}
      >
        {trigger}
      </Button>
      <Modal.Backdrop variant="blur">
        <Modal.Container size="lg">
          <Modal.Dialog>
            <>
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>
                  {isEditing
                    ? `Edit T-${task.taskNumber}`
                    : `T-${task.taskNumber}`}
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                {isEditing ? (
                  <TaskForm
                    task={task}
                    title="Edit Task"
                    submitLabel="Save Changes"
                    onSubmit={handleUpdate}
                    onCancel={() => setIsEditing(false)}
                  />
                ) : (
                  <>
                    <TaskRow
                      task={task}
                      onEdit={() => setIsEditing(true)}
                      onDelete={handleDelete}
                    />
                    {errorMessage && (
                      <div className="mt-3 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
                        {errorMessage}
                      </div>
                    )}
                  </>
                )}
              </Modal.Body>
            </>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default TaskModal;
