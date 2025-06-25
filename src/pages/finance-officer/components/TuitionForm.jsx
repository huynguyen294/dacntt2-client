import { classApi, tuitionApi } from "@/apis";
import { CurrencyInput, Section } from "@/components/common";
import { DATE_FORMAT, getClassCode, getCode, getStudentCode, getYearCode, ORDER_BY_NAME } from "@/constants";
import { useMetadata, useNavigate, useServerList } from "@/hooks";
import { generateUid, shiftFormat } from "@/utils";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { DatePicker } from "@heroui/date-picker";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";
import { parseDate } from "@internationalized/date";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, RefreshCcw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Controller, Form, useForm } from "react-simple-formkit";

const TuitionForm = ({ defaultValues = {}, editMode }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm({ numberFields });
  const { isError, isDirty, actions } = form;
  const { shiftObj } = useMetadata();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [selectedClass, setSelectedClass] = useState(defaultValues.classId);

  const studentResult = useQuery({
    queryKey: ["classes", selectedClass, "students", "refFields=:full", JSON.stringify(ORDER_BY_NAME)],
    queryFn: () =>
      selectedClass ? classApi.getClassStudents(selectedClass, ORDER_BY_NAME, ["refFields=:full"]) : null,
  });
  const classList = useServerList("classes", classApi.get, {
    order: ORDER_BY_NAME,
    paging: false,
  });

  const handleSubmit = async (data) => {
    setLoading(true);
    if (editMode) {
      const { id, ...removed } = defaultValues;
      const result = await tuitionApi.update(id, { ...removed, ...data });
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: ["tuitions"] });
        navigate(-1);
      } else {
        addToast({ color: "danger", title: "Lỗi khi sửa học phí", description: result.message });
      }
      return;
    }

    const result = await tuitionApi.create(data);
    if (result.ok) {
      queryClient.invalidateQueries({ queryKey: ["tuitions"] });
      navigate(-1);
    } else {
      addToast({ color: "danger", title: "Lỗi khi tạo học phí", description: result.message });
    }
    setLoading(false);
  };

  const handleChange = ({ studentId, classId, content }) => {
    if (studentId && classId && !content) {
      const newContent = [getYearCode(), getStudentCode(studentId), getClassCode(classId), generateUid()].join("_");
      actions.setValue("content", newContent, { shouldOnChange: false });
    }
  };

  useEffect(() => {
    const classId = searchParams.get("classId");
    if (classId && classId !== "undefined") setSelectedClass(classId);
    actions.setValue({}, null, { shouldOnChange: true });
  }, []);

  const studentId = searchParams.get("studentId");
  const defaultStudentId = defaultValues.studentId || (studentId !== "undefined" && Number(studentId));

  return (
    <Form form={form} onSubmit={handleSubmit} onChange={handleChange} className="w-full space-y-4">
      <Section title="Thông tin" className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 pb-4">
          <Controller
            name="classId"
            defaultValue={(defaultValues.classId && defaultValues.classId.toString()) || searchParams.get("classId")}
            render={({ ref, name, defaultValue, setValue, value }) => (
              <Select
                isRequired
                ref={ref}
                name={name}
                selectedKeys={value && new Set([value.toString()])}
                isLoading={classList.isLoading}
                defaultSelectedKeys={defaultValue && new Set([defaultValue.toString()])}
                onSelectionChange={(keys) => {
                  setValue([...keys][0]);
                  setSelectedClass([...keys][0]);
                  actions.instantChange();
                }}
                items={classList.list}
                size="lg"
                variant="bordered"
                label="Lớp học"
                radius="sm"
                labelPlacement="outside"
                placeholder="Chọn lớp học"
                listboxProps={classList.listboxProps}
              >
                {(c) => (
                  <SelectItem key={c.id.toString()} description={shiftFormat(shiftObj[c.shiftId])}>
                    {`${getCode("class", c.id)}: ${c.name}`}
                  </SelectItem>
                )}
              </Select>
            )}
          />
          <Controller
            name="studentId"
            defaultValue={defaultStudentId && defaultStudentId.toString()}
            render={({ ref, name, defaultValue, setValue, value }) => (
              <Autocomplete
                isRequired
                ref={ref}
                name={name}
                selectedKey={value && value.toString()}
                isLoading={studentResult.isLoading}
                defaultSelectedKey={defaultValue && defaultValue.toString()}
                onSelectionChange={(key) => {
                  setValue(key);
                  actions.instantChange();
                }}
                items={studentResult.data?.students || []}
                size="lg"
                variant="bordered"
                label="Học sinh"
                radius="sm"
                labelPlacement="outside"
                placeholder="Chọn học sinh"
                listboxProps={{ emptyContent: "Vui lòng chọn lớp học" }}
              >
                {studentResult.data?.students &&
                  studentResult.data?.students.map((item) => (
                    <AutocompleteItem
                      key={item.id.toString()}
                      startContent={
                        <div>
                          <Avatar src={item.imageUrl} />
                        </div>
                      }
                      description={item.email}
                    >
                      {`${getCode("user", item.id)}: ${item.name}`}
                    </AutocompleteItem>
                  ))}
              </Autocomplete>
            )}
          />
          <Controller
            name="content"
            defaultValue={defaultValues.content}
            render={({ ref, name, defaultValue, value, setValue }) => (
              <Input
                ref={ref}
                isRequired
                isReadOnly
                defaultValue={defaultValue}
                name={name}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                size="lg"
                variant="bordered"
                label="Mã thanh toán"
                radius="sm"
                labelPlacement="outside"
                placeholder="Hiển thị mã thanh toán"
              />
            )}
          />
          <CurrencyInput
            autoFocus={searchParams.get("studentId")}
            defaultValue={defaultValues.amount}
            isRequired
            name="amount"
            size="lg"
            variant="bordered"
            label="Số tiền"
            radius="sm"
            labelPlacement="outside"
            placeholder="Nhập số tiền"
          />
          <DatePicker
            isRequired
            onChange={actions.instantChange}
            defaultValue={
              defaultValues.date
                ? parseDate(format(defaultValues.date, DATE_FORMAT))
                : parseDate(format(new Date(), DATE_FORMAT))
            }
            name="date"
            calendarProps={{ showMonthAndYearPickers: true }}
            size="lg"
            variant="bordered"
            label="Ngày thanh toán"
            radius="sm"
            labelPlacement="outside"
            classNames={{ label: "-mt-1" }}
          />
          <Input
            name="note"
            size="lg"
            variant="bordered"
            label="Ghi chú"
            radius="sm"
            labelPlacement="outside"
            placeholder="Nhập ghi chú"
            defaultValue={defaultValues.note}
          />
        </div>
      </Section>
      <div className="space-x-4">
        <Button
          isLoading={loading}
          isDisabled={!isDirty || isError}
          type="submit"
          startContent={editMode ? <Save size="20px" /> : <Plus size="20px" />}
          className="shadow-xl"
          color="primary"
        >
          {editMode ? "Lưu thay đổi" : "Thêm học phí"}
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

const numberFields = ["amount", "classId", "studentId"];

export default TuitionForm;
