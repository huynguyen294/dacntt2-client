import { cn } from "@/lib/utils";
import { Spinner } from "@heroui/spinner";
import { Table as HerioUiTable, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { Ban } from "lucide-react";
import { useTableContext } from "./context";

const defaultCellRenderer = (row, columnKey, index, table) => row[columnKey];
const Table = ({
  className,
  rows,
  classNames = {},
  isLoading,
  renderCell = defaultCellRenderer,
  selectionMode = "multiple",
  isHeaderSticky = true,
  emptyContent,
  ...other
}) => {
  const table = useTableContext();
  const { selectedKeys, setSelectedKeys, columns, order, setOrder = () => {} } = table;

  const sortDescriptor = order && {
    column: order.orderBy,
    direction: order.order === "asc" ? "ascending" : "descending",
  };
  const loadingState = isLoading ? "loading" : "idle";

  const renderTableCell = (col, row, rowIdx) => {
    if (col.uid === "index") return table.getRowIndex ? table.getRowIndex(rowIdx + 1) : rowIdx + 1;
    if (typeof col.render === "function") return col.render(row, rowIdx, table);
    return renderCell(row, col.uid, rowIdx, table);
  };

  return (
    <HerioUiTable
      color="primary"
      isHeaderSticky={isHeaderSticky}
      className={cn(
        "flex-1 overflow-y-auto py-2 [&_td[data-selected=true]]:font-semibold before:[&_td[data-selected=true]]:bg-primary/10 before:[&_td[data-selected=true]]:block before:[&_tr_td]:hidden [&_tr[data-hover=true]_td]:bg-default-100",
        className
      )}
      selectionMode={selectionMode}
      aria-label="Example table with custom cells"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      sortDescriptor={sortDescriptor}
      onSortChange={({ column, direction }) => {
        setOrder({ order: direction === "ascending" ? "asc" : "desc", orderBy: column });
      }}
      classNames={{ wrapper: cn("h-full", classNames.wrapper), ...classNames }}
      {...other}
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn
            allowsSorting={!column.disableSort}
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody
        emptyContent={
          emptyContent || (
            <div className="text-foreground-500 font-semibold flex gap-2 w-full justify-center items-center">
              <Ban size="18px" />
              Không có dữ liệu
            </div>
          )
        }
        loadingContent={<Spinner variant="wave" />}
        loadingState={loadingState}
      >
        {rows.map((row, rowIdx) => (
          <TableRow key={row.id}>
            {columns.map((col, colIdx) => (
              <TableCell key={`${rowIdx}-${colIdx}`}>{renderTableCell(col, row, rowIdx)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </HerioUiTable>
  );
};

export default Table;
