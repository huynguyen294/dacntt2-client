/* eslint-disable react-hooks/exhaustive-deps */
import ClassCell from "./components/ClassCell";
import { ModuleLayout } from "@/layouts";
import { classesManagementBreadcrumbItems } from "../constants";
import { useTable } from "@/hooks";
import { Table, TableFooter, TableHeader, TableProvider } from "@/components/common";
import { ConfirmDeleteDialog } from "@/components";
import { useDisclosure } from "@heroui/modal";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { classApi } from "@/apis";
import { addToast } from "@heroui/toast";
import { useAppStore } from "@/state";
import ClassFilter from "./components/ClassFilter";
import { ORDER_BY_NAME } from "@/constants";

const ClassManagement = () => {
  const queryClient = useQueryClient();
  const table = useTable({ allColumns: columns, defaultSelectedColumns, defaultOrder, Api: classApi });
  const { pager, filters, debounceQuery, order, setPager } = table;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedClassId, setSelectedClassId] = useState(null);

  const queryFilterKey = `p=${pager.page},ps=${pager.pageSize},q=${debounceQuery},o=${order.order},ob=${order.orderBy}`;
  const { isLoading, data, isSuccess } = useQuery({
    queryKey: ["classes", queryFilterKey, JSON.stringify(filters)],
    queryFn: () => classApi.get(pager, order, debounceQuery, filters, ["refs=true"]),
  });

  const user = useAppStore("user");

  const handleDeleteClass = async () => {
    if (!selectedClassId) return;
    const result = await classApi.delete(selectedClassId);
    if (!result.ok) {
      addToast({ color: "danger", title: "Xóa thất bại!", description: result.message });
    } else {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    }
    onClose();
  };

  useEffect(() => {
    if (isSuccess && data?.pager) {
      setPager(data.pager);
    }
  }, [isSuccess, data]);

  return (
    <ModuleLayout breadcrumbItems={classesManagementBreadcrumbItems}>
      <TableProvider value={table}>
        <div className="px-2 sm:px-10">
          <ConfirmDeleteDialog
            title="Xóa lớp học"
            message="Lớp học này sẽ bị xóa vĩnh viễn khỏi hệ thống."
            isOpen={isOpen}
            onClose={onClose}
            onDelete={handleDeleteClass}
          />
          <div className="flex justify-between">
            <h3 className="text-2xl font-bold">
              Danh sách lớp học{" "}
              <span className="bg-default-100 px-2 py-1 rounded-full text-[13px] font-normal ml-1">{pager.total}</span>
            </h3>
          </div>
          <TableHeader
            filter={<ClassFilter />}
            addBtnPath={`/classes/add`}
            rowSize={data?.rows?.length || 0}
            hideAddBtn={user?.role !== "admin"}
          />
        </div>
        <Table
          isLoading={isLoading}
          rows={data?.rows || []}
          className="px-2 sm:px-10"
          renderCell={(row, columnKey, index) => (
            <ClassCell
              dataRefs={data?.refs}
              rowData={row}
              columnKey={columnKey}
              rowIndex={index}
              onDelete={(id) => {
                setSelectedClassId(id);
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
  { name: "Mã", uid: "code", disableSort: true },
  { name: "Tên lớp học", uid: "name" },
  { name: "Giáo viên phụ trách", uid: "teacherId", disableSort: true },
  { name: "Lịch học", uid: "weekDays" },
  { name: "Khóa học", uid: "courseId", disableSort: true },
  { name: "Ca học", uid: "shiftId", disableSort: true },
  { name: "Số buổi học", uid: "numberOfLessons" },
  { name: "Số học sinh", uid: "numberOfStudents" },
  { name: "Ngày khai giảng", uid: "openingDay" },
  { name: "Ngày kết thúc", uid: "closingDay" },
  { name: "Trạng thái", uid: "status" },
  { name: "Cấp độ", uid: "level" },
  { name: "Ngày cập nhật gần nhât", uid: "lastUpdatedAt" },
  // { name: "Người cập nhật", uid: "lastUpdatedBy", disableSort: true },
  { name: "Ngày tạo", uid: "createdAt" },
  // { name: "Người tạo", uid: "createdBy" },
  { name: "Thao tác", uid: "actions", disableSort: true },
];

const defaultSelectedColumns = [
  "index",
  "code",
  "name",
  "teacherId",
  "weekDays",
  "shiftId",
  "numberOfLessons",
  "numberOfStudents",
  "openingDay",
  "closingDay",
  "status",
  "actions",
];

const defaultOrder = ORDER_BY_NAME;

export default ClassManagement;
