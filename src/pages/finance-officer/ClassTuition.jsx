/* eslint-disable react-hooks/exhaustive-deps */
import { ModuleLayout } from "@/layouts";
import { classTuitionBreadcrumbItems } from "./constants";
import { useMetadata, useNavigate, useServerList, useTable } from "@/hooks";
import { Table, TableProvider } from "@/components/common";
import { useDisclosure } from "@heroui/modal";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { classApi, tuitionApi, tuitionDiscountApi } from "@/apis";
import { Ban, ChevronDown, Info, Plus, PlusCircle } from "lucide-react";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { format } from "date-fns";
import { DATE_FORMAT, getCode, ORDER_BY_NAME } from "@/constants";
import { localeString, shiftFormat } from "@/utils";
import { useSearchParams } from "react-router";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import StudentTuitionModal from "./components/StudentTuitionModal";
import { Divider } from "@heroui/divider";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { addToast } from "@heroui/toast";

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
  const tuitionDiscountResult = useQuery({
    queryKey: ["tuition-discounts", null, null, null, JSON.stringify(mergedFilters)],
    queryFn: () => (selectedClass ? tuitionDiscountApi.get(null, null, null, mergedFilters) : null),
  });
  const studentResult = useQuery({
    queryKey: ["classes", selectedClass || null, "students", "refFields=:full", JSON.stringify(order)],
    queryFn: () => (selectedClass ? classApi.getClassStudents(selectedClass, order, ["refFields=:full"]) : null),
  });

  const students = studentResult.data?.students || [];
  const tuitions = tuitionResult.data?.rows || [];
  const tuitionDiscounts = tuitionDiscountResult.data?.rows || [];
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
                      {`${getCode("class", item.id)}: ${item.name}`}
                    </SelectItem>
                  );
                }}
              </Select>
              <Chip className="rounded-medium h-10 bg-default-100" variant="flat">
                Học phí: {localeString(foundClass?.tuitionFee)}đ
              </Chip>
              <Divider orientation="vertical" className="h-6 mx-1" />
              <p className="whitespace-nowrap">
                {table.selectedKeys === "all" ? students.length || 0 : table.selectedKeys.size} Đã chọn
              </p>
              {(table.selectedKeys === "all" || table.selectedKeys.size > 0) && (
                <Dropdown showArrow>
                  <DropdownTrigger>
                    <Button
                      size="sm"
                      variant="flat"
                      className="font-semibold min-w-fit"
                      endContent={<ChevronDown size="13px" />}
                    >
                      Thao tác nhiều
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu disallowEmptySelection variant="flat">
                    <DropdownItem
                      onPress={() => {
                        addToast({ color: "danger", title: "Lỗi!", description: "Chức năng chưa hỗ trợ" });
                      }}
                    >
                      Thêm học phí
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
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
              const discounts = tuitionDiscounts.filter((td) => td.studentId === row.id);
              const discountDiscount = tuitionDiscounts.reduce((acc, curr) => acc + curr.amount, 0);
              return (
                <Tooltip content="Xem chi tiết">
                  <Button
                    size="sm"
                    radius="full"
                    className="h-6 text-sm"
                    variant="flat"
                    onClick={(e) => e.stopPropagation()}
                    onPress={() => {
                      studentTuitionModal.onOpen();
                      setSelectedRow({ student: row, tuitions: filtered, discounts });
                    }}
                    endContent={<Info size="12px" />}
                  >
                    {localeString(total + discountDiscount)}đ
                  </Button>
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
