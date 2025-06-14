import { Modal as HeroUiModal, ModalContent } from "@heroui/modal";

const Modal = ({ isOpen, onOpenChange, children, size = "3xl", ...other }) => {
  if (!isOpen) return null;
  return (
    <HeroUiModal aria-label="modal" isOpen size={size} onOpenChange={onOpenChange} {...other}>
      <ModalContent>{() => children}</ModalContent>
    </HeroUiModal>
  );
};

export default Modal;
