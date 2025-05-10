/* eslint-disable no-unused-vars */
import { useTableContext } from "@/components/common";
import { DATE_FORMAT } from "@/constants";
import { useNavigate } from "@/hooks";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";

const CertificateCell = ({ rowData, columnKey, rowIndex, onDelete = (id) => {} }) => {
  const { getRowIndex } = useTableContext();
  const navigate = useNavigate();

  let cellValue = rowData[columnKey];

  const dateFields = ["createdAt", "lastUpdatedAt"];
  if (dateFields.includes(columnKey)) {
    if (cellValue) cellValue = format(new Date(cellValue), DATE_FORMAT);
  }
  if (columnKey === "index") {
    cellValue = getRowIndex(rowIndex + 1);
  }

  switch (columnKey) {
    case "image": {
      return (
        <div className="w-12 h-16">
          <img src={rowData.imageUrl} className="w-12 h-16 rounded" />
          {cellValue}
        </div>
      );
    }
    case "status": {
      const color = cellValue === "Hoạt động" ? "success" : cellValue === "Tạm dừng" ? "warning" : "default";
      return (
        <Chip size="sm" variant="flat" color={color}>
          {cellValue}
        </Chip>
      );
    }
    case "actions":
      return (
        <div className="relative flex items-center justify-center">
          <Tooltip content="Sửa khóa học">
            <Button
              onPress={() => navigate(`/admin/courses/edit/${rowData.id}`)}
              size="sm"
              isIconOnly
              radius="full"
              variant="light"
              isDisabled
            >
              <Edit size="18px" />
            </Button>
          </Tooltip>
          <Tooltip color="danger" content="Xóa khóa học">
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

export default CertificateCell;
