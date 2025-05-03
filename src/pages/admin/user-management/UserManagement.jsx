/* eslint-disable react-hooks/exhaustive-deps */
import { ModuleLayout } from "@/layouts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { breadcrumbItemsByRole } from ".";
import { deleteUserById, getUsersWithRole } from "@/apis";
import { ConfirmDeleteDialog } from "@/components";
import { useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { Table, TableFooter, TableHeader, TableProvider } from "@/components/common";
import { useTable } from "@/hooks";
import TableFilter from "./TableFilter";
import TableCell from "./TableCell";

const UserManagement = () => {
  const queryClient = useQueryClient();
  const { role } = useParams();
  const { columns, defaultSelectedColumns } = columnsByRole[role];

  const table = useTable({ defaultSelectedColumns });
  const { pager, filters, selectedColumns, debounceQuery, order, setPager } = table;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedUserId, setSelectedUserId] = useState(null);

  const roles = role !== "_" ? [role] : filters.roles;
  const roleKey = roles ? `r=${roles.join(",")}` : "";
  const queryFilterKey = `p=${pager.page},ps=${pager.pageSize},q=${debounceQuery},o=${order.order},ob=${order.orderBy},ca=${filters.createdAt}${roleKey}`;
  const { isLoading, data, isSuccess } = useQuery({
    queryKey: ["users", queryFilterKey],
    queryFn: () => getUsersWithRole(pager, order, debounceQuery, { ...filters, roles }, role),
  });

  const users = data?.users || [];
  const rowData = users.map((u) => ({ ...u, ...data.refs?.userEmployees?.[u.id] }));

  const loadingState = isLoading ? "loading" : "idle";
  const filteredColumns = useMemo(() => columns.filter((col) => selectedColumns.has(col.uid)), [selectedColumns]);

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;
    const result = await deleteUserById(selectedUserId);
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
      <TableProvider value={{ ...table, loadingState, allColumns: columns, rows: rowData, columns: filteredColumns }}>
        <div className="px-10">
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
          <TableHeader filter={<TableFilter role={role} />} addBtnPath={`/admin/user-management/${role}/add`} />
        </div>
        <Table
          renderCell={(rowData, columnKey, index) => (
            <TableCell
              rowData={rowData}
              columnKey={columnKey}
              rowIndex={index}
              onDelete={(id) => {
                setSelectedUserId(id);
                onOpen();
              }}
            />
          )}
        />
        <div className="px-10 pb-6 flex justify-between">
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
  { name: "Email", uid: "email" },
  { name: "Ngày sinh", uid: "dateOfBirth" },
  { name: "Giới tính", uid: "gender", disableSort: true },
  { name: "Số điện thoại", uid: "phoneNumber", disableSort: true },
  { name: "Địa chỉ", uid: "address", disableSort: true },
  { name: "Ngày đăng ký", uid: "createdAt" },
  { name: "Ngày cập nhật gần nhất", uid: "lastUpdatedAt" },
];

const adminColumns = [...commonColumns, { name: "Hành động", uid: "actions" }];

const studentColumns = [
  ...commonColumns,
  { name: "Lớp đang học", uid: "classes", disableSort: true },
  { name: "Học phí", uid: "tuition" },
  { name: "Hành động", uid: "actions", disableSort: true },
];

const teacherColumns = [
  ...commonColumns,
  { name: "Lương cơ bản", uid: "salary" },
  { name: "Loại lao động", uid: "employmentType", disableSort: true },
  { name: "Chuyển môn", uid: "major", disableSort: true },
  { name: "Lớp đang dạy", uid: "classes", disableSort: true },
  { name: "Trạng thái", uid: "status", disableSort: true },
  { name: "Hành động", uid: "actions" },
];

const consultantColumns = [
  ...commonColumns,
  { name: "Lương cơ bản", uid: "salary" },
  { name: "Loại lao động", uid: "employmentType", disableSort: true },
  { name: "Chuyển môn", uid: "major", disableSort: true },
  { name: "Trạng thái", uid: "status", disableSort: true },
  { name: "Hành động", uid: "actions" },
];

const financeOfficerColumns = [
  ...commonColumns,
  { name: "Lương cơ bản", uid: "salary", disableSort: true },
  { name: "Loại lao động", uid: "employmentType", disableSort: true },
  { name: "Chuyển môn", uid: "major", disableSort: true },
  { name: "Trạng thái", uid: "status", disableSort: true },
  { name: "Hành động", uid: "actions" },
];

const commonSelectedColumns = ["index", "user", "email", "phoneNumber", "createdAt", "actions"];
const adminDefaultSelectedColumns = [...commonSelectedColumns, "role", "gender"];
const studentDefaultSelectedColumns = [...commonSelectedColumns, "classes", "tuition", "phoneNumber"];
const teacherDefaultSelectedColumns = [...commonSelectedColumns, "major", "classes", "salary", "status"];
const consultantDefaultSelectedColumns = [...commonSelectedColumns, "major", "salary", "status"];
const financeOfficerDefaultSelectedColumns = [...commonSelectedColumns, "major", "salary", "status"];

const columnsByRole = {
  _: { columns: adminColumns, defaultSelectedColumns: adminDefaultSelectedColumns },
  student: { columns: studentColumns, defaultSelectedColumns: studentDefaultSelectedColumns },
  teacher: { columns: teacherColumns, defaultSelectedColumns: teacherDefaultSelectedColumns },
  consultant: { columns: consultantColumns, defaultSelectedColumns: consultantDefaultSelectedColumns },
  "finance-officer": { columns: financeOfficerColumns, defaultSelectedColumns: financeOfficerDefaultSelectedColumns },
};

export default UserManagement;
