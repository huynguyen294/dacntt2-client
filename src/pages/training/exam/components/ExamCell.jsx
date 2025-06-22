/* eslint-disable no-unused-vars */
import { useTableContext } from "@/components/common";
import { DATE_FORMAT, getCode } from "@/constants";
import { useNavigate } from "@/hooks";
import { displayDate } from "@/utils";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";

const ExamCell = ({ rowData, columnKey, rowIndex, onDelete = (id) => {} }) => {
  const { getRowIndex } = useTableContext();
  const navigate = useNavigate();

  let cellValue = rowData[columnKey];

  const dateFields = ["createdAt", "date", "lastUpdatedAt"];
  if (dateFields.includes(columnKey)) cellValue = displayDate(cellValue);
  if (columnKey === "index") cellValue = getRowIndex(rowIndex + 1);
  if (columnKey === "code") cellValue = getCode("exam", rowData.id);
  if (columnKey === "time") cellValue = cellValue.slice(0, 5);

  switch (columnKey) {
    case "actions":
      return (
        <div className="relative flex items-center justify-center">
          <Tooltip content="Sửa kỳ thi">
            <Button
              onPress={() => navigate(`/exams/edit/${rowData.id}`)}
              size="sm"
              isIconOnly
              radius="full"
              variant="light"
            >
              <Edit size="18px" />
            </Button>
          </Tooltip>
          <Tooltip color="danger" content="Xóa kỳ thi">
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

export default ExamCell;
