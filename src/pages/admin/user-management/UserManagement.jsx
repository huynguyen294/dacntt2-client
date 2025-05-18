/* eslint-disable react-hooks/exhaustive-deps */
import { ModuleLayout } from "@/layouts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { breadcrumbItemsByRole } from "./constants";
import { imageApi, userApi } from "@/apis";
import { ConfirmDeleteDialog } from "@/components";
import { useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { Table, TableFooter, TableHeader, TableProvider } from "@/components/common";
import { useTable } from "@/hooks";
import TableFilter from "./components/TableFilter";
import TableCell from "./components/TableCell";
import MultipleActions from "./components/MultipleActions";

const UserManagement = () => {
  const queryClient = useQueryClient();
  const { role } = useParams();
  const { columns, defaultSelectedColumns } = columnsByRole[role];

  const table = useTable({ allColumns: columns, defaultSelectedColumns });
  const { pager, filters, debounceQuery, order, setPager } = table;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedImgId, setSelectedImgId] = useState(null);

  const roles = role !== "_" ? [role] : filters.roles;
  const roleKey = roles ? `r=${roles.join(",")}` : "";
  const queryFilterKey = `p=${pager.page},ps=${pager.pageSize},q=${debounceQuery},o=${order.order},ob=${order.orderBy},ca=${filters.createdAt}${roleKey}`;
  const { isLoading, data, isSuccess } = useQuery({
    queryKey: ["users", queryFilterKey],
    queryFn: () => userApi.get(pager, order, debounceQuery, { ...filters, roles }, { role }),
  });

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;
    if (selectedImgId) await imageApi.delete(selectedImgId);
    const result = await userApi.delete(selectedUserId);
    if (!result.ok) {
      addToast({ color: "danger", title: "Xóa thất bại!", description: result.message });
    } else {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
    onClose();
  };

  useEffect(() => {
    if (isSuccess && data?.pager) {
      setPager(data.pager);
    }
  }, [isSuccess, data]);

  return (
    <ModuleLayout key={role} breadcrumbItems={breadcrumbItemsByRole[role]}>
      <TableProvider value={table}>
        <div className="px-2 sm:px-10">
          <ConfirmDeleteDialog
            title="Xóa người dùng"
            message="Người dùng này sẽ bị xóa vĩnh viễn khỏi hệ thống."
            isOpen={isOpen}
            onClose={onClose}
            onDelete={handleDeleteUser}
          />
          <div className="flex justify-between">
            <h3 className="text-2xl font-bold">
              Danh sách tài khoản{" "}
              <span className="bg-default-100 px-2 py-1 rounded-full text-[13px] font-normal ml-1">{pager.total}</span>
            </h3>
          </div>
          <TableHeader
            filter={<TableFilter role={role} />}
            multiAction={<MultipleActions />}
            addBtnPath={`/admin/user-management/${role}/add`}
            rowSize={data?.rows?.length || 0}
          />
        </div>
        <Table
          className="px-2 sm:px-10"
          rows={data?.rows || []}
          isLoading={isLoading}
          renderCell={(rowData, columnKey, index) => (
            <TableCell
              rowData={rowData}
              columnKey={columnKey}
              rowIndex={index}
              onDelete={(id, imageId) => {
                setSelectedUserId(id);
                setSelectedImgId(imageId);
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

const commonColumns = [
  { name: "STT", uid: "index", disableSort: true },
  { name: "Tài khoản", uid: "user", sortUid: "name" },
  { name: "Vai trò", uid: "role", disableSort: true },
  { name: "Ngày sinh", uid: "dateOfBirth" },
  { name: "Giới tính", uid: "gender", disableSort: true },
  { name: "Số điện thoại", uid: "phoneNumber", disableSort: true },
  { name: "Địa chỉ", uid: "address", disableSort: true },
  { name: "Ngày đăng ký", uid: "createdAt" },
  { name: "Ngày cập nhật gần nhất", uid: "lastUpdatedAt" },
];

const adminColumns = [...commonColumns, { name: "Thao tác", uid: "actions", disableSort: true }];

const studentColumns = [
  ...commonColumns,
  { name: "Lớp đang học", uid: "classes", disableSort: true },
  { name: "Học phí", uid: "tuition" },
  { name: "Thao tác", uid: "actions", disableSort: true },
];

const teacherColumns = [
  ...commonColumns,
  { name: "Lương cơ bản", uid: "salary" },
  { name: "Loại lao động", uid: "employmentType", disableSort: true },
  { name: "Chuyên môn", uid: "major", disableSort: true },
  { name: "Lớp đang dạy", uid: "classes", disableSort: true },
  { name: "Trạng thái", uid: "status", disableSort: true },
  { name: "Thao tác", uid: "actions", disableSort: true },
];

const consultantColumns = [
  ...commonColumns,
  { name: "Lương cơ bản", uid: "salary" },
  { name: "Loại lao động", uid: "employmentType", disableSort: true },
  { name: "Trạng thái", uid: "status", disableSort: true },
  { name: "Thao tác", uid: "actions", disableSort: true },
];

const financeOfficerColumns = [
  ...commonColumns,
  { name: "Lương cơ bản", uid: "salary", disableSort: true },
  { name: "Loại lao động", uid: "employmentType", disableSort: true },
  { name: "Trạng thái", uid: "status", disableSort: true },
  { name: "Thao tác", uid: "actions", disableSort: true },
];

const commonSelectedColumns = ["index", "user", "phoneNumber", "createdAt", "actions"];
const adminDefaultSelectedColumns = [...commonSelectedColumns, "role", "dateOfBirth", "gender"];
const studentDefaultSelectedColumns = [...commonSelectedColumns, "classes", "tuition"];
const teacherDefaultSelectedColumns = [...commonSelectedColumns, "major", "classes", "salary", "status"];
const consultantDefaultSelectedColumns = [...commonSelectedColumns, "salary", "status"];
const financeOfficerDefaultSelectedColumns = [...commonSelectedColumns, "salary", "status"];

const columnsByRole = {
  _: { columns: adminColumns, defaultSelectedColumns: adminDefaultSelectedColumns },
  student: { columns: studentColumns, defaultSelectedColumns: studentDefaultSelectedColumns },
  teacher: { columns: teacherColumns, defaultSelectedColumns: teacherDefaultSelectedColumns },
  consultant: { columns: consultantColumns, defaultSelectedColumns: consultantDefaultSelectedColumns },
  "finance-officer": { columns: financeOfficerColumns, defaultSelectedColumns: financeOfficerDefaultSelectedColumns },
};

export default UserManagement;
