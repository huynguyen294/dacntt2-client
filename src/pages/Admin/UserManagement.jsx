import { ModuleLayout } from "@/components/layouts";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { Tooltip } from "@heroui/tooltip";
import { User } from "@heroui/user";
import {
  ArrowDownUpIcon,
  ArrowLeftRight,
  ArrowRightCircle,
  ArrowUpDown,
  CirclePlus,
  Edit,
  Filter,
  Search,
  Trash2,
} from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router";

const UserManagement = () => {
  const navigate = useNavigate();

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User avatarProps={{ radius: "lg", src: user.avatar }} description={user.email} name={cellValue}>
            {user.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-400">{user.team}</p>
          </div>
        );
      case "status":
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

  return (
    <ModuleLayout
      title="Quản lý tài khoản"
      breadcrumbItems={[{ label: "Quản lý tài khoản", path: "/admin/user-management" }]}
    >
      <div className="mt-10 container mx-auto">
        <div className="flex justify-between">
          <h3 className="text-2xl font-bold">
            Danh sách tài khoản{" "}
            <span className="bg-default-100 px-2 py-1 rounded-full text-[13px] font-normal ml-1">100</span>
          </h3>
        </div>
        <div className="flex justify-between my-2 items-center">
          <div className="flex gap-2 items-center">
            <Input
              classNames={{ input: "px-2" }}
              size="sm"
              placeholder="Tìm kiếm..."
              endContent={<Search size="16px" />}
            />
            <Button size="sm" variant="flat" className="font-semibold" startContent={<Filter />}>
              Lọc
            </Button>
            <Button
              size="sm"
              variant="flat"
              className="font-semibold min-w-auto w-[11rem]"
              startContent={<ArrowUpDown size="14px" />}
            >
              Sắp xếp
            </Button>
            <Button size="sm" variant="flat" className="font-semibold" startContent={<ArrowLeftRight />}>
              Cột
            </Button>
            <Divider orientation="vertical" className="h-6 mx-1" />
            <p className="whitespace-nowrap">0 Đã chọn</p>
          </div>
          <Button
            className="font-semibold"
            color="primary"
            endContent={<CirclePlus size="18px" />}
            onPress={() => navigate("/admin/user-management/add")}
          >
            Thêm tài khoản
          </Button>
        </div>
        <Table className="mt-4" selectionMode="multiple" aria-label="Example table with custom cells">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={users}>
            {(item) => (
              <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </ModuleLayout>
  );
};

const columns = [
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const users = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "Technical Lead",
    team: "Development",
    status: "paused",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Jane Fisher",
    role: "Senior Developer",
    team: "Development",
    status: "active",
    age: "22",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    name: "William Howard",
    role: "Community Manager",
    team: "Marketing",
    status: "vacation",
    age: "28",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
  },
  {
    id: 5,
    name: "Kristen Copper",
    role: "Sales Manager",
    team: "Sales",
    status: "active",
    age: "24",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
  },
];

export default UserManagement;
