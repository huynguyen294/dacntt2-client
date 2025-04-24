import { ModuleLayout } from "@/layouts";
import { DATE_FORMAT, ROLE_LABELS, ROLE_PALLET, USER_ROLES } from "@/constants";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { Tooltip } from "@heroui/tooltip";
import { User } from "@heroui/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowDown,
  Ban,
  CheckCheck,
  ChevronDown,
  Edit,
  Grid2X2,
  ListFilter,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { userManagementBreadcrumbItems } from ".";
import { deleteUserById, getUsers } from "@/apis";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { alpha } from "@/utils";
import { ConfirmDeleteDialog } from "@/components";
import { useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useDebounce } from "@/hooks";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { Radio, RadioGroup } from "@heroui/radio";

const UserManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [query, setQuery] = useState("");
  const [pager, setPager] = useState(defaultPager);
  const [order, setOrder] = useState({ order: "desc", orderBy: "createdAt" });
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [selectedColumns, setSelectedColumns] = useState(new Set(defaultSelectedColumns));
  const [filters, setFilters] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const debounceQuery = useDebounce(query);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const roleKey = filters.roles ? `r=${filters.roles.join(",")}` : "";
  const { isLoading, data, isSuccess } = useQuery({
    queryKey: [
      "users",
      `p=${pager.page},ps=${pager.pageSize},q=${debounceQuery},o=${order.order},ob=${order.orderBy}${roleKey}`,
    ],
    queryFn: () => getUsers(pager, order, debounceQuery, filters),
  });

  const users = data?.users || [];
  const loadingState = isLoading ? "loading" : "idle";

  const filteredColumns = useMemo(() => columns.filter((col) => selectedColumns.has(col.uid)), [selectedColumns]);

  const changePager = (prop, value) => setPager((prev) => ({ ...prev, [prop]: value }));

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
            {/*  <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">

              </span>
            </Tooltip> */}
            <Tooltip content="Edit user">
              <Button
                onPress={() => {
                  navigate(`/admin/user-management/edit/${user.id}`);
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
    <ModuleLayout breadcrumbItems={userManagementBreadcrumbItems}>
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
            <Popover
              placement="bottom"
              showArrow
              isOpen={popoverOpen}
              onOpenChange={setPopoverOpen}
              onClose={() => setPopoverOpen(false)}
            >
              <PopoverTrigger>
                <Button
                  size="sm"
                  variant="flat"
                  className="font-semibold min-w-fit"
                  startContent={<SlidersHorizontal size="13px" />}
                >
                  Lọc
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="p-2 space-y-4">
                  <CheckboxGroup defaultValue={USER_ROLES} label="Vai trò">
                    {USER_ROLES.map((role) => (
                      <Checkbox value={role}>{ROLE_LABELS[role]}</Checkbox>
                    ))}
                  </CheckboxGroup>
                  <RadioGroup label="Ngày đăng ký" defaultValue="all" classNames={{ label: "text-base" }}>
                    <Radio value="all">Tất cả</Radio>
                    <Radio value="last7days">7 ngày gần nhất</Radio>
                    <Radio value="last30days">30 ngày gần nhất</Radio>
                    <Radio value="last60days">60 ngày gần nhất</Radio>
                  </RadioGroup>
                  <div className="flex">
                    <Button
                      onPress={() => setPopoverOpen(false)}
                      startContent={<CheckCheck size="15px" />}
                      size="sm"
                      color="primary"
                      className="mr-2 h-8"
                    >
                      Áp dụng
                    </Button>
                    <Button onPress={() => setPopoverOpen(false)} size="sm" variant="bordered" color="danger">
                      Hủy
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Dropdown showArrow>
              <DropdownTrigger>
                <Button
                  size="sm"
                  variant="flat"
                  className="font-semibold min-w-fit"
                  startContent={<ListFilter size="13px" />}
                >
                  Sắp xếp
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                closeOnSelect={false}
                selectedKeys={new Set([order.orderBy])}
                disabledKeys={["actions", "index"]}
                selectionMode="single"
                variant="faded"
              >
                {filteredColumns.map((col) => {
                  const selected = order.orderBy === col.uid;
                  return (
                    <DropdownItem
                      hideSelectedIcon
                      endContent={
                        selected && (
                          <ArrowDown
                            size="15px"
                            className={cn("transition-transform", order.order === "asc" && "rotate-180")}
                          />
                        )
                      }
                      key={col.uid}
                      onPress={() => {
                        if (selected) {
                          setOrder((prev) => ({ ...prev, order: prev.order === "desc" ? "asc" : "desc" }));
                        } else {
                          setOrder({ orderBy: col.uid, order: "desc" });
                        }
                      }}
                    >
                      {col.name}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </Dropdown>
            <Dropdown showArrow>
              <DropdownTrigger>
                <Button
                  size="sm"
                  variant="flat"
                  className="font-semibold min-w-fit"
                  startContent={<Grid2X2 size="13px" />}
                >
                  Cột
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                closeOnSelect={false}
                selectedKeys={selectedColumns}
                onSelectionChange={setSelectedColumns}
                disabledKeys={["actions"]}
                selectionMode="multiple"
                variant="faded"
              >
                {columns.map((col) => (
                  <DropdownItem key={col.uid}>{col.name}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
          {filteredColumns.map((column) => (
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
              {filteredColumns.map((col, colIdx) => (
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
  { name: "Giới tính", uid: "gender" },
  { name: "Số điện thoại", uid: "phoneNumber" },
  { name: "Địa chỉ", uid: "address" },
  { name: "Ngày đăng ký", uid: "createdAt" },
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

export default UserManagement;
