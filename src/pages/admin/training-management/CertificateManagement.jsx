/* eslint-disable react-hooks/exhaustive-deps */
import { ModuleLayout } from "@/layouts";
import { certificatesManagementBreadcrumbItems } from "./constants";
import { useTable } from "@/hooks";
import { Table, TableFooter, TableHeader, TableProvider } from "@/components/common";
import { ConfirmDeleteDialog } from "@/components";
import { useDisclosure } from "@heroui/modal";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCertificates } from "@/apis/certificate";

const CertificateManagement = () => {
  const table = useTable({ allColumns: columns, defaultSelectedColumns });
  const { pager, filters, debounceQuery, order, setPager } = table;
  const { isOpen, onClose } = useDisclosure();

  const queryFilterKey = `p=${pager.page},ps=${pager.pageSize},q=${debounceQuery},o=${order.order},ob=${order.orderBy},ca=${filters.createdAt}`;
  const { isLoading, data, isSuccess } = useQuery({
    queryKey: ["certificates", queryFilterKey],
    queryFn: () => getCertificates(pager, order, debounceQuery, filters),
  });

  const handleDeleteCertificate = async () => {};

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
        <Table isLoading={isLoading} rows={data?.certificates || []} className="px-2 sm:px-10" />
        <div className="px-2 sm:px-10 pb-6 flex justify-between">
          <TableFooter />
        </div>
      </TableProvider>
    </ModuleLayout>
  );
};

const columns = [
  { name: "STT", uid: "index", disableSort: true },
  { name: "Tên chứng chỉ", uid: "name" },
  { name: "Số học sinh được cấp", uid: "numOfStudent" },
  { name: "Ngày cập nhật gần nhất", uid: "lastUpdatedAt", disableSort: true },
  { name: "Người cập nhật", uid: "lastUpdatedBy", disableSort: true },
  { name: "Thao tác", uid: "actions", disableSort: true },
];

const defaultSelectedColumns = ["index", "name", "numOfStudent", "lastUpdatedAt", "lastUpdatedBy", "actions"];

export default CertificateManagement;
