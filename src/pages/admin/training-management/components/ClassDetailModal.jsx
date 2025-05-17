import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/modal";
import { useQueryClient } from "@tanstack/react-query";
import { enrollmentApi } from "@/apis";
import { Trash2 } from "lucide-react";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import { Table, TableProvider } from "@/components/common";
import { displayDate, shiftFormat } from "@/utils";
import { addToast } from "@heroui/toast";
import { ConfirmDeleteDialog } from "@/components";
import { useState } from "react";

const ClassDetailModal = ({ rowData, onOpenChange }) => {
  const queryClient = useQueryClient();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedStudentId, setSelectedStudentId] = useState();

  const { users, shifts, students } = rowData;

  const handleDelete = async () => {
    if (!selectedStudentId) return;
    const result = await enrollmentApi.delete(selectedStudentId);
    queryClient.invalidateQueries({ queryKey: ["classes"] });
    if (!result.ok) {
      addToast({ color: "danger", title: "Xóa thất bại!", description: result.message });
    }
    setSelectedStudentId(null);
    onClose();
  };

  return (
    <>
      <ConfirmDeleteDialog
        isOpen={isOpen}
        title="Xóa học sinh khỏi lớp"
        message="Học sinh này sẽ bị khóa khỏi lớp học"
        onClose={onClose}
        onDelete={handleDelete}
      />
      <Modal size="5xl" isOpen={true} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Thông tin chi tiết</ModalHeader>
              <ModalBody>
                <div className="h-[80dvh] sm:h-[75dvh] overflow-y-auto space-y-4 pb-10">
                  <div className="rounded-large border p-3 sm:p-4 py-6 gap-4">
                    <p className="font-bold">Thông tin lớp học</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 w-full mt-4 space-y-3">
                      <div>
                        <p className="font-semibold text-foreground-500">Tên</p>
                        <p className="font-semibold">{rowData.name || "Không có"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground-500">Giáo viên</p>
                        <p className="font-semibold">{users[rowData.teacherId].name || "Không có"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground-500">Lịch học</p>
                        <p className="font-semibold">{rowData.weekDays || "Không có"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground-500">Ca học</p>
                        <p className="font-semibold">{`${shifts[rowData.shiftId].name} (${shiftFormat(
                          shifts[rowData.shiftId]
                        )})`}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground-500">Ngày bắt đầu</p>
                        <p className="font-semibold">{displayDate(rowData.openingDay) || "Không có"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground-500">Ngày kết thúc</p>
                        <p className="font-semibold">{displayDate(rowData.closingDay) || "Không có"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-large border p-3 sm:p-4 py-6 gap-4">
                    <p className="font-bold">Danh sách học viên</p>
                    <TableProvider
                      value={{
                        columns: [
                          { uid: "index", name: "STT" },
                          { uid: "name", name: "Tên" },
                          { uid: "email", name: "Email" },
                          { uid: "phoneNumber", name: "Số điện thoại" },
                          { uid: "dateOfBirth", name: "Ngày sinh" },
                          { uid: "gender", name: "Giới tính" },
                          { uid: "actions", name: "Thao tác" },
                        ],
                      }}
                    >
                      <Table
                        isHeaderSticky={false}
                        classNames={{ wrapper: "shadow-none p-0 rounded-none" }}
                        rows={students[rowData.id] || []}
                        selectionMode="none"
                        renderCell={(rowData, columnKey, index) => {
                          const dateFields = ["dateOfBirth"];
                          let cellValue = rowData[columnKey];
                          if (columnKey === "index") cellValue = index + 1;
                          if (dateFields.includes(columnKey)) cellValue = displayDate(cellValue);

                          if (columnKey === "actions") {
                            return (
                              <Tooltip color="danger" content="Xóa học sinh khỏi lớp">
                                <Button
                                  onClick={(e) => e.stopPropagation()}
                                  onPress={() => {
                                    setSelectedStudentId(rowData.enrollmentId);
                                    onOpen();
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
                            );
                          }

                          return cellValue;
                        }}
                      />
                    </TableProvider>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ClassDetailModal;
