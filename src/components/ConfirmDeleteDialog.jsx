import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { useState } from "react";

const ConfirmDeleteDialog = ({ isOpen, title, onDelete, message, onClose }) => {
  const [loading, setLoading] = useState(false);

  return (
    <Modal isOpen={isOpen} placement="center" onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <p className="text-foreground">{title}</p>
            </ModalHeader>
            <ModalBody>
              <p className="text-foreground">{message}</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" color="danger" onPress={onClose}>
                Hủy
              </Button>
              <Button
                isLoading={loading}
                color="primary"
                onPress={async () => {
                  setLoading(true);
                  await onDelete();
                  setLoading(false);
                }}
              >
                Xóa
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDeleteDialog;
