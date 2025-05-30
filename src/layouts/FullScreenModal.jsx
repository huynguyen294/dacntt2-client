import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { X } from "lucide-react";

const FullScreenModal = ({ classNames, titleText, titleIcon, onOpenChange, children, rightControls }) => {
  return (
    <Modal
      scrollBehavior="inside"
      disableAnimation
      size="full"
      isOpen={true}
      onOpenChange={onOpenChange}
      hideCloseButton
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-between border-b-1 py-1.5">
              <div className="flex items-center gap-1 ">
                <Button onPress={onClose} radius="full" variant="light" size="lg" isIconOnly>
                  <X className="text-foreground-500" />
                </Button>
                <div className="mr-2 size-10 rounded-full bg-gradient-to-br from-primary-50 to-secondary-50 text-primary grid place-items-center">
                  {titleIcon}
                </div>
                <p className="text-lg text-foreground-500">{titleText}</p>
              </div>
              {rightControls}
            </ModalHeader>
            <ModalBody className="px-2 sm:px-6">{children}</ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default FullScreenModal;
