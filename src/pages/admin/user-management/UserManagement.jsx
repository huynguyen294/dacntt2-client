/* eslint-disable react-hooks/exhaustive-deps */
import { ModuleLayout } from "@/layouts";
import { DATE_FORMAT, ROLE_PALLET } from "@/constants";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { User } from "@heroui/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { breadcrumbItemsByRole } from ".";
import { deleteUserById, getUsers } from "@/apis";
import { alpha } from "@/utils";
import { ConfirmDeleteDialog } from "@/components";
import { useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { Table, TableFooter, TableHeader, TableProvider } from "@/components/common";
import { useTable } from "@/hooks";
import TableFilter from "./TableFilter";

const UserManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const table = useTable({ defaultSelectedColumns });
  const { pager, filters, selectedColumns, debounceQuery, order, setPager } = table;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { role } = useParams();

  const roles = role !== "_" ? [role] : filters.roles;
  const roleKey = roles ? `r=${roles.join(",")}` : "";
  const queryFilterKey = `p=${pager.page},ps=${pager.pageSize},q=${debounceQuery},o=${order.order},ob=${order.orderBy},ca=${filters.createdAt}${roleKey}`;
  const { isLoading, data, isSuccess } = useQuery({
    queryKey: ["users", queryFilterKey],
    queryFn: () => getUsers(pager, order, debounceQuery, { ...filters, roles }),
  });

  const users = data?.users || [];
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

  const renderCell = (user, columnKey, index) => {
    let cellValue = user[columnKey];
    if (columnKey === "createdAt" || columnKey === "dateOfBirth") {
      if (cellValue) cellValue = format(new Date(cellValue), DATE_FORMAT);
    }
    if (columnKey === "index") {
      cellValue = index + 1 + (pager.page - 1) * pager.pageSize;
    }

    switch (columnKey) {
      case "user":
        return (
          <User avatarProps={{ radius: "lg", src: user.imageUrl }} description={user.email} name={user.name}>
            {user.email}
          </User>
        );
      case "role":
        return (
          <Chip
            className="capitalize bg-[var(--current-color)]"
            size="sm"
            variant="flat"
            style={{ "--current-color": alpha(ROLE_PALLET[cellValue], 0.2) }}
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center justify-center">
            <Tooltip content="Edit user">
              <Button
                onPress={() => {
                  navigate(`/admin/user-management/${role}/edit/${user.id}`);
                }}
                size="sm"
                isIconOnly
                radius="full"
                variant="light"
              >
                <Edit size="18px" />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <Button
                onClick={(e) => e.stopPropagation()}
                onPress={() => {
                  onOpen();
                  setSelectedUserId(user.id);
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
          </div>
        );
      default:
        return cellValue;
    }
  };

  useEffect(() => {
    if (isSuccess && data?.pager) {
      setPager(data.pager);
    }
  }, [isSuccess, data]);

  return (
    <ModuleLayout key={role} breadcrumbItems={breadcrumbItemsByRole[role]}>
      <TableProvider value={{ ...table, loadingState, allColumns: columns, rows: users, columns: filteredColumns }}>
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
        <Table renderCell={renderCell} />
        <div className="px-10 pb-6 flex justify-between">
          <TableFooter />
        </div>
      </TableProvider>
    </ModuleLayout>
  );
};

const columns = [
  { name: "STT", uid: "index" },
  { name: "Tài khoản", uid: "user" },
  { name: "Vai trò", uid: "role" },
  { name: "Email", uid: "email" },
  { name: "Ngày sinh", uid: "dateOfBirth" },
  { name: "Giới tính", uid: "gender" },
  { name: "Số điện thoại", uid: "phoneNumber" },
  { name: "Địa chỉ", uid: "address" },
  { name: "Ngày đăng ký", uid: "createdAt" },
  { name: "Ngày cập nhật gần nhất", uid: "lastUpdatedAt" },
  { name: "Hành động", uid: "actions" },
];

const defaultSelectedColumns = [
  "index",
  "name",
  "user",
  "role",
  "email",
  "gender",
  "phoneNumber",
  "createdAt",
  "actions",
];

const columnsByRole = {
  admin: { columns: columns, defaultSelectedColumns: defaultSelectedColumns },
  student: { columns: columns, defaultSelectedColumns: defaultSelectedColumns },
  teacher: { columns: columns, defaultSelectedColumns: defaultSelectedColumns },
  consultant: { columns: columns, defaultSelectedColumns: defaultSelectedColumns },
  "finance-officers": { columns: columns, defaultSelectedColumns: defaultSelectedColumns },
};

export default UserManagement;
