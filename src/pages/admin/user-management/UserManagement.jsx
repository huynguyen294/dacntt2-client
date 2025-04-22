import { ModuleLayout } from "@/layouts";
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
import { Ban, ChevronDown, Edit, Grid2X2, ListFilter, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { userManagementBreadcrumbItems } from ".";
import { getUsers } from "@/apis";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import useDebounce from "@/hooks/useDebounce";

const UserManagement = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [pager, setPager] = useState(defaultPager);
  const debounceQuery = useDebounce(query);

  const { isLoading, data, isSuccess } = useQuery({
    queryKey: ["users", `p=${pager.page},ps=${pager.pageSize},q=${debounceQuery}`],
    queryFn: () => getUsers(pager, {}, debounceQuery),
  });

  const loadingState = isLoading ? "loading" : "idle";

  const users = data?.users || [];
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));

  const changePager = (prop, value) => setPager((prev) => ({ ...prev, [prop]: value }));

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
  };

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
              className="min-w-[300px]"
              classNames={{ input: "px-2" }}
              placeholder="Tìm theo tên, email, số điện thoại"
              endContent={<Search size="16px" />}
              value={query}
              onValueChange={setQuery}
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
            <p className="whitespace-nowrap">
              {selectedKeys === "all" ? users.length || 0 : selectedKeys.size} Đã chọn
            </p>
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
        classNames={{ wrapper: "h-full" }}
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="text-foreground-500 font-semibold flex gap-2 w-full justify-center">
              <Ban size="18px" />
              Không có dữ liệu
            </div>
          }
          loadingContent={<Spinner variant="wave" />}
          loadingState={loadingState}
        >
          {users.map((user, rowIdx) => (
            <TableRow key={user.id}>
              {columns.map((col, colIdx) => (
                <TableCell key={`${rowIdx}-${colIdx}`}>{renderCell(user, col.uid, rowIdx)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="px-10 pb-6 flex justify-between">
        <Pagination
          isCompact
          showControls
          showShadow
          page={pager.page}
          total={pager.pageCount}
          onChange={(newPage) => {
            setSelectedKeys(new Set([]));
            changePager("page", newPage);
          }}
        />

        <div className="space-x-2">
          <Dropdown>
            <DropdownTrigger>
              <Button size="sm" variant="bordered" className="border-1" endContent={<ChevronDown size="12px" />}>
                Hiển thị: {pager.pageSize}
              </Button>
            </DropdownTrigger>
            <DropdownMenu selectedKeys={new Set([pager.pageSize.toString()])} selectionMode="single">
              <DropdownItem key={10} onPress={() => changePager("pageSize", 10)}>
                10
              </DropdownItem>
              <DropdownItem key={20} onPress={() => changePager("pageSize", 20)}>
                20
              </DropdownItem>
              <DropdownItem key={50} onPress={() => changePager("pageSize", 30)}>
                50
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button
            size="sm"
            variant="flat"
            isDisabled={pager.page === 1}
            onPress={() => changePager("page", pager.page - 1)}
          >
            Trang trước
          </Button>
          <Button
            size="sm"
            variant="flat"
            isDisabled={pager.page === pager.pageCount}
            onPress={() => changePager("page", pager.page + 1)}
          >
            Trang sau
          </Button>
        </div>
      </div>
    </ModuleLayout>
  );
};

const defaultPager = { total: 0, pageCount: 1, page: 1, pageSize: 20 };

const columns = [
  { name: "STT", uid: "index" },
  { name: "Tài khoản", uid: "user" },
  { name: "Vai trò", uid: "role" },
  { name: "Email", uid: "email" },
  { name: "Ngày sinh", uid: "dateOfBirth" },
  { name: "Ngày đăng ký", uid: "createdAt" },
  { name: "Số điện thoại", uid: "phoneNumber" },
  { name: "Hành động", uid: "actions" },
];

export default UserManagement;
