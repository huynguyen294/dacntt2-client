import { useQuery, useQueryClient } from "@tanstack/react-query";
import { classApi, enrollmentApi } from "@/apis";
import { ArrowLeftRight, Trash2 } from "lucide-react";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import { Modal, Table, TableProvider } from "@/components/common";
import { displayDate } from "@/utils";
import { addToast } from "@heroui/toast";
import { ConfirmDeleteDialog } from "@/components";
import { useState } from "react";
import { ORDER_BY_NAME } from "@/constants";
import { useAppStore } from "@/state";
import { ModalBody, ModalHeader, useDisclosure } from "@heroui/modal";
import { ClassAssignment } from "@/components";

const StudentList = ({ classId }) => {
  const queryClient = useQueryClient();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const changeClassModal = useDisclosure();

  const user = useAppStore("user");

  const { isLoading, data } = useQuery({
    queryKey: ["classes", classId, "students", "refFields=:full"],
    queryFn: () => classApi.getClassStudents(classId, ORDER_BY_NAME, ["refFields=:full"]),
  });

  const handleDelete = async () => {
    if (!selectedStudent) return;
    const result = await enrollmentApi.delete(selectedStudent.id);
    queryClient.invalidateQueries({ queryKey: ["classes"] });
    if (!result.ok) {
      addToast({ color: "danger", title: "Xóa thất bại!", description: result.message });
    }
    setSelectedStudent(null);
    onClose();
  };

  return (
    <>
      <ConfirmDeleteDialog
        isOpen={isOpen}
        title="Xóa học sinh khỏi lớp"
        message="Học sinh này sẽ bị khóa khỏi lớp học"
        onDelete={handleDelete}
        onClose={() => {
          setSelectedStudent(null);
          onClose();
        }}
      />
      <Modal
        size="6xl"
        isOpen={changeClassModal.isOpen}
        onOpenChange={(open) => {
          setSelectedStudent(null);
          changeClassModal.onOpenChange(open);
        }}
        scrollBehavior="inside"
      >
        <ModalHeader></ModalHeader>
        <ModalBody>
          {selectedStudent && (
            <ClassAssignment
              studentIds={[selectedStudent.id]}
              isSingleMode
              enrollment={{ id: selectedStudent.enrollmentId, oldClassId: classId }}
              isChangeClass
              onSuccess={() => {
                addToast({ color: "success", title: "Thành công!", description: "Đã chuyển học sinh vào lớp" });
                setSelectedStudent(null);
                changeClassModal.onClose();
              }}
            />
          )}
        </ModalBody>
      </Modal>
      <TableProvider
        value={{
          columns: [
            { uid: "index", name: "STT", disableSort: true },
            { uid: "name", name: "Tên", disableSort: true },
            { uid: "email", name: "Email", disableSort: true },
            { uid: "phoneNumber", name: "Số điện thoại", disableSort: true },
            { uid: "dateOfBirth", name: "Ngày sinh", disableSort: true },
            { uid: "gender", name: "Giới tính", disableSort: true },
            ["admin", "finance-officer"].includes(user.role) && { uid: "actions", name: "Thao tác", disableSort: true },
          ],
        }}
      >
        <Table
          isHeaderSticky={false}
          classNames={{ wrapper: "shadow-none p-0 rounded-none" }}
          rows={data?.students || []}
          selectionMode="none"
          isLoading={isLoading}
          renderCell={(rowData, columnKey, index) => {
            const dateFields = ["dateOfBirth"];
            let cellValue = rowData[columnKey];
            if (columnKey === "index") cellValue = index + 1;
            if (dateFields.includes(columnKey)) cellValue = displayDate(cellValue);

            if (columnKey === "actions" && ["admin", "finance-officer"].includes(user.role)) {
              return (
                <>
                  <Tooltip content="Chuyển lớp">
                    <Button
                      onClick={(e) => e.stopPropagation()}
                      onPress={() => {
                        setSelectedStudent(rowData);
                        changeClassModal.onOpen();
                      }}
                      size="sm"
                      isIconOnly
                      radius="full"
                      variant="light"
                    >
                      <ArrowLeftRight size="18px" />
                    </Button>
                  </Tooltip>
                  <Tooltip color="danger" content="Xóa học sinh khỏi lớp">
                    <Button
                      onClick={(e) => e.stopPropagation()}
                      onPress={() => {
                        setSelectedStudent(rowData);
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
                </>
              );
            }

            return cellValue;
          }}
        />
      </TableProvider>
    </>
  );
};

export default StudentList;
