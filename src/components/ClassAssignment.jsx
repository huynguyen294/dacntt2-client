import { classApi, courseApi, shiftApi } from "@/apis";
import { COURSE_STATUSES, DATE_FORMAT } from "@/constants";
import { useTable } from "@/hooks";
import { Select, SelectItem } from "@heroui/select";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Table, TableProvider } from "./common";
import { format } from "date-fns";
import { Button } from "@heroui/button";

const ClassAssignment = () => {
  const { pager, debounceQuery, order, filters } = useTable();

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const queryFilterKey = `p=${pager.page},ps=${pager.pageSize},q=${debounceQuery},o=${order.order},ob=${order.orderBy},ca=${filters.createdAt}`;
  const { isLoading, data: classData } = useQuery({
    queryKey: ["classes", queryFilterKey],
    queryFn: () => classApi.get(pager, order, debounceQuery, filters),
  });

  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ["courses", "as-options"],
    queryFn: () =>
      courseApi.get({ paging: "false" }, { orderBy: "name", order: "asc" }, null, { status: COURSE_STATUSES.active }, [
        "fields=:basic",
      ]),
  });

  const { data: shiftData, isLoading: shiftLoading } = useQuery({
    queryKey: ["shifts", "as-options"],
    queryFn: () => shiftApi.get({ paging: "false" }, { orderBy: "name", order: "asc" }, null, {}, ["fields=:basic"]),
  });

  const handleDelete = () => {};

  const handleLoadMore = () => {};

  return (
    <div className="pb-4 sm:pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
        <Select
          isLoading={courseLoading}
          selectedKey={selectedCourse}
          onSelectionChange={setSelectedCourse}
          size="lg"
          variant="bordered"
          label="Khóa học"
          radius="sm"
          labelPlacement="outside"
          placeholder="Chọn lớp học"
        >
          {courseData?.rows && courseData?.rows.map((course) => <SelectItem key={course.id}>{course.name}</SelectItem>)}
        </Select>

        <Select
          isLoading={shiftLoading}
          selectedKeys={new Set(selectedShift ? [selectedShift] : selectedShift)}
          onSelectionChange={(keys) => setSelectedShift([...keys][0])}
          size="lg"
          variant="bordered"
          label="Ca học"
          radius="sm"
          labelPlacement="outside"
          placeholder="Chọn ca học"
        >
          {shiftData?.rows &&
            shiftData.rows.map((s) => (
              <SelectItem key={s.id.toString()}>
                {`${s.name} (${s.startTime.slice(0, 5)} - ${s.endTime.slice(0, 5)})`}
              </SelectItem>
            ))}
        </Select>

        <Select
          isLoading={shiftLoading}
          selectedKeys={new Set(selectedShift ? [selectedShift] : selectedShift)}
          onSelectionChange={(keys) => setSelectedShift([...keys][0])}
          size="lg"
          variant="bordered"
          label="Giáo viên"
          radius="sm"
          labelPlacement="outside"
          placeholder="Chọn giáo viên"
        ></Select>
      </div>
      <TableProvider
        value={{
          columns: [
            { uid: "index", name: "STT" },
            { uid: "name", name: "Tên lớp" },
            { uid: "weekDays", name: "Ngày học" },
            { uid: "openingDay", name: "Ngày khai giảng" },
            { uid: "closingDay", name: "Ngày kết thúc" },
            { uid: "actions", name: "Thao tác" },
          ],
        }}
      >
        <Table
          isHeaderSticky={false}
          classNames={{ wrapper: "shadow-none p-0 rounded-none mt-4 max-h-[55dvh] h-[55dvh]" }}
          rows={classData?.rows || []}
          selectionMode="none"
          bottomContent={
            hasMore && !isLoading ? (
              <div className="flex w-full justify-center">
                <Button size="sm" isDisabled={isLoading} variant="flat" onPress={handleLoadMore}>
                  {isLoading && <Spinner color="white" size="sm" />}
                  Tải thêm
                </Button>
              </div>
            ) : null
          }
          renderCell={(rowData, columnKey, index) => {
            let cellValue = rowData[columnKey];
            if (columnKey === "index") cellValue = index + 1;
            const dateFields = ["openingDay", "closingDay"];
            if (dateFields.includes(columnKey)) {
              if (cellValue) cellValue = format(new Date(cellValue), DATE_FORMAT);
            }
            if (columnKey === "actions") {
              return (
                <Button
                  onClick={(e) => e.stopPropagation()}
                  onPress={handleDelete}
                  className="h-7"
                  size="sm"
                  radius="full"
                  color="primary"
                >
                  Đăng ký
                </Button>
              );
            }

            return cellValue;
          }}
        />
      </TableProvider>
    </div>
  );
};

export default ClassAssignment;
