import { classApi, courseApi, studentConsultationApi, userApi } from "@/apis";
import { UserBasicFields } from "@/components";
import { Dot, Section } from "@/components/common";
import { ADMISSION_STATUSES, COURSE_STATUSES, EMPLOYEE_STATUS, getAdmissionColor, ORDER_BY_NAME } from "@/constants";
import { useMetadata } from "@/hooks";
import { useAppStore } from "@/state";
import { shiftFormat } from "@/utils";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCcw, Save } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { Controller, Form, useForm } from "react-simple-formkit";

const numberFields = ["expectedClassId", "expectedCourseId", "consultantId"];
const AdmissionForm = ({ defaultValues = {}, editMode, onReload }) => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const user = useAppStore("user");
  const userId = searchParams.get("userId");

  const form = useForm({ numberFields });
  const { isDirty, isError, actions } = form;

  const [selectedCourse, setSelectedCourse] = useState(defaultValues.courseId);

  const { loading: metadataLoading, shiftObj } = useMetadata();

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["users", "as-options", "consultant"],
    queryFn: () =>
      userApi.get(
        {},
        ORDER_BY_NAME,
        null,
        { status: EMPLOYEE_STATUS.active },
        { otherParams: ["fields=:basic"], role: "consultant" }
      ),
  });

  const statusActive = { status: COURSE_STATUSES.active };
  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ["courses", "as-options"],
    queryFn: () => courseApi.get({}, ORDER_BY_NAME, null, statusActive, ["fields=:basic"]),
  });

  const classFilters = { ...statusActive };
  if (selectedCourse) classFilters.courseId = selectedCourse;
  const { data: classData, isLoading: classLoading } = useQuery({
    queryKey: ["classes", "as-options", classFilters.courseId],
    queryFn: () => classApi.get({}, ORDER_BY_NAME, null, classFilters, ["fields=:basic"]),
  });

  const handleSubmit = async (data) => {
    if (!userId && !defaultValues.id) {
      addToast({
        color: "danger",
        title: "Lỗi!",
        description: "Chức năng đăng ký cho người dùng mới chưa hoạt động, vui lòng đăng ký cho học viên cũ.",
      });
      return;
    }

    setLoading(true);

    if (editMode) {
      const { id, ...removed } = defaultValues;
      const result = await studentConsultationApi.update(id, { ...removed, ...data });
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: ["admissions"] });
      } else {
        addToast({ color: "danger", title: "Lỗi!", description: result.message });
      }

      setLoading(false);
      return;
    }

    data.studentId = userId;
    const result = await studentConsultationApi.create(data);
    if (result.ok) {
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
    } else {
      addToast({ color: "danger", title: "Lỗi!", description: result.message });
    }

    setLoading(false);
  };

  return (
    <>
      <Form form={form} onSubmit={handleSubmit} className="flex-1 px-2 sm:px-10 w-full space-y-4">
        <Section title="Thông tin học viên" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 pb-4">
            <UserBasicFields
              hideImage
              disableCheckMail={defaultValues.id}
              autoFocus={false}
              form={form}
              defaultValues={defaultValues}
              classNames={{ address: "col-span-1 lg:col-span-1" }}
            />
          </div>
        </Section>
        <Section title="Thông tin tư vấn" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 pb-4">
            <Controller
              name="consultantId"
              defaultValue={user.role === "consultant" ? user.id.toString() : defaultValues.consultantId}
              render={({ ref, name, defaultValue, value, setValue }) => (
                <Autocomplete
                  ref={ref}
                  name={name}
                  value={user.role === "consultant" ? user.id.toString() : value && value.toString()}
                  size="lg"
                  radius="sm"
                  isRequired
                  variant="bordered"
                  label="Tư vấn viên"
                  labelPlacement="outside"
                  placeholder="Chọn tư vấn viên"
                  isReadOnly={user.role === "consultant"}
                  isLoading={userLoading}
                  defaultSelectedKey={defaultValue && defaultValue.toString()}
                  onSelectionChange={(newValue) => {
                    setValue(newValue);
                    actions.instantChange();
                  }}
                >
                  {userData?.rows &&
                    userData?.rows.map((u) => (
                      <AutocompleteItem
                        startContent={
                          <div>
                            <Avatar size="sm" src={u.imageUrl} />
                          </div>
                        }
                        description={u.email}
                        key={u.id.toString()}
                      >
                        {u.name}
                      </AutocompleteItem>
                    ))}
                </Autocomplete>
              )}
            />
            <Controller
              name="expectedCourseId"
              defaultValue={defaultValues.expectedCourseId}
              render={({ ref, name, value, defaultValue, setValue }) => (
                <Autocomplete
                  ref={ref}
                  name={name}
                  value={value && value.toString()}
                  size="lg"
                  radius="sm"
                  variant="bordered"
                  label="Khóa học dự kiến"
                  labelPlacement="outside"
                  placeholder="Khóa học dự kiến"
                  isLoading={courseLoading}
                  defaultSelectedKey={defaultValue && defaultValue.toString()}
                  onSelectionChange={(newValue) => {
                    setValue(newValue);
                    setSelectedCourse(newValue);
                    actions.instantChange();
                  }}
                >
                  {courseData?.rows &&
                    courseData?.rows.map((c) => <AutocompleteItem key={c.id.toString()}>{c.name}</AutocompleteItem>)}
                </Autocomplete>
              )}
            />
            <Controller
              name="expectedClassId"
              defaultValue={defaultValues.expectedClassId}
              render={({ ref, name, defaultValue, value, setValue }) => (
                <Autocomplete
                  ref={ref}
                  name={name}
                  value={value}
                  size="lg"
                  radius="sm"
                  variant="bordered"
                  label="Lớp dự kiến"
                  labelPlacement="outside"
                  placeholder="Khóa học dự kiến"
                  defaultSelectedKey={defaultValue && defaultValue.toString()}
                  isLoading={classLoading || metadataLoading}
                  onSelectionChange={(newValue) => {
                    setValue(newValue);
                    actions.instantChange();
                  }}
                >
                  {classData?.rows &&
                    classData?.rows.map((c) => (
                      <AutocompleteItem key={c.id.toString()} description={shiftFormat(shiftObj[c.shiftId])}>
                        {c.name}
                      </AutocompleteItem>
                    ))}
                </Autocomplete>
              )}
            />
            <Controller
              name="status"
              defaultValue={defaultValues.status || ADMISSION_STATUSES.working}
              render={({ name, ref, value, setValue, defaultValue }) => (
                <Select
                  ref={ref}
                  name={name}
                  value={value}
                  isRequired
                  onSelectionChange={(keys) => {
                    setValue([...keys][0]);
                    actions.instantChange();
                  }}
                  defaultSelectedKeys={new Set(defaultValue ? [defaultValue] : [])}
                  startContent={<Dot variant={getAdmissionColor(value || defaultValue)} />}
                  size="lg"
                  variant="bordered"
                  label="Trạng thái"
                  radius="sm"
                  labelPlacement="outside"
                  placeholder="Chọn trạng thái"
                >
                  {Object.values(ADMISSION_STATUSES).map((status) => (
                    <SelectItem key={status} startContent={<Dot variant={getAdmissionColor(status)} />}>
                      {status}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
            <Input
              name="source"
              defaultValue={defaultValues.source}
              size="lg"
              variant="bordered"
              label="Nguồn khách hàng"
              radius="sm"
              labelPlacement="outside"
              placeholder="Tiktok, Facebook..."
            />
            <Input
              name="note"
              defaultValue={defaultValues.note}
              size="lg"
              variant="bordered"
              label="Ghi chú"
              radius="sm"
              labelPlacement="outside"
              placeholder="Nhập ghi chú thêm (nếu có)"
            />
          </div>
        </Section>
        <div className="space-x-4">
          <Button
            isLoading={loading}
            isDisabled={!isDirty || isError}
            type="submit"
            startContent={<Save size="20px" />}
            className="shadow-xl"
            color="primary"
          >
            Lưu dữ liệu
          </Button>
          <Button
            className="shadow-xl"
            type="reset"
            isDisabled={!isDirty}
            onPress={onReload}
            startContent={<RefreshCcw size="16px" />}
            variant="flat"
          >
            Đặt lại
          </Button>
        </div>
      </Form>
    </>
  );
};

export default AdmissionForm;
