/* eslint-disable react-hooks/exhaustive-deps */
import { ModuleLayout } from "@/layouts";
import { classTuitionBreadcrumbItems } from "./constants";
import { useNavigate, useTable } from "@/hooks";
import { Table, TableFooter, TableHeader, TableProvider } from "@/components/common";
import { ConfirmDeleteDialog } from "@/components";
import { useDisclosure } from "@heroui/modal";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { tuitionApi } from "@/apis";
import { displayDate, localeString } from "@/utils";
import { getCode } from "@/constants";
import { User } from "@heroui/user";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Edit, Trash2 } from "lucide-react";

const TuitionManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const table = useTable({ allColumns: columns, defaultSelectedColumns, Api: tuitionApi });
  const { pager, filters, debounceQuery, order, setPager } = table;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedTuitionId, setSelectedTuitionId] = useState(null);

  const mergedFilters = { ...filters };
  const { isLoading, data, isSuccess } = useQuery({
    queryKey: [
      "tuitions",
      JSON.stringify(pager),
      JSON.stringify(order),
      JSON.stringify(mergedFilters),
      debounceQuery,
      "refs=true",
    ],
    queryFn: () => tuitionApi.get(pager, order, debounceQuery, mergedFilters, ["refs=true"]),
  });

  const handleDeleteTuition = async () => {
    if (!selectedTuitionId) return;
    const result = await tuitionApi.delete(selectedTuitionId);
    if (!result.ok) {
      addToast({ color: "danger", title: "Xóa thất bại!", description: result.message });
    } else {
      queryClient.invalidateQueries({ queryKey: ["tuitions"] });
    }
    setSelectedTuitionId(null);
    onClose();
  };

  useEffect(() => {
    if (isSuccess && data?.pager) {
      setPager(data.pager);
    }
  }, [isSuccess, data]);

  return (
    <ModuleLayout breadcrumbItems={classTuitionBreadcrumbItems}>
      <TableProvider value={table}>
        <div className="px-2 sm:px-10">
          <ConfirmDeleteDialog
            title="Xóa học phí"
            message="Khóa học này sẽ bị xóa vĩnh viễn khỏi hệ thống."
            isOpen={isOpen}
            onClose={onClose}
            onDelete={handleDeleteTuition}
          />
          <div className="flex justify-between">
            <h3 className="text-2xl font-bold">
              Danh sách học phí{" "}
              <span className="bg-default-100 px-2 py-1 rounded-full text-[13px] font-normal ml-1">{pager.total}</span>
            </h3>
          </div>
          <TableHeader
            searchPlaceholder="Nhập mã học phí hoặc mã thanh toán"
            addBtnPath={`/tuition-management/add`}
            rowSize={data?.rows?.length || 0}
          />
        </div>
        <Table
          isLoading={isLoading}
          rows={data?.rows || []}
          className="px-2 sm:px-10"
          renderCell={(row, columnKey, index) => {
            const cellValue = row[columnKey];
            const users = data.refs?.users || {};
            const classes = data.refs?.classes || {};
            if (columnKey === "date") return displayDate(new Date(cellValue));
            if (columnKey === "amount") return localeString(cellValue) + "đ";
            if (columnKey === "code") return getCode("tuition", row.id);
            if (columnKey === "student")
              return (
                <User
                  avatarProps={{ src: users[row.studentId]?.imageUrl }}
                  name={users[row.studentId]?.name}
                  description={users[row.studentId]?.email}
                />
              );
            if (columnKey === "class") return classes[row.classId]?.name;
            if (columnKey === "phoneNumber") return users[row.studentId]?.phoneNumber;
            if (columnKey === "actions") {
              return (
                <>
                  <Tooltip content="Sửa học phí">
                    <Button
                      onPress={() => navigate(`/tuition-management/edit/${row.id}`)}
                      size="sm"
                      isIconOnly
                      radius="full"
                      variant="light"
                    >
                      <Edit size="18px" />
                    </Button>
                  </Tooltip>
                  <Tooltip color="danger" content="Xóa học phí">
                    <Button
                      onClick={(e) => e.stopPropagation()}
                      onPress={() => {
                        setSelectedTuitionId(row.id);
                        onOpen();
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
                </>
              );
            }
            return cellValue;
          }}
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
  { name: "Học viên", uid: "student", disableSort: true },
  { name: "Số điện thoại", uid: "phoneNumber", disableSort: true },
  { name: "Lớp học", uid: "class", disableSort: true },
  { name: "Số tiền", uid: "amount" },
  { name: "Mã thanh toán", uid: "content" },
  { name: "Ngày thanh toán", uid: "date" },
  { name: "Ngày cập nhật gần nhất", uid: "lastUpdatedAt" },
  { name: "Ngày tạo", uid: "createdAt" },
  { name: "Thao tác", uid: "actions", disableSort: true },
];

const defaultSelectedColumns = ["index", "code", "student", "amount", "content", "class", "date", "actions"];

export default TuitionManagement;
