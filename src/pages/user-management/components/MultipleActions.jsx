import { Button } from "@heroui/button";
import { useTableContext } from "@/components/common";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { ChevronDown } from "lucide-react";
import { useParams } from "react-router";
import { EMPLOYEE_ROLES } from "@/constants";
import { ClassAssignment } from "@/components";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useQueryClient } from "@tanstack/react-query";

const MultipleActions = () => {
  const queryClient = useQueryClient();
  const { selectedKeys } = useTableContext();
  const { role } = useParams();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleUpdateStatus = async () => {
    console.log(selectedKeys);
  };

  const handleDelete = async () => {
    console.log(selectedKeys);
  };

  return (
    <>
      {isOpen && (
        <Modal size="5xl" isOpen={true} onOpenChange={onOpenChange} scrollBehavior="inside">
          <ModalContent>
            {() => (
              <>
                <ModalHeader></ModalHeader>
                <ModalBody>
                  <ClassAssignment
                    studentIds={[...selectedKeys]}
                    onDone={() => {
                      addToast({ title: "Thành công!", description: "Đã thêm các học sinh vào lớp" });
                      queryClient.invalidateQueries({ queryKey: ["classes"] });
                      [...selectedKeys].forEach((id) => {
                        queryClient.invalidateQueries({ queryKey: ["users", "detail", Number(id)] });
                      });
                      onClose();
                    }}
                  />
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
      <Dropdown showArrow>
        <DropdownTrigger>
          <Button size="sm" variant="flat" className="font-semibold min-w-fit" endContent={<ChevronDown size="13px" />}>
            Thao tác nhiều
          </Button>
        </DropdownTrigger>
        <DropdownMenu disallowEmptySelection variant="flat">
          {role === "student" && (
            <DropdownItem key="classAssignment" onPress={onOpen}>
              Xếp lớp
            </DropdownItem>
          )}
          {EMPLOYEE_ROLES.includes(role) && (
            <DropdownItem key="delete" onPress={handleUpdateStatus}>
              Cập nhật trạng thái
            </DropdownItem>
          )}
          <DropdownItem color="danger" key="delete" onPress={handleDelete}>
            Xóa
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default MultipleActions;
