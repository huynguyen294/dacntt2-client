import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";

import { ArrowDown, ChevronDown, Grid2X2, ListFilter, Plus, Search } from "lucide-react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { cn } from "@/lib/utils";
import { useNavigate } from "@/hooks";
import { useTableContext } from "./context";

const TableHeader = ({ addBtnPath, addBtnText = "Thêm mới", filter }) => {
  const navigate = useNavigate();
  const { rows, query, setQuery, order, setOrder, allColumns, selectedKeys, selectedColumns, setSelectedColumns } =
    useTableContext();

  return (
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
        {filter}
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
            {allColumns
              .filter((c) => !c.disableSort)
              .map((col) => {
                const selected = order.orderBy === col.uid || order.orderBy === col.sortUid;

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
                        const orderBy = col.sortUid || col.uid;
                        setOrder({ orderBy, order: "desc" });
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
        <p className="whitespace-nowrap">{selectedKeys === "all" ? rows.length || 0 : selectedKeys.size} Đã chọn</p>
        {(selectedKeys === "all" || selectedKeys.size > 0) && (
          <Button size="sm" variant="flat" className="font-semibold min-w-fit" endContent={<ChevronDown size="13px" />}>
            Thao tác nhiều
          </Button>
        )}
      </div>
      <Button
        className="font-semibold min-w-fit"
        color="primary"
        endContent={<Plus size="18px" />}
        onPress={() => navigate(addBtnPath)}
      >
        {addBtnText}
      </Button>
    </div>
  );
};

export default TableHeader;
