import ScheduleForm from "./ScheduleForm";
import useClassData from "../hooks/useClassData";
import { DropDown, Modal, Table, TableProvider } from "@/components/common";
import { Button } from "@heroui/button";
import { ChevronDown, Edit, ListChecks, MegaphoneOff, Plus, Timer, TimerReset, Trash2, User } from "lucide-react";
import { useParams, useSearchParams } from "react-router";
import { dayFormat, shiftFormat } from "@/utils";
import { ModalBody, ModalHeader, useDisclosure } from "@heroui/modal";
import { useMemo, useState } from "react";
import { ConfirmDeleteDialog, SearchShift, SearchUser } from "@/components";
import { attendanceApi, scheduleApi } from "@/apis";
import { addToast } from "@heroui/toast";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/state";
import { DropdownItem, DropdownMenu, DropdownTrigger, Dropdown as HeroUiDropdown } from "@heroui/dropdown";
import { EMPLOYEE_STATUS } from "@/constants";

const ClassSchedule = () => {
  const queryClient = useQueryClient();
  const user = useAppStore("user");

  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedRow, setSelectedRow] = useState(null);
  const [action, setAction] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const deleteDialog = useDisclosure();
  const scheduleModal = useDisclosure();
  const teacherModal = useDisclosure();
  const shiftModal = useDisclosure();

  // const user = useAppStore('user')
  const { loading, schedules } = useClassData(id);

  const { data: dataLessonCheck } = useQuery({
    queryKey: ["classes", id, "check-lessons"],
    queryFn: () => attendanceApi.checkLessons(id),
  });

  const handleAbsented = async () => {
    if (!selectedRow || action !== "absented") return;

    const result = await scheduleApi.update(selectedRow.id, { isAbsented: true });
    queryClient.invalidateQueries({ queryKey: ["classes", id, "schedules"] });

    if (!result.ok) {
      addToast({ color: "danger", title: "Lỗi!", description: "Có lỗi khi báo vắng buổi học" });
    }

    setAction(null);
    setSelectedRow(null);
    onDeleteClose();
  };

  const handleDelete = async () => {
    if (!selectedRow || action !== "delete") return;

    const result = await scheduleApi.delete(selectedRow.id);
    queryClient.invalidateQueries({ queryKey: ["classes", id, "schedules"] });

    if (!result.ok) {
      addToast({ color: "danger", title: "Lỗi!", description: "Có lỗi khi xóa buổi học" });
    }

    setAction(null);
    setSelectedRow(null);
    onDeleteClose();
  };

  const renderActions = (row) => {
    const passed = dataLessonCheck?.result?.[row.id]?.total > 0;

    return (
      <DropDown
        isDisabled={passed}
        onAction={(key) => {
          if (key === "absented") {
            setAction("absented");
            setSelectedRow(row);
            deleteDialog.onOpen();
          }
          if (key === "delete") {
            setAction("delete");
            setSelectedRow(row);
            deleteDialog.onOpen();
          }
          if (key === "edit") {
            setAction("edit");
            setSelectedRow(row);
            scheduleModal.onOpen();
          }
          if (key === "attendance") {
            if (new Date(row.date) > new Date()) {
              addToast({ color: "danger", title: "Lỗi!", description: "Chưa đến ngày học" });
            } else {
              searchParams.set("tab", "attendance");
              searchParams.set("lessonId", row.id);
              setSearchParams(searchParams, { replace: true });
            }
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
            disabled: row.isAbsented,
          },
          ...(["admin", "finance-officer"].includes(user?.role)
            ? [
                { key: "edit", label: "Chỉnh sửa", startContent: <Edit size="18px" className="w-4" /> },
                { key: "delete", label: "Xóa", startContent: <Trash2 size="18px" className="w-4" />, color: "danger" },
              ]
            : []),
        ]}
      />
    );
  };

  const renderTime = (row) => {
    const day = dayFormat(row.date);
    const shift = row.shift.name + " " + shiftFormat(row.shift);
    const passed = dataLessonCheck?.result?.[row.id]?.total > 0;

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
    const passed = dataLessonCheck?.result?.[row.id]?.total > 0;

    return (
      <div className={cn(row.isAbsented && "line-through", passed && "text-foreground-400")}>
        <p className="font-semibold">{row?.teacher?.name}</p>
        <p className="text-foreground-500">({row?.teacher?.email})</p>
      </div>
    );
  };

  const handleUpdateShift = async () => {
    const filtered = selectedKeys === "all" ? schedules : schedules.filter((s) => selectedKeys.has(s.id.toString()));
    const payload = filtered.map((s) => ({ id: s.id, shiftId: Number(selectedShift) }));

    const result = await scheduleApi.update(payload);
    if (result.ok) {
      queryClient.invalidateQueries({ queryKey: ["classes", id, "schedules"] });
    } else {
      addToast({ color: "danger", title: "Lỗi!", description: result.message });
    }

    setSelectedKeys(new Set());
    setSelectedShift(null);
    shiftModal.onClose();
    deleteDialog.onClose();
  };

  const handleUpdateTeacher = async () => {
    const filtered = selectedKeys === "all" ? schedules : schedules.filter((s) => selectedKeys.has(s.id.toString()));
    const payload = filtered.map((s) => ({ id: s.id, teacherId: Number(selectedTeacher) }));

    const result = await scheduleApi.update(payload);
    if (result.ok) {
      queryClient.invalidateQueries({ queryKey: ["classes", id, "schedules"] });
    } else {
      addToast({ color: "danger", title: "Lỗi!", description: result.message });
    }

    setSelectedKeys(new Set());
    setSelectedTeacher(null);
    teacherModal.onClose();
    deleteDialog.onClose();
  };

  const dialog = useMemo(() => {
    switch (action) {
      case "changeShift":
        return {
          title: "Đổi ca học",
          message: "Bạn chắc chắn muốn báo đổi ca học cho các buổi học này",
          onDelete: handleUpdateShift,
          btnText: "Đổi",
        };
      case "changeTeacher":
        return {
          title: "Đổi giáo viên",
          message: "Bạn chắc chắn muốn báo đổi giáo viên cho các buổi học này",
          onDelete: handleUpdateTeacher,
          btnText: "Đổi",
        };
      case "absented":
        return {
          title: "Báo vắng",
          message: "Bạn chắc chắn muốn báo vắng buổi học này",
          onDelete: handleAbsented,
          btnText: "Báo vắng",
        };
      default:
        return {
          title: "Xóa",
          message: "Bạn chắc chắn muốn xóa buổi học này",
          onDelete: handleDelete,
          btnText: "Xóa",
        };
    }
  }, [action, id, selectedKeys, selectedTeacher, selectedShift, selectedRow]);

  return (
    <div className="space-y-4">
      <ConfirmDeleteDialog
        isOpen={deleteDialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        onClose={() => {
          setSelectedShift(null);
          setSelectedTeacher(null);
          deleteDialog.onClose();
        }}
        onDelete={dialog.onDelete}
        deleteBtnText={dialog.btnText}
      />
      <Modal isOpen={shiftModal.isOpen} size="md" onOpenChange={shiftModal.onOpenChange}>
        <ModalHeader>Chọn ca học</ModalHeader>
        <ModalBody>
          <SearchShift
            onChange={(e) => {
              setSelectedShift(e);
              setAction("changeShift");
              deleteDialog.onOpen();
            }}
          />
        </ModalBody>
      </Modal>
      <Modal isOpen={teacherModal.isOpen} size="xl" onOpenChange={teacherModal.onOpenChange}>
        <ModalHeader>Chọn giáo viên</ModalHeader>
        <ModalBody>
          <SearchUser
            filters={{ status: EMPLOYEE_STATUS.active }}
            otherParams={["role=teacher"]}
            onChange={(e) => {
              setSelectedTeacher(e);
              setAction("changeTeacher");
              deleteDialog.onOpen();
            }}
          />
        </ModalBody>
      </Modal>
      <Modal
        isOpen={scheduleModal.isOpen}
        size="xl"
        onOpenChange={(open) => {
          scheduleModal.onOpenChange(open);
          if (!open) setSelectedRow(null);
        }}
      >
        <ModalHeader>Lịch học</ModalHeader>
        <ModalBody>
          <ScheduleForm
            editMode={Boolean(selectedRow)}
            defaultValues={selectedRow || {}}
            onClose={scheduleModal.onClose}
          />
        </ModalBody>
      </Modal>
      <div className="flex gap-2">
        <Button
          isDisabled={loading}
          variant="shadow"
          radius="full"
          color="primary"
          startContent={<Plus />}
          onPress={scheduleModal.onOpen}
        >
          Buổi học
        </Button>
        <HeroUiDropdown showArrow>
          <DropdownTrigger>
            <Button
              isDisabled={loading || selectedKeys.size === 0}
              variant="flat"
              radius="full"
              color="default"
              className="shadow-lg"
              endContent={<ChevronDown size="16px" strokeWidth={3} />}
            >
              Thao tác
            </Button>
          </DropdownTrigger>
          <DropdownMenu variant="flat">
            <DropdownItem startContent={<User size="16px" />} onPress={teacherModal.onOpen}>
              Đổi giáo viên
            </DropdownItem>
            <DropdownItem startContent={<TimerReset size="16px" />} onPress={shiftModal.onOpen}>
              Đổi ca học
            </DropdownItem>
          </DropdownMenu>
        </HeroUiDropdown>
      </div>
      <TableProvider
        value={{
          selectedKeys,
          setSelectedKeys,
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
          isLoading={loading}
          disabledKeys={schedules.map((s) => dataLessonCheck?.result?.[s.id]?.total && s.id.toString())}
        />
      </TableProvider>
    </div>
  );
};

export default ClassSchedule;
