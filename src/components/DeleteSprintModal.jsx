import React, { useState } from "react";
import {
  Button,
  Modal,
} from "@heroui/react";
import { Trash2 } from "lucide-react";

function DeleteSprintModal({ sprint, onDelete, trigger }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleDelete = async (close) => {
    if (!sprint) return;

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await onDelete(sprint._id);
      close();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.errorMessage ?? "Could not delete sprint.",
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
                  <Modal.Heading>Delete Sprint</Modal.Heading>
                </Modal.Header>
                <Modal.Body>
                  <p>
                    Are you sure you want to delete
                    <span className="font-semibold">{" " + sprint?.name}</span>?
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
                    {isDeleting ? "Deleting..." : "Delete Sprint"}
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

export default DeleteSprintModal;
