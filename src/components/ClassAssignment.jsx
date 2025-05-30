/* eslint-disable no-unused-vars */
import { classApi, courseApi, enrollmentApi, userApi } from "@/apis";
import { COURSE_STATUSES } from "@/constants";
import { useMetadata, useServerList } from "@/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { LoadMoreButton, Table, TableProvider } from "./common";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { arrayToObject, displayDate, shiftFormat } from "@/utils";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";

const ClassAssignment = ({ studentIds = [], isSingleMode, onDone }) => {
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const { loading: metadataLoading, shifts, shiftObj } = useMetadata();

  const classList = useServerList("classes", classApi.get, {
    filters: { courseId: selectedCourse, shiftId: selectedShift, teacherId: selectedTeacher },
    otherParams: ["fields=:basic", "filter=id:in:" + studentIds.join(",")],
  });
  const studentList = useServerList("users", userApi.get, {
    otherParams: ["fields=:basic", "filter=id:in:" + studentIds.join(",")],
  });
  const teacherList = useServerList("users", userApi.get, { filters: { role: ["teacher"] } });
  const courseList = useServerList("users", courseApi.get, { filters: { status: COURSE_STATUSES.active } });

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

  return (
    <div className="pb-4 sm:pb-10">
      <div className="flex flex-col justify-start gap-2">
        <p className="font-semibold text-foreground-700 mr-2">Đang xếp lớp cho:</p>
        {studentList.isLoading && <Spinner variant="wave" />}
        <div className="flex gap-1 flex-wrap">
          {studentList.ready &&
            studentList.list.map((user) => (
              <Chip key={user.id} variant="flat" avatar={<Avatar src={user.imageUrl} />}>
                {user.name}
              </Chip>
            ))}
        </div>
      </div>
      <Divider className="my-4" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
        <Autocomplete
          isLoading={courseList.isLoading}
          selectedKey={selectedCourse}
          onSelectionChange={setSelectedCourse}
          size="lg"
          variant="bordered"
          label="Khóa học"
          radius="sm"
          items={courseList.list}
          labelPlacement="outside"
          placeholder="Chọn khóa học"
          isVirtualized
          maxListboxHeight={265}
          itemHeight={40}
          listboxProps={{
            bottomContent: courseList.hasMore && <LoadMoreButton onLoadMore={courseList.onLoadMore} />,
          }}
        >
          {(course) => <AutocompleteItem key={course.id}>{course.name}</AutocompleteItem>}
        </Autocomplete>
        <Autocomplete
          isLoading={metadataLoading}
          selectedKey={selectedShift}
          onSelectionChange={setSelectedShift}
          items={shifts}
          size="lg"
          variant="bordered"
          label="Ca học"
          radius="sm"
          labelPlacement="outside"
          placeholder="Chọn ca học"
        >
          {(s) => <AutocompleteItem key={s.id.toString()}>{`${s.name} ${shiftFormat(s)}`}</AutocompleteItem>}
        </Autocomplete>
        <Autocomplete
          isLoading={teacherList.isLoading}
          selectedKey={selectedTeacher}
          onSelectionChange={setSelectedTeacher}
          items={teacherList.list}
          isVirtualized
          maxListboxHeight={265}
          itemHeight={50}
          size="lg"
          variant="bordered"
          label="Giáo viên"
          radius="sm"
          labelPlacement="outside"
          placeholder="Chọn giáo viên"
          listboxProps={{
            bottomContent: teacherList.hasMore && <LoadMoreButton onLoadMore={teacherList.onLoadMore} />,
          }}
        >
          {(t) => (
            <AutocompleteItem
              key={t.id.toString()}
              startContent={
                <div className="size-10">
                  <Avatar src={t.imageUrl} />
                </div>
              }
              description={t.email}
            >
              {t.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
      </div>
      <TableProvider value={{ columns }}>
        <Table
          isLoading={classList.isLoading || enrLoading}
          isHeaderSticky={false}
          classNames={{ wrapper: "shadow-none p-0 rounded-none mt-4" }}
          rows={classList.list}
          selectionMode="none"
          bottomContent={classList.hasMore && <LoadMoreButton onLoadMore={classList.onLoadMore} />}
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
