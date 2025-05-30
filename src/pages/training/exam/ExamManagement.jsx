/* eslint-disable react-hooks/exhaustive-deps */
import { ModuleLayout } from "@/layouts";
import { examsManagementBreadcrumbItems } from "../constants";
import { useTable } from "@/hooks";
import { Table, TableFooter, TableHeader, TableProvider } from "@/components/common";
import { ConfirmDeleteDialog } from "@/components";
import { useDisclosure } from "@heroui/modal";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { examApi } from "@/apis";
import ExamFilter from "./components/ExamFilter";
import ExamCell from "./components/ExamCell";

const ExamManagement = () => {
  const queryClient = useQueryClient();
  const table = useTable({ allColumns: columns, defaultSelectedColumns });
  const { pager, filters, debounceQuery, order, setPager } = table;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedExamId, setSelectedExamId] = useState(null);

  const queryFilterKey = `p=${pager.page},ps=${pager.pageSize},q=${debounceQuery},o=${order.order},ob=${order.orderBy},ca=${filters.createdAt},st=${filters.status}`;
  const { isLoading, data, isSuccess } = useQuery({
    queryKey: ["exams", queryFilterKey],
    queryFn: () => examApi.get(pager, order, debounceQuery, filters),
  });

  const handleDeleteExam = async () => {
    if (!selectedExamId) return;
    const result = await examApi.delete(selectedExamId);
    if (!result.ok) {
      addToast({ color: "danger", title: "Xóa thất bại!", description: result.message });
    } else {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    }
    onClose();
  };

  useEffect(() => {
    if (isSuccess && data?.pager) {
      setPager(data.pager);
    }
  }, [isSuccess, data]);

  return (
    <ModuleLayout breadcrumbItems={examsManagementBreadcrumbItems}>
      <TableProvider value={table}>
        <div className="px-2 sm:px-10">
          <ConfirmDeleteDialog
            title="Xóa kỳ thi"
            message="Kỳ thi này sẽ bị xóa vĩnh viễn khỏi hệ thống."
            isOpen={isOpen}
            onClose={onClose}
            onDelete={handleDeleteExam}
          />
          <div className="flex justify-between">
            <h3 className="text-2xl font-bold">
              Danh sách kỳ thi{" "}
              <span className="bg-default-100 px-2 py-1 rounded-full text-[13px] font-normal ml-1">{pager.total}</span>
            </h3>
          </div>
          <TableHeader
            searchPlaceholder="Nhập tên kỳ thi"
            filter={<ExamFilter />}
            addBtnPath={`/exams/add`}
            rowSize={data?.rows?.length || 0}
          />
        </div>
        <Table
          isLoading={isLoading}
          rows={data?.rows || []}
          className="px-2 sm:px-10"
          renderCell={(row, columnKey, index) => (
            <ExamCell
              rowData={row}
              columnKey={columnKey}
              rowIndex={index}
              onDelete={(id) => {
                setSelectedExamId(id);
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
  { name: "Tên kỳ thi", uid: "name" },
  { name: "Ngày thi", uid: "date" },
  { name: "Giờ thi", uid: "time" },
  { name: "Địa điểm", uid: "location" },
  { name: "Số học sinh dự thi", uid: "numberOfStudents" },
  { name: "Ngày cập nhật gần nhất", uid: "lastUpdatedAt" },
  { name: "Ngày tạo", uid: "createdAt" },
  { name: "Thao tác", uid: "actions", disableSort: true },
];

const defaultSelectedColumns = ["index", "name", "date", "time", "location", "createdAt", "actions"];

export default ExamManagement;
