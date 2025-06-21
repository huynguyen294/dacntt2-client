import { Modal, Table, TableProvider } from "@/components/common";
import { useNavigate } from "@/hooks";
import { displayDate, localeString } from "@/utils";
import { Button } from "@heroui/button";
import { ModalBody, ModalFooter, ModalHeader } from "@heroui/modal";
import { Tooltip } from "@heroui/tooltip";
import { Edit, Trash2 } from "lucide-react";

const StudentTuitionModal = ({ modalControl = {}, onClose, data }) => {
  const navigate = useNavigate();
  const { student = {}, tuitions = [] } = data;

  const handleDelete = async () => {};

  return (
    <Modal
      isOpen={modalControl.isOpen}
      onOpenChange={modalControl.onOpenChange}
      onClose={onClose}
      scrollBehavior="inside"
    >
      <ModalHeader>{student.name}</ModalHeader>
      <ModalBody>
        <TableProvider
          value={{
            columns: [
              { name: "STT", uid: "index", disableSort: true },
              { name: "Ngày thanh toán", uid: "date", disableSort: true },
              { name: "Số tiền", uid: "amount", disableSort: true },
              { name: "Mã thanh toán", uid: "content", disableSort: true },
              { name: "Thao tác", uid: "actions", disableSort: true },
            ],
          }}
        >
          <Table
            isHeaderSticky={false}
            classNames={{ wrapper: "shadow-none p-0 rounded-none" }}
            rows={tuitions}
            selectionMode="none"
            renderCell={(rowData, columnKey, index) => {
              let cellValue = rowData[columnKey];
              if (columnKey === "index") cellValue = index + 1;
              if (columnKey === "amount") cellValue = localeString(cellValue) + "đ";
              if (columnKey === "date") cellValue = displayDate(cellValue);
              if (columnKey === "actions") {
                return [
                  <Tooltip content="Chỉnh sửa học phí">
                    <Button
                      onClick={(e) => e.stopPropagation()}
                      onPress={() => navigate("/class-tuition/edit/" + rowData.id)}
                      size="sm"
                      isIconOnly
                      radius="full"
                      variant="light"
                    >
                      <Edit size="18px" />
                    </Button>
                  </Tooltip>,
                  <Tooltip color="danger" content="Xóa học phí">
                    <Button
                      onClick={(e) => e.stopPropagation()}
                      onPress={handleDelete}
                      size="sm"
                      color="danger"
                      isIconOnly
                      radius="full"
                      variant="light"
                    >
                      <Trash2 size="18px" />
                    </Button>
                  </Tooltip>,
                ];
              }

              return cellValue;
            }}
          />
        </TableProvider>
      </ModalBody>
      <ModalFooter>
        <Button variant="light" color="danger" onPress={modalControl.onClose}>
          Đóng
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default StudentTuitionModal;
