/* eslint-disable react-hooks/exhaustive-deps */
import { ModuleLayout } from "@/layouts";
import { certificatesManagementBreadcrumbItems } from "./constants";
import { useTable } from "@/hooks";
import { Table, TableFooter, TableHeader, TableProvider } from "@/components/common";
import { ConfirmDeleteDialog } from "@/components";
import { useDisclosure } from "@heroui/modal";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCertificate, getCertificates } from "@/apis/certificate";
import CertificateCell from "./components/CertificateCell";
import { addToast } from "@heroui/toast";

const CertificateManagement = () => {
  const queryClient = useQueryClient();
  const table = useTable({ allColumns: columns, defaultSelectedColumns });
  const { pager, filters, debounceQuery, order, setPager } = table;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedCertificateId, setSelectedCertificateId] = useState(null);

  const queryFilterKey = `p=${pager.page},ps=${pager.pageSize},q=${debounceQuery},o=${order.order},ob=${order.orderBy},ca=${filters.createdAt}`;
  const { isLoading, data, isSuccess } = useQuery({
    queryKey: ["certificates", queryFilterKey],
    queryFn: () => getCertificates(pager, order, debounceQuery, filters),
  });

  const handleDeleteCertificate = async () => {
    if (!selectedCertificateId) return;
    const result = await deleteCertificate(selectedCertificateId);
    if (!result.ok) {
      addToast({ color: "danger", title: "Xóa thất bại!", description: result.message });
    } else {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
    }
    onClose();
  };

  useEffect(() => {
    if (isSuccess && data?.pager) {
      setPager(data.pager);
    }
  }, [isSuccess, data]);

  return (
    <ModuleLayout breadcrumbItems={certificatesManagementBreadcrumbItems}>
      <TableProvider value={table}>
        <div className="px-2 sm:px-10">
          <ConfirmDeleteDialog
            title="Xóa chứng chỉ"
            message="Chứng chỉ này sẽ bị xóa vĩnh viễn khỏi hệ thống."
            isOpen={isOpen}
            onClose={onClose}
            onDelete={handleDeleteCertificate}
          />
          <div className="flex justify-between">
            <h3 className="text-2xl font-bold">
              Danh sách chứng chỉ{" "}
              <span className="bg-default-100 px-2 py-1 rounded-full text-[13px] font-normal ml-1">{pager.total}</span>
            </h3>
          </div>
          <TableHeader
            searchPlaceholder="Nhập tên chứng chỉ"
            filter={<div></div>}
            addBtnPath={`/admin/certificates/add`}
            rowSize={data?.certificates?.length || 0}
          />
        </div>
        <Table
          isLoading={isLoading}
          rows={data?.certificates || []}
          className="px-2 sm:px-10"
          renderCell={(row, columnKey, index) => (
            <CertificateCell
              rowData={row}
              columnKey={columnKey}
              rowIndex={index}
              onDelete={(id) => {
                setSelectedCertificateId(id);
                onOpen();
              }}
            />
          )}
        />
        <div className="px-2 sm:px-10 pb-6 flex justify-between">
          <TableFooter />
        </div>
      </TableProvider>
    </ModuleLayout>
  );
};

const columns = [
  { name: "STT", uid: "index", disableSort: true },
  { name: "Ảnh", uid: "image" },
  { name: "Tên chứng chỉ", uid: "name" },
  { name: "Kỹ năng", uid: "skill" },
  { name: "Cấp độ", uid: "level" },
  { name: "trạng thái", uid: "status", disableSort: true },
  { name: "Số học sinh được cấp", uid: "numOfStudents" },
  { name: "Ngày cập nhật gần nhất", uid: "lastUpdatedAt", disableSort: true },
  // { name: "Người cập nhật", uid: "lastUpdatedBy", disableSort: true },
  { name: "Thao tác", uid: "actions", disableSort: true },
];

const defaultSelectedColumns = [
  "index",
  "image",
  "name",
  "skill",
  "level",
  "status",
  "numOfStudents",
  "lastUpdatedAt",
  "actions",
];

export default CertificateManagement;
