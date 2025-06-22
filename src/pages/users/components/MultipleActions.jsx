import { Button } from "@heroui/button";
import { Modal, useTableContext } from "@/components/common";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { ChevronDown } from "lucide-react";
import { useParams } from "react-router";
import { EMPLOYEE_ROLES } from "@/constants";
import { ClassAssignment, ConfirmDeleteDialog } from "@/components";
import { ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/apis";
import { useState } from "react";

const MultipleActions = () => {
  const queryClient = useQueryClient();
  const { selectedKeys, setSelectedKeys } = useTableContext();
  const { role } = useParams();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const deleteDialog = useDisclosure();

  const handleUpdateStatus = async () => {
    console.log(selectedKeys);
  };

  const handleDelete = async () => {
    if (!selectedKeys.size === 0) return;
    const result = await userApi.deleteMany([...selectedKeys]);
    if (result.ok) {
      queryClient.invalidateQueries({ queryKey: [userApi.key] });
      setSelectedKeys(new Set([]));
    } else {
      addToast({ color: "danger", title: "Lỗi!", description: result.message });
    }
    deleteDialog.onClose();
  };

  return (
    <>
      <ConfirmDeleteDialog
        title="Xóa người dùng"
        message="Những người dùng này sẽ bị xóa vĩnh viễn khỏi hệ thống."
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        onDelete={handleDelete}
      />
      <Modal size="6xl" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
        <ModalHeader></ModalHeader>
        <ModalBody>
          <ClassAssignment
            studentIds={[...selectedKeys]}
            isSingleMode={[...selectedKeys].length === 1}
            onDone={() => {
              addToast({ title: "Thành công!", description: "Đã thêm các học sinh vào lớp" });
              queryClient.invalidateQueries({ queryKey: ["classes"] });
              queryClient.invalidateQueries({ queryKey: ["users"] });
              onClose();
            }}
          />
        </ModalBody>
      </Modal>
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
          <DropdownItem color="danger" key="delete" onPress={deleteDialog.onOpen}>
            Xóa
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default MultipleActions;
