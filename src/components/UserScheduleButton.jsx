import TimetableFilter from "./TimetableFilter";
import TimeTable from "./TimeTable";
import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal";
import { useTimetable } from "@/hooks";
import { Calendar1 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const UserScheduleButton = ({
  studentId,
  teacherId,
  classId,
  withFilter,
  classNames = { button: "", icon: "" },
  iconSize = "16px",
}) => {
  const { onClose, onOpen, onOpenChange, isOpen } = useDisclosure();

  const ScheduleModal = ({ onClose, onOpenChange }) => {
    const [value, setValue] = useState({});
    const timetable = useTimetable({ generalMode: true, studentId, teacherId, classId, ...value });

    return (
      <Modal isOpen isKeyboardDismissDisabled size="6xl" onOpenChange={onOpenChange} scrollBehavior="inside">
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Thời gian biểu</ModalHeader>
              <ModalBody>
                {withFilter && <TimetableFilter value={value} onChange={setValue} />}
                <TimeTable timeTable={timetable} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };

  return (
    <>
      {isOpen && <ScheduleModal onClose={onClose} onOpenChange={onOpenChange} />}
      <Button
        size="sm"
        isIconOnly
        variant="light"
        radius="full"
        className={classNames.button}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpen();
        }}
      >
        <Calendar1 size={iconSize} className={cn("text-foreground-700", classNames.icon)} />
      </Button>
    </>
  );
};

export default UserScheduleButton;
