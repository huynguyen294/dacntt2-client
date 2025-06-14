/* eslint-disable no-unused-vars */
import ClassDetailModal from "./ClassDetailModal";
import { useTableContext } from "@/components/common";
import { COURSE_LEVELS } from "@/constants";
import { useMetadata, useNavigate } from "@/hooks";
import { displayDate, getClassStatus, localeString, shiftFormat } from "@/utils";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { useDisclosure } from "@heroui/modal";
import { Tooltip } from "@heroui/tooltip";
import { Edit, Info, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { useAppStore } from "@/state";
import { Avatar } from "@heroui/avatar";

const ClassCell = ({ dataRefs, rowData, columnKey, rowIndex, onDelete = (id) => {} }) => {
  const { getRowIndex } = useTableContext();
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const { shiftObj } = useMetadata();
  const navigate = useNavigate();

  const { users = {}, courses = {}, studentCounts = {} } = dataRefs || {};

  const teacher = users[rowData.teacherId];
  const course = courses[rowData.courseId];
  const shift = shiftObj && shiftObj[rowData.shiftId];
  const studentCount = Number(studentCounts[rowData.id]?.total || 0);

  const user = useAppStore("user");
  let cellValue = rowData[columnKey];

  const dateFields = ["createdAt", "openingDay", "closingDay", "lastUpdatedAt"];
  if (dateFields.includes(columnKey)) cellValue = displayDate(cellValue);
  if (columnKey === "index") cellValue = getRowIndex(rowIndex + 1);
  if (columnKey === "tuitionFee") cellValue = localeString(cellValue) + "đ";
  if (columnKey === "level") cellValue = COURSE_LEVELS[cellValue];
  if (columnKey === "courseId") cellValue = course?.name || "";
  if (columnKey === "numberOfStudents") cellValue = `${studentCount || 0}/${cellValue}`;
  if (columnKey === "shiftId") cellValue = `${shift?.name} (${shiftFormat(shift)})`;
  if (columnKey === "teacherId") {
    cellValue = teacher?.name || "";
    return (
      <Chip avatar={<Avatar src={teacher?.imageUrl} />} variant="flat">
        {cellValue}
      </Chip>
    );
  }

  switch (columnKey) {
    case "status": {
      const status = getClassStatus(rowData);
      return (
        <Chip size="sm" variant="flat" color={status.color}>
          {status.text}
        </Chip>
      );
    }
    case "actions":
      return (
        <div className="relative flex items-center justify-center">
          {isOpen && (
            <ClassDetailModal
              rowData={rowData}
              refs={{ teacher, course, shift, studentCount }}
              onOpenChange={onOpenChange}
            />
          )}
          {["admin", "finance-officer"].includes(user.role) ? (
            <>
              <Tooltip content="Đến trang lớp học">
                <Button
                  onPress={() => navigate(`/classes/${rowData.id}`)}
                  size="sm"
                  isIconOnly
                  radius="full"
                  variant="light"
                >
                  <SquareArrowOutUpRight size="18px" />
                </Button>
              </Tooltip>
              <Tooltip content="Sửa lớp học">
                <Button
                  onPress={() => navigate(`/classes/edit/${rowData.id}`)}
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
            </>
          ) : (
            <Tooltip content="Xem chi tiết">
              <Button onPress={onOpen} size="sm" isIconOnly radius="full" variant="light">
                <Info size="18px" />
              </Button>
            </Tooltip>
          )}
        </div>
      );

    default:
      return cellValue;
  }
};

export default ClassCell;
