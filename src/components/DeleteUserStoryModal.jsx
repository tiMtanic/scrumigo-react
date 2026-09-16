import React, { useState } from "react";
import { Button, Modal } from "@heroui/react";
import { Trash2 } from "lucide-react";

function DeleteUserStoryModal({ userStory, onDelete, trigger }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleDelete = async (close) => {
    if (!userStory) return;

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await onDelete(userStory._id);
      close();
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error.response?.data?.errorMessage ?? "Could not delete user story.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal>
      {trigger}
      <Modal.Backdrop variant="blur" isDismissable={!isDeleting}>
        <Modal.Container size="sm">
          <Modal.Dialog>
            {({ close }) => (
              <>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>Delete User Story</Modal.Heading>
                </Modal.Header>
                <Modal.Body>
                  <p>
                    Are you sure you want to delete
                    <span className="font-semibold">
                      {" " + userStory?.title}
                    </span>
                    ?
                  </p>
                  <p className="text-sm text-muted">
                    All tasks assigned to this user story will also be deleted.
                  </p>
                  {errorMessage && (
                    <p className="text-sm text-danger">{errorMessage}</p>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    isDisabled={isDeleting}
                    onPress={close}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    isDisabled={isDeleting}
                    onPress={() => handleDelete(close)}
                  >
                    <Trash2 className="size-4" />
                    {isDeleting ? "Deleting..." : "Delete User Story"}
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default DeleteUserStoryModal;
