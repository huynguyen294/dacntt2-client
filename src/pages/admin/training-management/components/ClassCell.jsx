/* eslint-disable no-unused-vars */
import { useTableContext } from "@/components/common";
import { COURSE_LEVELS } from "@/constants";
import { useNavigate } from "@/hooks";
import { displayDate, localeString, shiftFormat, timeFormat } from "@/utils";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { useDisclosure } from "@heroui/modal";
import { Tooltip } from "@heroui/tooltip";
import { Edit, Eye, Trash2 } from "lucide-react";
import ClassDetailModal from "./ClassDetailModal";

const ClassCell = ({ dataRefs, rowData, columnKey, rowIndex, onDelete = (id) => {} }) => {
  const { getRowIndex } = useTableContext();
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const navigate = useNavigate();

  const { users, shifts, courses, students } = dataRefs || { users: {}, shifts: {}, courses: {}, students: [] };

  let cellValue = rowData[columnKey];

  const dateFields = ["createdAt", "openingDay", "closingDay", "lastUpdatedAt"];
  if (dateFields.includes(columnKey)) cellValue = displayDate(cellValue);
  if (columnKey === "index") cellValue = getRowIndex(rowIndex + 1);
  if (columnKey === "tuitionFee") cellValue = localeString(cellValue) + "đ";
  if (columnKey === "level") cellValue = COURSE_LEVELS[cellValue];
  if (columnKey === "teacherId") cellValue = users[cellValue].name || "";
  if (columnKey === "courseId") cellValue = courses[cellValue].name || "";
  if (columnKey === "numberOfStudents") cellValue = `${students[rowData.id].length}/${cellValue}`;
  if (columnKey === "shiftId") cellValue = `${shifts[cellValue].name} (${shiftFormat(shifts[cellValue])})`;

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
          {isOpen && (
            <ClassDetailModal rowData={{ ...rowData, users, shifts, courses, students }} onOpenChange={onOpenChange} />
          )}
          <Tooltip content="Chi tiết">
            <Button onPress={onOpen} size="sm" isIconOnly radius="full" variant="light">
              <Eye size="19px" />
            </Button>
          </Tooltip>
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
