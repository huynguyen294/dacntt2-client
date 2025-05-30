import useClassData from "../hooks/useClassData";
import { DropDown, Table, TableProvider } from "@/components/common";
import { Button } from "@heroui/button";
import { Edit, ListChecks, MegaphoneOff, Plus, Trash2 } from "lucide-react";
import { useParams, useSearchParams } from "react-router";
import { dayFormat, shiftFormat } from "@/utils";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal";
import { useState } from "react";
import { ConfirmDeleteDialog } from "@/components";
import { scheduleApi } from "@/apis";
import { addToast } from "@heroui/toast";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import ScheduleForm from "./ScheduleForm";

const ClassSchedule = () => {
  const queryClient = useQueryClient();

  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isScheduleModalOpen, onOpen: onScheduleModalOpen, onOpenChange } = useDisclosure();
  const [selectedRow, setSelectedRow] = useState(null);
  const [action, setAction] = useState(null);

  // const user = useAppStore('user')
  const { loading, schedules } = useClassData(id);

  const handleAbsented = async () => {
    if (!selectedRow || action !== "absented") return;

    const { date } = selectedRow;
    let result = {};
    if (selectedRow.id) {
      result = await scheduleApi.update(selectedRow.id, { isAbsented: true });
      queryClient.invalidateQueries({ queryKey: ["classes", id, "schedules"] });
    } else {
      result = await scheduleApi.create({ classId: id, isAbsented: true, date });
      queryClient.invalidateQueries({ queryKey: ["classes", id, "schedules"] });
    }
    if (!result.ok) {
      addToast({ color: "danger", title: "Lỗi!", description: "Có lỗi khi báo vắng buổi học" });
    }
    setAction(null);
    setSelectedRow(null);
    onDeleteClose();
  };

  const handleDelete = async () => {
    if (!selectedRow || action !== "delete") return;

    const { date } = selectedRow;
    let result = {};
    if (selectedRow.id) {
      result = await scheduleApi.update(selectedRow.id, { isDeleted: true });
      queryClient.invalidateQueries({ queryKey: ["classes", id, "schedules"] });
    } else {
      result = await scheduleApi.create({ classId: id, isDeleted: true, date });
      queryClient.invalidateQueries({ queryKey: ["classes", id, "schedules"] });
    }
    if (!result.ok) {
      addToast({ color: "danger", title: "Lỗi!", description: "Có lỗi khi xóa buổi học" });
    }
    setAction(null);
    setSelectedRow(null);
    onDeleteClose();
  };

  const renderActions = (row) => {
    return (
      <DropDown
        onAction={(key) => {
          if (key === "absented") {
            setAction("absented");
            setSelectedRow(row);
            onDeleteOpen();
          }
          if (key === "delete") {
            setAction("delete");
            setSelectedRow(row);
            onDeleteOpen();
          }
          if (key === "edit") {
            setAction("edit");
            setSelectedRow(row);
            onScheduleModalOpen();
          }
          if (key === "attendance") {
            searchParams.set("tab", "attendance");
            searchParams.set("date", row.date);
            setSearchParams(searchParams);
          }
        }}
        menuItems={[
          {
            key: "absented",
            label: "Báo vắng",
            startContent: <MegaphoneOff size="18px" className="w-4" />,
            disabled: row.isAbsented,
          },
          {
            key: "attendance",
            label: "Điểm danh",
            startContent: <ListChecks size="18px" className="w-4" />,
            disabled: new Date(row.date) > new Date() || row.isAbsented,
          },
          { key: "edit", label: "Chỉnh sửa", startContent: <Edit size="18px" className="w-4" />, disabled: true },
          { key: "delete", label: "Xóa", startContent: <Trash2 size="18px" className="w-4" />, color: "danger" },
        ]}
      />
    );
  };

  const renderTime = (row) => {
    const day = dayFormat(row.date);
    const shift = row.shift.name + " " + shiftFormat(row.shift);
    const passed = new Date() > new Date(row.date);

    return (
      <div className={cn("my-2", row.isAbsented && "line-through", passed && "text-foreground-400")}>
        <p className="font-semibold">
          {row.date} ({day})
        </p>
        <p className={cn("font-semibold text-foreground-500", passed && "text-foreground-400")}>{shift}</p>
      </div>
    );
  };

  const renderTeacher = (row) => {
    const passed = new Date() > new Date(row.date);

    return (
      <div className={cn(row.isAbsented && "line-through", passed && "text-foreground-400")}>
        <p className="font-semibold">{row?.teacher?.name}</p>
        <p className="text-foreground-500">({row?.teacher?.email})</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        title={action === "delete" ? "Xóa" : "Báo vắng"}
        message={`Bạn chắc chắn muốn ${action === "delete" ? "xóa" : "báo vắng"} buổi học này`}
        onClose={onDeleteClose}
        onDelete={action === "delete" ? handleDelete : handleAbsented}
        deleteBtnText={action === "delete" ? "Xóa" : "Báo vắng"}
      />
      {isScheduleModalOpen && (
        <Modal
          isOpen={true}
          aria-labelledby="schedule-modal"
          onOpenChange={(open) => {
            onOpenChange(open);
            if (!open) setSelectedRow(null);
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Lịch học</ModalHeader>
                <ModalBody>
                  <ScheduleForm defaultValues={selectedRow || {}} onClose={onClose} />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Hủy
                  </Button>
                  <Button color="primary" type="submit" form="schedule-form">
                    Lưu lại
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
      <Button
        isDisabled={loading}
        variant="shadow"
        radius="full"
        color="primary"
        startContent={<Plus />}
        onPress={onScheduleModalOpen}
      >
        Buổi học
      </Button>
      <TableProvider
        value={{
          columns: [
            { uid: "index", name: "STT", disableSort: true },
            { uid: "time", name: "Thời gian", disableSort: true, render: renderTime },
            { uid: "teacher", name: "Giáo viên", disableSort: true, render: renderTeacher },
            { uid: "actions", name: "Thao tác", disableSort: true, render: renderActions },
          ],
        }}
      >
        <Table
          rows={schedules || []}
          isHeaderSticky={false}
          classNames={{ wrapper: "shadow-none p-0 rounded-none" }}
          selectionMode="none"
          isLoading={loading}
        />
      </TableProvider>
    </div>
  );
};

export default ClassSchedule;
