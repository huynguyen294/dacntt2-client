/* eslint-disable no-unused-vars */
import { useTableContext } from "@/components/common";
import { getCode } from "@/constants";
import { useNavigate } from "@/hooks";
import { convertImageSrc, displayDate } from "@/utils";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Edit, Trash2 } from "lucide-react";

const CertificateCell = ({ rowData, columnKey, rowIndex, onDelete = (id) => {} }) => {
  const { getRowIndex } = useTableContext();
  const navigate = useNavigate();

  let cellValue = rowData[columnKey];

  const dateFields = ["createdAt", "lastUpdatedAt"];
  if (columnKey === "index") cellValue = getRowIndex(rowIndex + 1);
  if (columnKey === "code") cellValue = getCode("certificate", rowData.id);
  if (dateFields.includes(columnKey)) cellValue = displayDate(cellValue);

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
          <Tooltip content="Sửa chứng chỉ">
            <Button
              onPress={() => navigate(`/certificates/edit/${rowData.id}`)}
              size="sm"
              isIconOnly
              radius="full"
              variant="light"
            >
              <Edit size="18px" />
            </Button>
          </Tooltip>
          <Tooltip color="danger" content="Xóa chứng chỉ">
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

export default CertificateCell;
