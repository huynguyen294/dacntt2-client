import { ModalBody, ModalHeader } from "@heroui/modal";
import { Modal } from "./common";

const InstallModal = ({ isOpen, onClose, ...other }) => {
  return (
    <Modal scrollBehavior="inside" isOpen={isOpen} onClose={onClose} placement="center" {...other}>
      <ModalHeader>Cài đặt ứng dụng</ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-4 items-center py-10">
          <p className="font-semibold text-lg">Bước 1: Nhấn vào biểu tưởng chi sẻ trên thanh địa chỉ</p>
          <img src="/images/ios-install/ios-1.png" style={{ width: "max(60%,350px)", borderRadius: 8 }}></img>
          <p className="font-semibold text-lg">Bước 2: Kéo xuống và chọn thêm vào màn hình chính</p>
          <img src="/images/ios-install/ios-2.png" style={{ width: "max(60%,350px)", borderRadius: 8 }}></img>
          <p className="font-semibold text-lg">Bước 3: Chọn thêm để thêm vào màn hình chính</p>
          <img src="/images/ios-install/ios-3.png" style={{ width: "max(60%,350px)", borderRadius: 8 }}></img>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default InstallModal;
