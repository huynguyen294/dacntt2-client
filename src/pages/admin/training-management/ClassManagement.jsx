/* eslint-disable react-hooks/exhaustive-deps */
import { ModuleLayout } from "@/layouts";
import { classesManagementBreadcrumbItems } from "./constants";
import { useTable } from "@/hooks";
import { Table, TableFooter, TableHeader, TableProvider } from "@/components/common";
import { ConfirmDeleteDialog } from "@/components";
import { useDisclosure } from "@heroui/modal";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClasses } from "@/apis";
import ClassCell from "./components/ClassCell";

const ClassManagement = () => {
  const table = useTable({ allColumns: columns, defaultSelectedColumns });
  const { pager, filters, debounceQuery, order, setPager } = table;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedClassId, setSelectedClassId] = useState(null);

  const queryFilterKey = `p=${pager.page},ps=${pager.pageSize},q=${debounceQuery},o=${order.order},ob=${order.orderBy},ca=${filters.createdAt}`;
  const { isLoading, data, isSuccess } = useQuery({
    queryKey: ["classes", queryFilterKey],
    queryFn: () => getClasses(pager, order, debounceQuery, filters),
  });

  const handleDeleteClass = async () => {};

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
            searchPlaceholder="Nhập tên lớp học"
            filter={<div></div>}
            addBtnPath={`/admin/classes/add`}
            rowSize={data?.classes?.length || 0}
          />
        </div>
        <Table
          isLoading={isLoading}
          rows={data?.classes || []}
          className="px-2 sm:px-10"
          renderCell={(row, columnKey, index) => (
            <ClassCell
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
  { name: "Tên lớp học", uid: "name" },
  { name: "Giáo viên phụ trách", uid: "teacherId" },
  { name: "Lịch học", uid: "weekDays" },
  { name: "Khóa học", uid: "courseId" },
  { name: "Ca học", uid: "shifts" },
  { name: "Số buổi học", uid: "numberOfLessons" },
  { name: "Số học sinh tối đa", uid: "numberOfStudents" },
  { name: "Ngày khai giảng", uid: "openingDay" },
  { name: "Ngày kết thúc", uid: "closingDay" },
  { name: "Trạng thái", uid: "status" },
  { name: "Ngày cập nhật gần nhât", uid: "lastUpdatedAt" },
  // { name: "Người cập nhật", uid: "lastUpdatedBy", disableSort: true },
  { name: "Ngày tạo", uid: "createdAt" },
  // { name: "Người tạo", uid: "createdBy" },
  { name: "Thao tác", uid: "actions", disableSort: true },
];

const defaultSelectedColumns = [
  "index",
  "name",
  "teacherId",
  "weekDays",
  "shifts",
  "numberOfLessons",
  "numberOfStudents",
  "openingDay",
  "closingDay",
  "actions",
];

export default ClassManagement;
