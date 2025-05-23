import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";

import { ChevronDown, Grid2X2, Plus, Search } from "lucide-react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { useNavigate } from "@/hooks";
import { useTableContext } from "./context";

const defaultSearchPlaceholder = "Tìm theo tên, email, số điện thoại";
const TableHeader = ({
  rowSize = 0,
  hideAddBtn,
  searchPlaceholder = defaultSearchPlaceholder,
  addBtnPath,
  addBtnText = "Thêm mới",
  multiAction = MultipleAction,
  filter,
}) => {
  const navigate = useNavigate();
  const { query, setQuery, allColumns, selectedKeys, selectedColumns, setSelectedColumns } = useTableContext();

  return (
    <div className="mt-2 flex justify-between items-center gap-4">
      <div className="flex gap-2 items-center overflow-x-auto">
        <Input
          size="sm"
          className="min-w-[300px]"
          classNames={{ input: "px-2" }}
          placeholder={searchPlaceholder}
          endContent={<Search size="16px" />}
          value={query}
          onValueChange={setQuery}
        />
        {filter}
        <Dropdown showArrow>
          <DropdownTrigger>
            <Button size="sm" variant="flat" className="font-semibold min-w-fit" startContent={<Grid2X2 size="13px" />}>
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
            {allColumns.map((col) => (
              <DropdownItem key={col.uid}>{col.name}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <Divider orientation="vertical" className="h-6 mx-1" />
        <p className="whitespace-nowrap">{selectedKeys === "all" ? rowSize || 0 : selectedKeys.size} Đã chọn</p>
        {(selectedKeys === "all" || selectedKeys.size > 0) && multiAction}
      </div>
      {!hideAddBtn && (
        <Button
          className="font-semibold min-w-fit"
          color="primary"
          endContent={<Plus size="18px" />}
          onPress={() => navigate(addBtnPath)}
        >
          {addBtnText}
        </Button>
      )}
    </div>
  );
};

const MultipleAction = () => (
  <Button size="sm" variant="flat" className="font-semibold min-w-fit" endContent={<ChevronDown size="13px" />}>
    Thao tác nhiều
  </Button>
);

export default TableHeader;
