import { tuitionApi } from "@/apis";
import { ConfirmDeleteDialog } from "@/components";
import { Modal, Table, TableProvider } from "@/components/common";
import { useNavigate } from "@/hooks";
import { displayDate, localeString } from "@/utils";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { ModalBody, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal";
import { Tooltip } from "@heroui/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";

const StudentTuitionModal = ({ modalControl = {}, onClose, data }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { student = {}, tuitions = [], discounts = [] } = data;
  const [selected, setSelected] = useState(null);
  const deleteDialog = useDisclosure();

  const handleDelete = async () => {
    if (!selected) return;

    let result;
    if (selected.isDiscount) {
      result = await tuitionDiscountApi.delete(selected.id);
    } else {
      result = await tuitionApi.delete(selected.id);
    }

    if (!result.ok) {
      addToast({ color: "danger", title: "Xóa thất bại!", description: result.message });
    } else {
      if (selected.isDiscount) {
        queryClient.invalidateQueries({ queryKey: ["tuition-discounts"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["tuitions"] });
      }
    }

    deleteDialog.onClose();
    setSelected(null);
  };

  const rows = discounts
    .map((d) => ({ date: d.createdAt, content: `Miễn giảm - ${d.reason}`, ...d, isDiscount: true }))
    .concat(tuitions);

  return (
    <>
      <ConfirmDeleteDialog
        title={"Xóa học phí" + selected?.isDiscount ? " miễn giảm" : ""}
        message="Học phí này sẽ bị xóa vĩnh viễn khỏi hệ thống."
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        onDelete={handleDelete}
      />
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
              rows={rows}
              selectionMode="none"
              renderCell={(rowData, columnKey, index) => {
                let cellValue = rowData[columnKey];
                if (columnKey === "index") cellValue = index + 1;
                if (columnKey === "amount") cellValue = localeString(cellValue) + "đ";
                if (columnKey === "date") cellValue = displayDate(cellValue);
                if (columnKey === "content" && rowData.isDiscount) {
                  cellValue = (
                    <Chip color="warning" size="sm" variant="flat">
                      {cellValue}
                    </Chip>
                  );
                }
                if (columnKey === "actions") {
                  return (
                    <>
                      <Tooltip content={rowData.isDiscount ? "Chỉnh sửa miễn giảm" : "Chỉnh sửa học phí"}>
                        <Button
                          onClick={(e) => e.stopPropagation()}
                          onPress={() =>
                            rowData.isDiscount
                              ? navigate("/tuition-discount/edit/" + rowData.id)
                              : navigate("/class-tuition/edit/" + rowData.id)
                          }
                          size="sm"
                          isIconOnly
                          radius="full"
                          variant="light"
                        >
                          <Edit size="18px" />
                        </Button>
                      </Tooltip>
                      <Tooltip color="danger" content="Xóa học phí">
                        <Button
                          onClick={(e) => e.stopPropagation()}
                          onPress={() => {
                            setSelected(rowData);
                            deleteDialog.onOpen();
                          }}
                          size="sm"
                          color="danger"
                          isIconOnly
                          radius="full"
                          variant="light"
                        >
                          <Trash2 size="18px" />
                        </Button>
                      </Tooltip>
                    </>
                  );
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
    </>
  );
};

export default StudentTuitionModal;
