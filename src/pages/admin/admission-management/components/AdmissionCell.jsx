/* eslint-disable no-unused-vars */
import { useTableContext } from "@/components/common";
import { ADMISSION_STATUSES } from "@/constants";
import { useNavigate } from "@/hooks";
import { useAppStore } from "@/state";
import { displayDate } from "@/utils";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Edit, Trash2 } from "lucide-react";

const AdmissionCell = ({ rowData, refs, columnKey, rowIndex, onDelete = (id) => {} }) => {
  const { getRowIndex } = useTableContext();
  const navigate = useNavigate();

  const user = useAppStore("user");
  const { users = {}, classes = {}, courses = {} } = refs || {};

  let cellValue = rowData[columnKey];

  const dateFields = ["createdAt", "lastUpdatedAt"];
  if (dateFields.includes(columnKey)) {
    cellValue = displayDate(cellValue);
  }
  if (columnKey === "index") {
    cellValue = getRowIndex(rowIndex + 1);
  }
  if (columnKey === "consultantId") {
    cellValue = users[cellValue]?.name;
  }
  if (columnKey === "expectedClassId") {
    cellValue = classes[cellValue]?.name;
  }
  if (columnKey === "expectedCourseId") {
    cellValue = courses[cellValue]?.name;
  }

  switch (columnKey) {
    case "status": {
      let color = "default";
      if (cellValue === ADMISSION_STATUSES.accepted) color = "success";
      if (cellValue === ADMISSION_STATUSES.working) color = "warning";
      if (cellValue === ADMISSION_STATUSES.rejected) color = "danger";

      return (
        <Chip size="sm" variant="flat" color={color}>
          {cellValue}
        </Chip>
      );
    }
    case "actions":
      return (
        <div className="relative flex items-center justify-center">
          <Tooltip content="Sửa ứng viên">
            <Button
              onPress={() => navigate(`/${user.role}/register-admission?step=1&admissionId=${rowData.id}`)}
              size="sm"
              isIconOnly
              radius="full"
              variant="light"
            >
              <Edit size="18px" />
            </Button>
          </Tooltip>
          <Tooltip color="danger" content="Xóa ứng viên">
            <Button
              onClick={(e) => e.stopPropagation()}
              onPress={() => {
                let imageId;
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

export default AdmissionCell;
