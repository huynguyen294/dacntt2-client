/* eslint-disable no-unused-vars */
import { useTableContext } from "@/components/common";
import { COURSE_LEVELS, DATE_FORMAT } from "@/constants";
import { useNavigate } from "@/hooks";
import { localeString, timeFormat } from "@/utils";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";

const ClassCell = ({ dataRefs, rowData, columnKey, rowIndex, onDelete = (id) => {} }) => {
  const { getRowIndex } = useTableContext();
  const navigate = useNavigate();

  const { users, shifts, courses } = dataRefs || { users: {}, shifts: {}, courses: {} };

  let cellValue = rowData[columnKey];

  const dateFields = ["createdAt", "openingDay", "closingDay", "lastUpdatedAt"];
  if (dateFields.includes(columnKey)) {
    if (cellValue) cellValue = format(new Date(cellValue), DATE_FORMAT);
  }
  if (columnKey === "index") {
    cellValue = getRowIndex(rowIndex + 1);
  }
  if (columnKey === "tuitionFee") {
    cellValue = localeString(cellValue) + "đ";
  }
  if (columnKey === "level") {
    cellValue = COURSE_LEVELS[cellValue];
  }
  if (columnKey === "teacherId") {
    cellValue = users[cellValue].name || "";
  }
  if (columnKey === "courseId") {
    cellValue = courses[cellValue].name || "";
  }
  if (columnKey === "shiftId") {
    let text = "";
    if (shifts[cellValue]) {
      text = `${shifts[cellValue].name} (${timeFormat(shifts[cellValue].startTime)} - ${timeFormat(
        shifts[cellValue].endTime
      )})`;
    }

    cellValue = text;
  }

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
          <Tooltip content="Sửa lớp học">
            <Button
              onPress={() => navigate(`/admin/classes/edit/${rowData.id}`)}
              size="sm"
              isIconOnly
              radius="full"
              variant="light"
            >
              <Edit size="18px" />
            </Button>
          </Tooltip>
          <Tooltip color="danger" content="Xóa lớp học">
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

export default ClassCell;
