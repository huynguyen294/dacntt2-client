/* eslint-disable no-unused-vars */
import { classApi, courseApi, enrollmentApi, userApi } from "@/apis";
import { COURSE_STATUSES, DATE_FORMAT, ORDER_BY_NAME } from "@/constants";
import { useMetadata, useTable } from "@/hooks";
import { Select, SelectItem } from "@heroui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Table, TableProvider } from "./common";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { arrayToObject, displayDate, shiftFormat } from "@/utils";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";

const ClassAssignment = ({ studentIds = [], isSingleMode, onDone }) => {
  const queryClient = useQueryClient();
  const { pager, debounceQuery, order, filters } = useTable();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const { loading: metadataLoading, shifts, shiftObj } = useMetadata();

  const queryFilterKey = `p=${pager.page},ps=${pager.pageSize},q=${debounceQuery},o=${order.order},ob=${order.orderBy},ca=${filters.createdAt},c=${selectedCourse},s=${selectedShift}`;
  const { isLoading, data: classData } = useQuery({
    queryKey: ["classes", queryFilterKey],
    queryFn: () =>
      classApi.get(pager, order, debounceQuery, { ...filters, courseId: selectedCourse, shiftId: selectedShift }),
  });

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["users", "as-options", studentIds.join(",")],
    queryFn: () =>
      userApi.get(
        {},
        ORDER_BY_NAME,
        null,
        {},
        { otherParams: ["filter=id:in:" + studentIds.join(","), "fields=:basic"] }
      ),
  });

  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ["courses", "as-options"],
    queryFn: () =>
      courseApi.get({ paging: "false" }, { orderBy: "name", order: "asc" }, null, { status: COURSE_STATUSES.active }, [
        "fields=:basic",
      ]),
  });

  const { data: enrData, isLoading: enrLoading } = useQuery({
    queryKey: ["enrollments", studentIds[0]],
    queryFn: () => isSingleMode && enrollmentApi.getByStudents(studentIds),
  });

  const enrObj = useMemo(() => {
    if (!enrData) return {};
    return arrayToObject(enrData.rows, "classId");
  }, [enrData]);

  const handleEnroll = async (classId) => {
    setEnrolling(true);

    if (!isSingleMode) {
      const result = await enrollmentApi.create({
        enrollments: studentIds.map((studentId) => ({ studentId, classId })),
      });
      if (!result.ok) {
        addToast({ color: "danger", title: "Lỗi!", description: result.message });
        setEnrolling(false);
        return;
      }

      setEnrolling(false);
      onDone();
      return;
    }

    const result = await enrollmentApi.create({ studentId: studentIds[0], classId });
    if (!result.ok) {
      addToast({ color: "danger", title: "Lỗi!", description: result.message });
      setEnrolling(false);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["enrollments", studentIds[0]] });
    queryClient.invalidateQueries({ queryKey: ["classes"] });
    setEnrolling(false);
    onDone();
  };

  const handleLoadMore = () => {};

  return (
    <div className="pb-4 sm:pb-10">
      <div className="flex flex-col justify-start gap-2">
        <p className="font-semibold text-foreground-700 mr-2">Đang xếp lớp cho:</p>
        {userLoading && <Spinner variant="wave" />}
        <div className="flex gap-1 flex-wrap">
          {userData &&
            userData.rows.map((user) => (
              <Chip key={user.id} variant="flat" avatar={<Avatar src={user.imageUrl} />}>
                {user.name}
              </Chip>
            ))}
        </div>
      </div>
      <Divider className="my-4" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
        <Select
          isLoading={courseLoading}
          selectedKeys={new Set(selectedCourse ? [selectedCourse] : [])}
          onSelectionChange={(keys) => setSelectedCourse([...keys][0])}
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
          isLoading={metadataLoading}
          selectedKeys={new Set(selectedShift ? [selectedShift] : selectedShift)}
          onSelectionChange={(keys) => setSelectedShift([...keys][0])}
          size="lg"
          variant="bordered"
          label="Ca học"
          radius="sm"
          labelPlacement="outside"
          placeholder="Chọn ca học"
        >
          {shifts && shifts.map((s) => <SelectItem key={s.id.toString()}>{`${s.name} ${shiftFormat(s)}`}</SelectItem>)}
        </Select>
        <Select
          isLoading={metadataLoading}
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
      <TableProvider value={{ columns }}>
        <Table
          isLoading={isLoading || enrLoading}
          isHeaderSticky={false}
          classNames={{ wrapper: "shadow-none p-0 rounded-none mt-4" }}
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
              cellValue = displayDate(cellValue);
            }
            if (columnKey === "shiftId") {
              cellValue = shiftFormat(shiftObj[cellValue]);
            }
            if (columnKey === "actions") {
              const enrolled = isSingleMode ? Boolean(enrObj[rowData.id]) : false;

              return (
                <Button
                  size="sm"
                  isDisabled={enrolled}
                  onClick={(e) => e.stopPropagation()}
                  onPress={() => !enrolled && handleEnroll(rowData.id)}
                  radius="full"
                  isLoading={enrolling}
                  color={enrolled ? "default" : "primary"}
                >
                  {enrolled ? "Đã đăng ký" : "Xếp vào lớp này"}
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

const columns = [
  { uid: "index", name: "STT" },
  { uid: "name", name: "Tên lớp" },
  { uid: "weekDays", name: "Ngày học" },
  { uid: "shiftId", name: "Ca học" },
  { uid: "openingDay", name: "Ngày khai giảng" },
  { uid: "closingDay", name: "Ngày kết thúc" },
  { uid: "actions", name: "Thao tác" },
];

export default ClassAssignment;
