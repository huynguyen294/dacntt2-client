import { Button } from "@heroui/button";
import { useTableContext } from "@/components/common";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { ChevronDown } from "lucide-react";
import { useParams } from "react-router";
import { EMPLOYEE_ROLES } from "@/constants";

const MultipleActions = () => {
  const { selectedKeys } = useTableContext();
  const { role } = useParams();

  const handleUpdateStatus = async () => {
    console.log(selectedKeys);
  };

  const handleUpdateClass = async () => {
    console.log(selectedKeys);
  };

  const handleDelete = async () => {
    console.log(selectedKeys);
  };

  return (
    <Dropdown showArrow>
      <DropdownTrigger>
        <Button size="sm" variant="flat" className="font-semibold min-w-fit" endContent={<ChevronDown size="13px" />}>
          Thao tác nhiều
        </Button>
      </DropdownTrigger>
      <DropdownMenu disallowEmptySelection closeOnSelect={false} variant="flat">
        {role === "student" && (
          <DropdownItem key="delete" onPress={handleUpdateClass}>
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
  );
};

export default MultipleActions;
