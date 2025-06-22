import { classApi, tuitionDiscountApi } from "@/apis";
import { CurrencyInput, Section } from "@/components/common";
import { getClassCode, getStudentCode, getYearCode, ORDER_BY_NAME } from "@/constants";
import { useMetadata, useNavigate, useServerList } from "@/hooks";
import { generateUid, shiftFormat } from "@/utils";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, RefreshCcw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Controller, Form, useForm } from "react-simple-formkit";

const TuitionDiscountForm = ({ defaultValues = {}, editMode }) => {
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
      const result = await tuitionDiscountApi.update(id, { ...removed, ...data });
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: ["tuitions"] });
        navigate(-1);
      } else {
        addToast({ color: "danger", title: "Lỗi khi sửa học phí", description: result.message });
      }
      return;
    }

    const result = await tuitionDiscountApi.create(data);
    if (result.ok) {
      queryClient.invalidateQueries({ queryKey: ["tuitions"] });
      navigate(-1);
    } else {
      addToast({ color: "danger", title: "Lỗi khi tạo học phí", description: result.message });
    }
    setLoading(false);
  };

  const studentId = searchParams.get("studentId");
  const defaultStudentId = defaultValues.studentId || (studentId !== "undefined" && Number(studentId));

  return (
    <Form form={form} onSubmit={handleSubmit} className="w-full space-y-4">
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
                    {c.name}
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
                      {item.name}
                    </AutocompleteItem>
                  ))}
              </Autocomplete>
            )}
          />
          <Input
            isRequired
            name="reason"
            size="lg"
            variant="bordered"
            label="Lý do"
            radius="sm"
            labelPlacement="outside"
            defaultValue={defaultValues.reason}
            placeholder="Nhập lý do miễn giảm"
          />
          <CurrencyInput
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
          {editMode ? "Lưu thay đổi" : "Thêm miễn giảm"}
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

const numberFields = ["amount", "classId"];

export default TuitionDiscountForm;
