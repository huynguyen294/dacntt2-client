import { UserDetailModal } from "@/components";
import { useTableContext } from "@/components/common";
import { DATE_FORMAT, ROLE_PALLET } from "@/constants";
import { useNavigate } from "@/hooks";
import { alpha, convertImageSrc, displayDate, localeString } from "@/utils";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { useDisclosure } from "@heroui/modal";
import { Tooltip } from "@heroui/tooltip";
import { User } from "@heroui/user";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useParams } from "react-router";

const TableCell = ({ rowData, columnKey, rowIndex, onDelete = () => {} }) => {
  const navigate = useNavigate();
  const { role } = useParams();
  const { getRowIndex } = useTableContext();
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  let cellValue = rowData[columnKey];

  const dateFields = ["createdAt", "dateOfBirth", "lastUpdatedAt"];
  if (dateFields.includes(columnKey)) cellValue = displayDate(cellValue);
  if (columnKey === "index") cellValue = getRowIndex(rowIndex + 1);
  if (columnKey === "salary") cellValue = localeString(cellValue) + "đ";
  if (columnKey === "tuition") cellValue = localeString(5000000) + "đ";

  switch (columnKey) {
    case "user":
      return (
        <User
          avatarProps={{
            radius: "lg",
            src: (rowData.imageUrl || "").replace("upload", "upload/w_100"),
          }}
          description={rowData.email}
          name={rowData.name}
        >
          {rowData.email}
        </User>
      );
    case "role":
      return (
        <Chip
          className="capitalize bg-[var(--current-color)]"
          size="sm"
          variant="flat"
          style={{ "--current-color": alpha(ROLE_PALLET[cellValue], 0.2) }}
        >
          {cellValue}
        </Chip>
      );
    case "classes":
      if (rowData.role === "student" || rowData.status === "Đang làm việc") {
        return (
          <Chip className="capitalize" size="sm" variant="flat">
            Tiếng Anh 1
          </Chip>
        );
      }
      return null;
    case "status": {
      const mapStatus = {
        "Đang làm việc": "success",
        "Tạm nghỉ việc": "warning",
        "Đã nghỉ việc": "danger",
      };
      return (
        cellValue && (
          <Chip size="sm" variant="flat" color={mapStatus[cellValue]}>
            {cellValue}
          </Chip>
        )
      );
    }
    case "actions":
      return (
        <div className="relative flex items-center justify-center">
          {isOpen && <UserDetailModal user={rowData} onOpenChange={onOpenChange} />}
          <Tooltip content="Chi tiết">
            <Button onPress={onOpen} size="sm" isIconOnly radius="full" variant="light">
              <Eye size="19px" />
            </Button>
          </Tooltip>
          <Tooltip content="Chỉnh sửa">
            <Button
              onPress={() => {
                navigate(
                  `/admin/user-management/${role}/edit/${rowData.id}?role=${
                    rowData.role === "admin" ? "_" : rowData.role
                  }`
                );
              }}
              size="sm"
              isIconOnly
              radius="full"
              variant="light"
            >
              <Edit size="18px" />
            </Button>
          </Tooltip>
          <Tooltip color="danger" content="Xóa">
            <Button
              onClick={(e) => e.stopPropagation()}
              onPress={() => {
                let imageId;
                if (rowData.imageUrl) imageId = convertImageSrc(rowData.imageUrl).id;
                onDelete(rowData.id, imageId);
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
        </div>
      );
    default:
      return cellValue;
  }
};

export default TableCell;
