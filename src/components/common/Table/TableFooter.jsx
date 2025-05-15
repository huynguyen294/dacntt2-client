import { Button } from "@heroui/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Pagination } from "@heroui/pagination";
import { ChevronDown } from "lucide-react";
import { useTableContext } from "./context";

const TableFooter = () => {
  const { pager, setSelectedKeys, changePager } = useTableContext();

  return (
    <>
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
            <DropdownItem
              key={10}
              onPress={() => {
                changePager("pageSize", 10);
                changePager("page", 1);
              }}
            >
              10
            </DropdownItem>
            <DropdownItem
              key={20}
              onPress={() => {
                changePager("pageSize", 20);
                changePager("page", 1);
              }}
            >
              20
            </DropdownItem>
            <DropdownItem
              key={50}
              onPress={() => {
                changePager("pageSize", 50);
                changePager("page", 1);
              }}
            >
              50
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Button
          size="sm"
          variant="flat"
          className="hidden md:inline-flex"
          isDisabled={pager.page === 1}
          onPress={() => changePager("page", pager.page - 1)}
        >
          Trang trước
        </Button>
        <Button
          size="sm"
          variant="flat"
          className="hidden md:inline-flex"
          isDisabled={pager.page === pager.pageCount}
          onPress={() => changePager("page", pager.page + 1)}
        >
          Trang sau
        </Button>
      </div>
    </>
  );
};

export default TableFooter;
