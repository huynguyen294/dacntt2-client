import { classApi, courseApi, userApi } from "@/apis";
import { Collapse, CurrencyInput } from "@/components/common";
import { COURSE_LEVELS, COURSE_STATUSES, DATE_FORMAT, EMPLOYEE_STATUS } from "@/constants";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, RefreshCcw, Save } from "lucide-react";
import { useState } from "react";
import { parseDate } from "@internationalized/date";
import { DatePicker } from "@heroui/date-picker";
import { useForm, Form, Controller } from "react-simple-formkit";
import { useMetadata, useNavigate, useServerList } from "@/hooks";
import { addToast } from "@heroui/toast";
import { Avatar } from "@heroui/avatar";

const ClassForm = ({ editMode, defaultValues = {} }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const form = useForm({ numberFields });
  const { isError, isDirty, actions } = form;
  const [loading, setLoading] = useState(false);
  const { loading: metadataLoading, shifts } = useMetadata();

  const teacherList = useServerList("users", userApi.get, {
    filters: { status: EMPLOYEE_STATUS.active },
    otherParams: ["role=teacher", "fields=:basic"],
  });

  const courseList = useServerList("courses", courseApi.get, {
    filters: { status: COURSE_STATUSES.active },
    otherParams: ["fields=:full"],
  });

  const handleChange = (data) => {
    const courseId = data.courseId;
    const found = courseId && courseList.list.find((c) => c.id === Number(courseId));

    if (found) {
      const { tuitionFee, numberOfStudents, numberOfLessons, description, level } = found;
      const newCourseValues = { tuitionFee, numberOfStudents, numberOfLessons, description, level };

      const formState = actions.getFormState();
      let isBlank = true;
      Object.keys(newCourseValues).forEach((key) => {
        if (formState[key]) isBlank = false;
      });

      if (isBlank) {
        actions.setValue(newCourseValues, null, { shouldOnChange: false });
      }
    } else {
      actions.setValue(
        {
          tuitionFee: undefined,
          numberOfStudents: undefined,
          numberOfLessons: undefined,
          description: undefined,
          level: undefined,
        },
        null,
        { shouldOnChange: false }
      );
    }
  };

  const handleSubmit = async (data) => {
    setLoading(true);

    if (editMode) {
      const { id, ...removed } = defaultValues;
      const result = await classApi.update(id, { ...removed, ...data });
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        navigate("/classes");
      } else {
        addToast({ color: "danger", title: "Lỗi khi sửa lớp học", description: result.message });
      }
      return;
    }

    const result = await classApi.create(data);
    if (result.ok) {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      navigate("/classes");
    } else {
      addToast({ color: "danger", title: "Lỗi khi tạo lớp học", description: result.message });
    }

    setLoading(false);
  };

  return (
    <Form
      key={form.lastReloadedAt}
      form={form}
      onSubmit={handleSubmit}
      onChange={handleChange}
      className="w-full space-y-4"
    >
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
          <Controller
            name="weekDays"
            defaultValue={defaultValues.weekDays}
            render={({ ref, name, defaultValue, value, setValue }) => (
              <Select
                ref={ref}
                name={name}
                selectedKeys={new Set(value ? value.split(",") : [])}
                isRequired
                selectionMode="multiple"
                onSelectionChange={(keys) => setValue([...keys].join(","))}
                onChange={actions.instantChange}
                defaultSelectedKeys={new Set(defaultValue ? defaultValue.split(",") : [])}
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
            )}
          />
          <Controller
            name="shiftId"
            defaultValue={defaultValues.shiftId}
            render={({ ref, value, defaultValue, name, setValue }) => (
              <Select
                ref={ref}
                selectedKeys={value && new Set([value.toString()])}
                isRequired
                name={name}
                isLoading={metadataLoading}
                onSelectionChange={(newValue) => {
                  setValue([...newValue][0]);
                  actions.instantChange();
                }}
                defaultSelectedKeys={defaultValue ? new Set([defaultValue.toString()]) : new Set([])}
                size="lg"
                variant="bordered"
                label="Ca học"
                radius="sm"
                labelPlacement="outside"
                placeholder="Chọn ca học"
              >
                {shifts &&
                  shifts.map((s) => (
                    <SelectItem key={s.id.toString()}>
                      {`${s.name} (${s.startTime.slice(0, 5)} - ${s.endTime.slice(0, 5)})`}
                    </SelectItem>
                  ))}
              </Select>
            )}
          />
          <Controller
            name="teacherId"
            defaultValue={defaultValues.teacherId && defaultValues.teacherId.toString()}
            render={({ ref, name, defaultValue, value, setValue }) => (
              <Autocomplete
                ref={ref}
                size="lg"
                radius="sm"
                name={name}
                selectedKey={value}
                variant="bordered"
                label="Giáo viên phụ trách"
                labelPlacement="outside"
                placeholder="Chọn giáo viên"
                isLoading={teacherList.isLoading}
                onSelectionChange={(newValue) => {
                  setValue(newValue);
                  actions.instantChange();
                }}
                items={teacherList.list}
                defaultSelectedKey={defaultValue}
                listboxProps={{
                  bottomContent: teacherList.hasMore && <LoadMoreButton onLoadMore={teacherList.onLoadMore} />,
                }}
              >
                {(u) => (
                  <AutocompleteItem
                    key={u.id.toString()}
                    startContent={
                      <div className="size-10">
                        <Avatar src={u.imageUrl} />
                      </div>
                    }
                    description={u.email}
                  >
                    {u.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            )}
          />
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
          <Controller
            name="courseId"
            defaultValue={defaultValues.courseId && defaultValues.courseId.toString()}
            render={({ ref, name, defaultValue, setValue, value }) => (
              <Autocomplete
                ref={ref}
                name={name}
                selectedKey={value}
                isLoading={courseList.isLoading}
                defaultSelectedKey={defaultValue}
                onSelectionChange={(newValue) => {
                  setValue(newValue);
                  actions.instantChange();
                }}
                items={courseList.list}
                size="lg"
                variant="bordered"
                label="Khóa học"
                radius="sm"
                labelPlacement="outside"
                placeholder="Chọn lớp học"
              >
                {(course) => <AutocompleteItem key={course.id}>{course.name}</AutocompleteItem>}
              </Autocomplete>
            )}
          />
          <Controller
            name="tuitionFee"
            defaultValue={defaultValues.tuitionFee}
            render={({ value, setValue, name, defaultValue }) => (
              <CurrencyInput
                defaultValue={defaultValue}
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
            name="numberOfStudents"
            defaultValue={defaultValues.numberOfStudents}
            render={({ value, setValue, name, ref, defaultValue }) => (
              <Input
                ref={ref}
                isRequired
                value={value}
                onChange={(e) => setValue(e.target.value)}
                defaultValue={defaultValue}
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
            name="numberOfLessons"
            defaultValue={defaultValues.numberOfLessons}
            render={({ value, setValue, name, ref, defaultValue }) => (
              <Input
                ref={ref}
                isRequired
                name={name}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                defaultValue={defaultValue}
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
            name="description"
            defaultValue={defaultValues.description}
            render={({ value, setValue, name, ref, defaultValue }) => (
              <Input
                ref={ref}
                size="lg"
                name={name}
                value={value || ""}
                onChange={(e) => setValue(e.target.value)}
                defaultValue={defaultValue}
                variant="bordered"
                label="Mô tả"
                radius="sm"
                labelPlacement="outside"
                placeholder="Nhập mô tả ngắn"
              />
            )}
          />
          <Controller
            name="level"
            defaultValue={defaultValues.level}
            render={({ value, setValue, name, defaultValue, ref }) => (
              <Select
                ref={ref}
                selectedKeys={value && new Set([value.toString()])}
                onSelectionChange={(set) => setValue([...set][0])}
                name={name}
                defaultSelectedKeys={new Set(defaultValue ? [defaultValue.toString()] : [])}
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
          isDisabled={!isDirty || isError}
          type="submit"
          startContent={editMode ? <Save size="20px" /> : <Plus size="20px" />}
          className="shadow-xl"
          color="primary"
        >
          {editMode ? "Lưu thay đổi" : "Thêm lớp học"}
        </Button>
        <Button
          isDisabled={!isDirty}
          type="reset"
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

const numberFields = ["level", "numberOfLessons", "numberOfStudents", "tuitionFee", "teacherId", "shiftId", "courseId"];

export default ClassForm;
