import { cn } from "@/lib/utils";
import { Spinner } from "@heroui/spinner";
import { Table as HerioUiTable, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { Ban } from "lucide-react";
import { useTableContext } from "./context";

const Table = ({ className, classNames = {}, renderCell = (row, columnKey) => row[columnKey], ...other }) => {
  const { selectedKeys, setSelectedKeys, loadingState, rows, columns } = useTableContext();

  return (
    <HerioUiTable
      isHeaderSticky
      className={cn("flex-1 overflow-y-auto px-10 py-2", className)}
      selectionMode="multiple"
      aria-label="Example table with custom cells"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      classNames={{ wrapper: cn("h-full", classNames.wrapper), ...classNames }}
      {...other}
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
          <div className="text-foreground-500 font-semibold flex gap-2 w-full justify-center items-center">
            <Ban size="18px" />
            Không có dữ liệu
          </div>
        }
        loadingContent={<Spinner variant="wave" />}
        loadingState={loadingState}
      >
        {rows.map((user, rowIdx) => (
          <TableRow key={user.id}>
            {columns.map((col, colIdx) => (
              <TableCell key={`${rowIdx}-${colIdx}`}>{renderCell(user, col.uid, rowIdx)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </HerioUiTable>
  );
};

export default Table;
