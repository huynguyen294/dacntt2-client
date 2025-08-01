import { useTableContext } from "@/components/common";
import { COURSE_LEVELS, DATE_FORMAT, getCode } from "@/constants";
import { useNavigate } from "@/hooks";
import { displayDate, localeString } from "@/utils";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";

const CourseCell = ({ rowData, columnKey, rowIndex, onDelete = (id) => {} }) => {
  const { getRowIndex } = useTableContext();
  const navigate = useNavigate();

  let cellValue = rowData[columnKey];

  const dateFields = ["createdAt", "dateOfBirth", "lastUpdatedAt"];
  if (dateFields.includes(columnKey)) cellValue = displayDate(cellValue);
  if (columnKey === "index") cellValue = getRowIndex(rowIndex + 1);
  if (columnKey === "code") cellValue = getCode("course", rowData.id);
  if (columnKey === "tuitionFee") cellValue = localeString(cellValue) + "đ";
  if (columnKey === "level") cellValue = COURSE_LEVELS[cellValue];

  switch (columnKey) {
    case "status": {
      const color = cellValue === "Đang mở" ? "success" : cellValue === "Tạm đóng" ? "warning" : "default";
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
              onPress={() => navigate(`/courses/edit/${rowData.id}`)}
              size="sm"
              isIconOnly
              radius="full"
              variant="light"
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

export default CourseCell;
