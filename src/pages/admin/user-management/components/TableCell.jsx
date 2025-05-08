import { useTableContext } from "@/components/common";
import { DATE_FORMAT, ROLE_PALLET } from "@/constants";
import { useNavigate } from "@/hooks";
import { alpha, localeString } from "@/utils";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { User } from "@heroui/user";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { useParams } from "react-router";

const TableCell = ({ rowData, columnKey, rowIndex, onDelete = () => {} }) => {
  const navigate = useNavigate();
  const { role } = useParams();
  const { pager } = useTableContext();

  let cellValue = rowData[columnKey];

  const dateFields = ["createdAt", "dateOfBirth", "lastUpdatedAt"];
  if (dateFields.includes(columnKey)) {
    if (cellValue) cellValue = format(new Date(cellValue), DATE_FORMAT);
  }
  if (columnKey === "index") {
    cellValue = rowIndex + 1 + (pager.page - 1) * pager.pageSize;
  }
  if (columnKey === "salary") {
    cellValue = localeString(cellValue) + "đ";
  }
  if (columnKey === "tuition") {
    cellValue = localeString(5000000) + "đ";
  }

  switch (columnKey) {
    case "user":
      return (
        <User avatarProps={{ radius: "lg", src: rowData.imageUrl }} description={rowData.email} name={rowData.name}>
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
          <Tooltip content="Edit user">
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
          <Tooltip color="danger" content="Delete user">
            <Button
              onClick={(e) => e.stopPropagation()}
              onPress={() => onDelete(rowData.id)}
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
