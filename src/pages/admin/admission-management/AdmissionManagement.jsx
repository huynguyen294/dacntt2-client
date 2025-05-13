/* eslint-disable react-hooks/exhaustive-deps */
import AdmissionCell from "./components/AdmissionCell";
import { ModuleLayout } from "@/layouts";
import { admissionManagementBreadcrumbItems } from "./constants";
import { useTable } from "@/hooks";
import { Table, TableFooter, TableHeader, TableProvider } from "@/components/common";
import { ConfirmDeleteDialog } from "@/components";
import { useDisclosure } from "@heroui/modal";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { studentConsultationApi } from "@/apis";

const AdmissionManagement = () => {
  const queryClient = useQueryClient();
  const table = useTable({ allColumns: columns, defaultSelectedColumns });
  const { pager, filters, debounceQuery, order, setPager } = table;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedId, setSelectedId] = useState(null);

  const queryFilterKey = `p=${pager.page},ps=${pager.pageSize},q=${debounceQuery},o=${order.order},ob=${order.orderBy},ca=${filters.createdAt}`;
  const { isLoading, data, isSuccess } = useQuery({
    queryKey: ["student-consultation", queryFilterKey],
    queryFn: () => studentConsultationApi.get(pager, order, debounceQuery, filters),
  });

  const handleDeleteCertificate = async () => {
    if (!selectedId) return;

    const result = await studentConsultationApi.delete(selectedId);
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
    <ModuleLayout breadcrumbItems={admissionManagementBreadcrumbItems}>
      <TableProvider value={table}>
        <div className="px-2 sm:px-10">
          <ConfirmDeleteDialog
            title="Xóa ứng viên"
            message="Ứng viên này sẽ bị xóa vĩnh viễn khỏi hệ thống."
            isOpen={isOpen}
            onClose={onClose}
            onDelete={handleDeleteCertificate}
          />
          <div className="flex justify-between">
            <h3 className="text-2xl font-bold">
              Danh sách ứng viên{" "}
              <span className="bg-default-100 px-2 py-1 rounded-full text-[13px] font-normal ml-1">{pager.total}</span>
            </h3>
          </div>
          <TableHeader
            filter={<div></div>}
            addBtnPath={`/admin/register-admission`}
            rowSize={data?.rows?.length || 0}
          />
        </div>
        <Table
          isLoading={isLoading}
          rows={data?.rows || []}
          className="px-2 sm:px-10"
          renderCell={(row, columnKey, index) => (
            <AdmissionCell
              rowData={row}
              columnKey={columnKey}
              rowIndex={index}
              onDelete={(id) => {
                setSelectedId(id);
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
  { name: "Tên ứng viên", uid: "name" },
  { name: "Email", uid: "email" },
  { name: "Ngày sinh", uid: "dateOfBirth" },
  { name: "Giới tính", uid: "gender" },
  { name: "Số điện thoại", uid: "phoneNumber" },
  { name: "Trạng thái", uid: "status" },
  { name: "Nguồn", uid: "source" },
  { name: "Địa chỉ", uid: "address" },
  { name: "Tư vấn viên", uid: "consultantId" },
  { name: "Khóa học dự kiến", uid: "expectedCourseId" },
  { name: "Lớp dự kiến", uid: "expectedClassId" },
  { name: "Địa chỉ", uid: "address" },
  { name: "Địa chỉ", uid: "address" },
  { name: "Ghi chú", uid: "note" },
  { name: "Ngày đăng ký", uid: "createdAt" },
  { name: "Ngày cập nhật gần nhất", uid: "lastUpdatedAt" },
];

const defaultSelectedColumns = [
  "index",
  "name",
  "email",
  "status",
  "consultantId",
  "expectedClassId",
  "lastUpdatedAt",
  "actions",
];

export default AdmissionManagement;
