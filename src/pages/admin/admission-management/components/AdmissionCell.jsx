/* eslint-disable no-unused-vars */
import { useTableContext } from "@/components/common";
import { DATE_FORMAT } from "@/constants";
import { useNavigate } from "@/hooks";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";

const AdmissionCell = ({ rowData, columnKey, rowIndex, onDelete = (id) => {} }) => {
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
    case "status": {
      return (
        <Chip size="sm" variant="flat">
          {cellValue}
        </Chip>
      );
    }
    case "actions":
      return (
        <div className="relative flex items-center justify-center">
          <Tooltip content="Sửa ứng viên">
            <Button
              onPress={() => navigate(`/admin/certificates/edit/${rowData.id}`)}
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
