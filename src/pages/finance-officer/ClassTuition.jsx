/* eslint-disable react-hooks/exhaustive-deps */
import { ModuleLayout } from "@/layouts";
import { classTuitionBreadcrumbItems } from "./constants";
import { useMetadata, useNavigate, useServerList, useTable } from "@/hooks";
import { Table, TableProvider } from "@/components/common";
import { useDisclosure } from "@heroui/modal";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { classApi, tuitionApi } from "@/apis";
import { Ban, Info, Plus, PlusCircle } from "lucide-react";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { format } from "date-fns";
import { DATE_FORMAT, ORDER_BY_NAME } from "@/constants";
import { localeString, shiftFormat } from "@/utils";
import { useSearchParams } from "react-router";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import StudentTuitionModal from "./components/StudentTuitionModal";

const ClassTuition = () => {
  const navigate = useNavigate();
  const table = useTable({ allColumns: columns, defaultSelectedColumns, defaultOrder });
  const { order } = table;

  const studentTuitionModal = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedClass, setSelectedClass] = useState();
  const [selectedRow, setSelectedRow] = useState({});

  const { shiftObj } = useMetadata();
  const classList = useServerList("classes", classApi.get, {
    filters: { closingDay: { gte: format(new Date(), DATE_FORMAT) } },
    order: ORDER_BY_NAME,
    otherParams: ["fields=id,name,teacherId,shiftId,tuitionFee"],
    paging: false,
  });
  const mergedFilters = {};
  if (selectedClass) mergedFilters.classId = selectedClass;
  const tuitionResult = useQuery({
    queryKey: ["tuitions", null, null, null, JSON.stringify(mergedFilters)],
    queryFn: () => (selectedClass ? tuitionApi.get(null, null, null, mergedFilters) : null),
  });
  const studentResult = useQuery({
    queryKey: ["classes", selectedClass || null, "students", "refFields=:full", JSON.stringify(order)],
    queryFn: () => (selectedClass ? classApi.getClassStudents(selectedClass, order, ["refFields=:full"]) : null),
  });

  const students = studentResult.data?.students || [];
  const tuitions = tuitionResult.data?.rows || [];
  const foundClass = classList.list.find((c) => c.id == selectedClass);

  useEffect(() => {
    const classId = searchParams.get("classId");
    if (classId) setSelectedClass(classId);
  }, []);

  return (
    <ModuleLayout breadcrumbItems={classTuitionBreadcrumbItems}>
      <StudentTuitionModal modalControl={studentTuitionModal} data={selectedRow} onClose={() => setSelectedRow({})} />
      <TableProvider value={table}>
        <div className="px-2 sm:px-10">
          <div className="mt-2 flex justify-between items-center gap-4">
            <div className="flex gap-2 items-center overflow-x-auto overflow-y-hidden">
              <Select
                placeholder="Tìm theo tên lớp học"
                isVirtualized
                aria-label="select"
                className="min-w-[200px]"
                maxListboxHeight={265}
                itemHeight={50}
                items={classList.list}
                isLoading={classList.isLoading}
                listboxProps={classList.listboxProps}
                selectedKeys={selectedClass && new Set([selectedClass.toString()])}
                onSelectionChange={(keys) => {
                  const classId = [...keys][0] && Number([...keys][0]);
                  searchParams.set("classId", classId);
                  setSearchParams(searchParams);
                  setSelectedClass(classId);
                }}
              >
                {(item) => {
                  return (
                    <SelectItem key={item.id?.toString()} description={shiftFormat(shiftObj[item.shiftId])}>
                      {item.name}
                    </SelectItem>
                  );
                }}
              </Select>
              <Chip className="rounded-medium h-10 bg-default-100" variant="flat">
                Học phí: {localeString(foundClass?.tuitionFee)}đ
              </Chip>
            </div>
          </div>
        </div>
        <Table
          isLoading={studentResult.isLoading || tuitionResult.isLoading}
          rows={!selectedClass ? [] : students}
          className="px-2 sm:px-10"
          emptyContent={
            <div className="text-foreground-500 font-semibold flex gap-2 w-full justify-center items-center">
              <Ban size="18px" />
              {selectedClass ? "Không có dữ liệu" : "Vui lòng chọn lớp học"}
            </div>
          }
          renderCell={(row, columnKey, index) => {
            const cellValue = row[columnKey];
            if (columnKey === "name") {
              return <User avatarProps={{ src: row.imageUrl }} name={cellValue} description={row.email} />;
            }
            if (columnKey === "paid") {
              const filtered = tuitions.filter((t) => t.studentId === row.id);
              if (!filtered.length) {
                return (
                  <Chip size="sm" color="danger" variant="flat">
                    Chưa thanh toán
                  </Chip>
                );
              }
              const total = filtered.reduce((acc, curr) => acc + curr.amount, 0);
              return (
                <Tooltip content="Xem chi tiết">
                  <Chip
                    className="!px-2 gap-1 text-small cursor-pointer select-none"
                    size="sm"
                    variant="flat"
                    onClick={(e) => {
                      e.stopPropagation();
                      studentTuitionModal.onOpen();
                      setSelectedRow({ student: row, tuitions: filtered });
                    }}
                    endContent={<Info size="12px" />}
                  >
                    {localeString(total)}đ
                  </Chip>
                </Tooltip>
              );
            }
            if (columnKey === "actions") {
              return (
                <Tooltip content="Thêm học phí">
                  <Button
                    size="sm"
                    color="primary"
                    variant="light"
                    onClick={(e) => e.stopPropagation()}
                    onPress={() => navigate(`/class-tuition/add?classId=${selectedClass}&studentId=${row.id}`)}
                  >
                    <PlusCircle size="20px" />
                  </Button>
                </Tooltip>
              );
            }
            return cellValue;
          }}
        />
      </TableProvider>
    </ModuleLayout>
  );
};

const columns = [
  { name: "STT", uid: "index", disableSort: true },
  { name: "Học viên", uid: "name" },
  { name: "Số điện thoại", uid: "phoneNumber" },
  { name: "Đã thanh toán", uid: "paid", disableSort: true },
  { name: "Thao tác", uid: "actions", disableSort: true },
];

const defaultOrder = ORDER_BY_NAME;
const defaultSelectedColumns = ["index", "name", "phoneNumber", "paid", "actions"];

export default ClassTuition;
