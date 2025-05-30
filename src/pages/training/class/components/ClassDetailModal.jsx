import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { useMetadata } from "@/hooks";
import ClassDetail from "./ClassDetail";
import StudentList from "./StudentList";

const ClassDetailModal = ({ rowData, onOpenChange, refs }) => {
  const { shiftObj } = useMetadata();

  return (
    <>
      <Modal size="5xl" isOpen={true} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Thông tin chi tiết</ModalHeader>
              <ModalBody>
                <div className="h-[80dvh] sm:h-[75dvh] overflow-y-auto space-y-4 pb-10">
                  <div className={"rounded-large border p-3 sm:p-4 py-6 gap-4"}>
                    <p className="font-bold">Thông tin lớp học</p>
                    <ClassDetail className="mt-4" data={rowData} refs={{ ...refs, shift: shiftObj[rowData.shiftId] }} />
                  </div>

                  <div className="rounded-large border p-3 sm:p-4 py-6 gap-4">
                    <p className="font-bold">Danh sách học viên</p>
                    <StudentList classId={rowData.id} />
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
