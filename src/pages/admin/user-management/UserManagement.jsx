import { ModuleLayout } from "@/components/layouts";
import { DATE_FORMAT } from "@/constants";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { Tooltip } from "@heroui/tooltip";
import { User } from "@heroui/user";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronDown, Edit, Grid2X2, ListFilter, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { userManagementBreadcrumbItems } from ".";
import { getUsers } from "@/apis";

const UserManagement = () => {
  const navigate = useNavigate();

  const [pager, setPager] = useState(defaultPager);
  const { isLoading, data, isSuccess } = useQuery({
    queryKey: ["users", `p=${pager.page},ps=${pager.pageSize}`],
    queryFn: () => getUsers(pager),
  });

  const users = data?.users || [];
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));

  const changePager = useCallback((prop, value) => setPager((prev) => ({ ...prev, [prop]: value })), []);

  const renderCell = useCallback((user, columnKey) => {
    let cellValue = user[columnKey];
    if (columnKey === "createdAt" || columnKey === "dateOfBirth") {
      if (cellValue) cellValue = format(new Date(cellValue), DATE_FORMAT);
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
          <Chip className="capitalize" size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2 justify-center">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50"></span>
            </Tooltip>
            <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Edit size="18px" />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <Trash2 size="18px" />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  useEffect(() => {
    if (isSuccess && data?.pager) {
      setPager(data.pager);
    }
  }, [isSuccess, data]);

  return (
    <ModuleLayout breadcrumbItems={userManagementBreadcrumbItems}>
      <div className="px-10">
        <div className="flex justify-between">
          <h3 className="text-2xl font-bold">
            Danh sách tài khoản{" "}
            <span className="bg-default-100 px-2 py-1 rounded-full text-[13px] font-normal ml-1">{pager.total}</span>
          </h3>
        </div>
        <div className="mt-2 flex justify-between items-center gap-4">
          <div className="flex gap-2 items-center overflow-x-auto">
            <Input
              size="sm"
              className="min-w-[250px]"
              classNames={{ input: "px-2 text-base" }}
              placeholder="Tìm kiếm..."
              endContent={<Search size="16px" />}
            />
            <Button
              size="sm"
              variant="flat"
              className="font-semibold min-w-fit"
              startContent={<SlidersHorizontal size="13px" />}
            >
              Lọc
            </Button>
            <Button
              size="sm"
              variant="flat"
              className="font-semibold min-w-fit"
              startContent={<ListFilter size="13px" />}
            >
              Sắp xếp
            </Button>
            <Button size="sm" variant="flat" className="font-semibold min-w-fit" startContent={<Grid2X2 size="13px" />}>
              Cột
            </Button>
            <Divider orientation="vertical" className="h-6 mx-1" />
            <p className="whitespace-nowrap">{selectedKeys === "all" ? pager.pageSize : selectedKeys.size} Đã chọn</p>
            {(selectedKeys === "all" || selectedKeys.size > 0) && (
              <Button
                size="sm"
                variant="flat"
                className="font-semibold min-w-fit"
                endContent={<ChevronDown size="13px" />}
              >
                Thao tác nhiều
              </Button>
            )}
          </div>
          <Button
            className="font-semibold min-w-fit"
            color="primary"
            endContent={<Plus size="18px" />}
            onPress={() => navigate("/admin/user-management/add")}
          >
            Thêm tài khoản
          </Button>
        </div>
      </div>
      <Table
        isHeaderSticky
        className="flex-1 overflow-y-auto px-10 py-2"
        selectionMode="multiple"
        aria-label="Example table with custom cells"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        {isLoading ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={7}>
                <div className="h-40 w-full flex justify-center items-center">
                  <Spinner variant="wave" />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {users.map((user, rowIdx) => (
              <TableRow key={user.id}>
                {columns.map((col, colIdx) => (
                  <TableCell key={`${rowIdx}-${colIdx}`}>{renderCell(user, col.uid)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      <div className="px-10 pb-6">
        <Pagination
          isCompact
          showControls
          showShadow
          page={pager.page}
          total={pager.pageCount}
          onChange={(newValues) => {
            setSelectedKeys(new Set([]));
            changePager("page", newValues);
          }}
        />
      </div>
    </ModuleLayout>
  );
};

const defaultPager = { total: 0, pageCount: 1, page: 1, pageSize: 20 };

const columns = [
  { name: "Tài khoản", uid: "user" },
  { name: "Vai trò", uid: "role" },
  { name: "Email", uid: "email" },
  { name: "Ngày sinh", uid: "dateOfBirth" },
  { name: "Ngày đăng ký", uid: "createdAt" },
  { name: "Số điện thoại", uid: "phoneNumber" },
  { name: "Chức năng", uid: "actions" },
];

export default UserManagement;
