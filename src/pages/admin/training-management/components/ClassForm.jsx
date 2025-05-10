import { getCourses, getShifts, getUsersWithRole } from "@/apis";
import { Collapse, Controller, CurrencyInput, Form } from "@/components/common";
import { COURSE_LEVELS, COURSE_STATUSES, DATE_FORMAT } from "@/constants";
import { useForm } from "@/hooks";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, RefreshCcw, Save } from "lucide-react";
import { useState } from "react";
import { parseDate } from "@internationalized/date";
import { DatePicker } from "@heroui/date-picker";

const ClassForm = ({ editMode, defaultValues = {} }) => {
  const form = useForm({ numberFields });
  const { isError, isDirty, actions } = form;
  const [loading, setLoading] = useState(false);

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["all-users"],
    queryFn: () =>
      getUsersWithRole(
        { paging: "false" },
        { orderBy: "name", order: "asc" },
        null,
        { status: "Đang làm việc" },
        "teacher"
      ),
  });

  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: () =>
      getCourses({ paging: "false" }, { orderBy: "name", order: "asc" }, null, { status: COURSE_STATUSES[0] }),
  });

  const { data: shiftData, isLoading: shiftLoading } = useQuery({
    queryKey: ["shifts"],
    queryFn: () => getShifts({ paging: "false" }, { orderBy: "name", order: "asc" }, null, {}),
  });

  const handleSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    setLoading(false);
  };

  return (
    <Form form={form} onSubmit={handleSubmit} className="w-full space-y-4">
      <Collapse showDivider defaultExpanded variant="splitted" title="Thông tin cơ bản" className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 pb-4">
          <Input
            autoFocus
            name={"name"}
            defaultValue={defaultValues.name}
            isRequired
            size="lg"
            variant="bordered"
            label="Tên lớp học"
            radius="sm"
            labelPlacement="outside"
            placeholder="Nhập tên lớp học"
          />
          <Select
            isRequired
            name="weekDays"
            selectionMode="multiple"
            isLoading={shiftLoading}
            onChange={actions.instantChange}
            defaultSelectedKeys={defaultValues.weekDays ? new Set([defaultValues.weekDays.split(",")]) : new Set([])}
            size="lg"
            variant="bordered"
            label="Ngày học"
            radius="sm"
            labelPlacement="outside"
            placeholder="Chọn ngày học"
          >
            <SelectItem key="2">Thứ 2</SelectItem>
            <SelectItem key="3">Thứ 3</SelectItem>
            <SelectItem key="4">Thứ 4</SelectItem>
            <SelectItem key="5">Thứ 5</SelectItem>
            <SelectItem key="6">Thứ 6</SelectItem>
            <SelectItem key="7">Thứ 7</SelectItem>
            <SelectItem key="CN">Chủ nhật</SelectItem>
          </Select>
          <Select
            isRequired
            name="shifts"
            isLoading={shiftLoading}
            onChange={actions.instantChange}
            defaultSelectedKeys={defaultValues.shifts ? new Set([defaultValues.shifts.toString()]) : new Set([])}
            size="lg"
            variant="bordered"
            label="Ca học"
            radius="sm"
            labelPlacement="outside"
            placeholder="Chọn ca học"
          >
            {shiftData?.shifts &&
              shiftData.shifts.map((s) => (
                <SelectItem key={s.id.toString()}>
                  {`${s.name} (${s.startTime.slice(0, 5)} - ${s.endTime.slice(0, 5)})`}
                </SelectItem>
              ))}
          </Select>
          <Autocomplete
            name="teacherId"
            isLoading={userLoading}
            onChange={actions.instantChange}
            defaultSelectedKeys={defaultValues.teacherId ? new Set([defaultValues.teacherId.toString()]) : new Set([])}
            size="lg"
            variant="bordered"
            label="Giáo viên phụ trách"
            radius="sm"
            labelPlacement="outside"
            placeholder="Chọn giáo viên"
          >
            {userData?.users && userData?.users.map((u) => <AutocompleteItem key={u.id}>{u.name}</AutocompleteItem>)}
          </Autocomplete>
          <DatePicker
            isRequired
            onChange={actions.instantChange}
            defaultValue={
              defaultValues.openingDay
                ? parseDate(format(defaultValues.openingDay, DATE_FORMAT))
                : parseDate(format(new Date(), DATE_FORMAT))
            }
            name="openingDay"
            calendarProps={{ showMonthAndYearPickers: true }}
            size="lg"
            variant="bordered"
            label="Ngày khai giảng"
            radius="sm"
            labelPlacement="outside"
            classNames={{ label: "-mt-1" }}
          />
          <DatePicker
            isRequired
            onChange={actions.instantChange}
            defaultValue={
              defaultValues.closingDay
                ? parseDate(format(defaultValues.closingDay, DATE_FORMAT))
                : parseDate(format(new Date(), DATE_FORMAT))
            }
            name="closingDay"
            calendarProps={{ showMonthAndYearPickers: true }}
            size="lg"
            variant="bordered"
            label="Ngày kết thúc"
            radius="sm"
            labelPlacement="outside"
            classNames={{ label: "-mt-1" }}
          />
        </div>
      </Collapse>
      <Collapse showDivider defaultExpanded variant="splitted" title="Thông tin khóa học" className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 pb-4">
          <Autocomplete
            autoFocus
            name="courseId"
            isLoading={courseLoading}
            onChange={actions.instantChange}
            onSelectionChange={(courseId) => {
              const found = courseData.courses.find((c) => c.id === Number(courseId));
              if (found) {
                const { tuitionFee, numberOfStudents, numberOfLessons, description, level } = found;
                actions.setValue({ tuitionFee, numberOfStudents, numberOfLessons, description, level });
              }
              if (!courseId) {
                actions.setValue({
                  tuitionFee: undefined,
                  numberOfStudents: undefined,
                  numberOfLessons: undefined,
                  description: undefined,
                  level: undefined,
                });
              }
            }}
            defaultSelectedKeys={defaultValues.level ? new Set([defaultValues.level.toString()]) : new Set([])}
            size="lg"
            variant="bordered"
            label="Khóa học"
            radius="sm"
            labelPlacement="outside"
            placeholder="Chọn khóa học"
          >
            {courseData?.courses &&
              courseData?.courses.map((course) => <AutocompleteItem key={course.id}>{course.name}</AutocompleteItem>)}
          </Autocomplete>
          <Controller
            form={form}
            name="tuitionFee"
            render={({ value, setValue, name }) => (
              <CurrencyInput
                defaultValue={defaultValues.tuitionFee}
                isRequired
                value={value}
                onChange={(e) => setValue(e.target.value)}
                name={name}
                size="lg"
                variant="bordered"
                label="Học phí"
                radius="sm"
                labelPlacement="outside"
                placeholder="Nhập học phí"
              />
            )}
          />
          <Controller
            form={form}
            name="numberOfStudents"
            render={({ value, setValue, name, ref }) => (
              <Input
                ref={ref}
                isRequired
                value={value}
                onChange={(e) => setValue(e.target.value)}
                defaultValue={defaultValues.numberOfStudents}
                name={name}
                size="lg"
                variant="bordered"
                label="Số lượng học viên"
                type="number"
                radius="sm"
                labelPlacement="outside"
                placeholder="Nhập số học viên"
              />
            )}
          />
          <Controller
            form={form}
            name="numberOfLessons"
            render={({ value, setValue, name, ref }) => (
              <Input
                ref={ref}
                isRequired
                name={name}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                defaultValue={defaultValues.numberOfLessons}
                size="lg"
                variant="bordered"
                label="Số buổi học"
                type="number"
                radius="sm"
                labelPlacement="outside"
                placeholder="Nhập số buổi học"
              />
            )}
          />
          <Controller
            form={form}
            name="description"
            render={({ value, setValue, name, ref }) => (
              <Input
                ref={ref}
                size="lg"
                name={name}
                value={value || ""}
                onChange={(e) => setValue(e.target.value)}
                defaultValue={defaultValues.description}
                variant="bordered"
                label="Mô tả"
                radius="sm"
                labelPlacement="outside"
                placeholder="Nhập mô tả ngắn"
              />
            )}
          />
          <Controller
            form={form}
            name="level"
            render={({ value, setValue, name }) => (
              <Select
                selectedKeys={new Set(value ? [value.toString()] : [])}
                onSelectionChange={(set) => setValue([...set][0])}
                name={name}
                onChange={actions.instantChange}
                defaultSelectedKeys={new Set(defaultValues.level ? [defaultValues.level.toString()] : [])}
                size="lg"
                variant="bordered"
                label="Cấp độ"
                radius="sm"
                labelPlacement="outside"
                placeholder="Sơ cấp, trung cấp..."
              >
                <SelectItem key={"1"}>{COURSE_LEVELS[1]}</SelectItem>
                <SelectItem key={"2"}>{COURSE_LEVELS[2]}</SelectItem>
                <SelectItem key={"3"}>{COURSE_LEVELS[3]}</SelectItem>
              </Select>
            )}
          />
        </div>
      </Collapse>
      <div className="space-x-4">
        <Button
          isLoading={loading}
          isDisabled={isError}
          type="submit"
          startContent={editMode ? <Save size="20px" /> : <Plus size="20px" />}
          className="shadow-xl"
          color="primary"
        >
          {editMode ? "Lưu thay đổi" : "Thêm lớp học"}
        </Button>
        <Button
          isDisabled={!isDirty}
          onPress={() => actions.reset()}
          startContent={<RefreshCcw size="16px" />}
          className="shadow-xl"
          variant="flat"
        >
          Đặt lại
        </Button>
      </div>
    </Form>
  );
};

const numberFields = ["level", "numberOfLessons", "numberOfStudents", "tuitionFee"];

export default ClassForm;
