/* eslint-disable react-hooks/exhaustive-deps */
import CourseCell from "./components/CourseCell";
import CourseFilter from "./components/CourseFilter";
import { ModuleLayout } from "@/layouts";
import { coursesManagementBreadcrumbItems } from "../constants";
import { useTable } from "@/hooks";
import { Table, TableFooter, TableHeader, TableProvider } from "@/components/common";
import { ConfirmDeleteDialog } from "@/components";
import { useDisclosure } from "@heroui/modal";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { courseApi } from "@/apis";

const CourseManagement = () => {
  const queryClient = useQueryClient();
  const table = useTable({ allColumns: columns, defaultSelectedColumns, Api: courseApi });
  const { pager, filters, debounceQuery, order, setPager } = table;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const queryFilterKey = `p=${pager.page},ps=${pager.pageSize},q=${debounceQuery},o=${order.order},ob=${
    order.orderBy
  },ca=${filters.createdAt},st=${filters.status},st=${JSON.stringify(filters.level)}`;

  const { isLoading, data, isSuccess } = useQuery({
    queryKey: ["courses", queryFilterKey],
    queryFn: () => courseApi.get(pager, order, debounceQuery, filters),
  });

  const handleDeleteCourse = async () => {
    if (!selectedCourseId) return;
    const result = await courseApi.delete(selectedCourseId);
    if (!result.ok) {
      addToast({ color: "danger", title: "Xóa thất bại!", description: result.message });
    } else {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    }
    onClose();
  };

  useEffect(() => {
    if (isSuccess && data?.pager) {
      setPager(data.pager);
    }
  }, [isSuccess, data]);

  return (
    <ModuleLayout breadcrumbItems={coursesManagementBreadcrumbItems}>
      <TableProvider value={table}>
        <div className="px-2 sm:px-10">
          <ConfirmDeleteDialog
            title="Xóa khóa học"
            message="Khóa học này sẽ bị xóa vĩnh viễn khỏi hệ thống."
            isOpen={isOpen}
            onClose={onClose}
            onDelete={handleDeleteCourse}
          />
          <div className="flex justify-between">
            <h3 className="text-2xl font-bold">
              Danh sách khóa học{" "}
              <span className="bg-default-100 px-2 py-1 rounded-full text-[13px] font-normal ml-1">{pager.total}</span>
            </h3>
          </div>
          <TableHeader filter={<CourseFilter />} addBtnPath={`/courses/add`} rowSize={data?.rows?.length || 0} />
        </div>
        <Table
          isLoading={isLoading}
          rows={data?.rows || []}
          className="px-2 sm:px-10"
          renderCell={(row, columnKey, index) => (
            <CourseCell
              rowData={row}
              columnKey={columnKey}
              rowIndex={index}
              onDelete={(id) => {
                setSelectedCourseId(id);
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
  { name: "Tên khóa học", uid: "name" },
  { name: "Cấp độ", uid: "level" },
  { name: "Số buổi học", uid: "numberOfLessons" },
  { name: "Số học sinh tối đa", uid: "numberOfStudents" },
  { name: "Học phí", uid: "tuitionFee" },
  { name: "Trạng thái", uid: "status" },
  { name: "Ngày cập nhật gần nhất", uid: "lastUpdatedAt" },
  { name: "Ngày tạo", uid: "createdAt" },
  { name: "Thao tác", uid: "actions", disableSort: true },
];

const defaultSelectedColumns = [
  "index",
  "code",
  "name",
  "level",
  "numberOfLessons",
  "numberOfStudents",
  "tuitionFee",
  "status",
  "createdAt",
  "actions",
];

export default CourseManagement;
