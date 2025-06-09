import { classApi, courseApi, studentConsultationApi, userApi } from "@/apis";
import { UserBasicFields } from "@/components";
import { Dot, LoadMoreButton, Section } from "@/components/common";
import { ADMISSION_STATUSES, COURSE_STATUSES, EMPLOYEE_STATUS, getAdmissionColor, ORDER_BY_NAME } from "@/constants";
import { useMetadata, useNavigate, useServerList } from "@/hooks";
import { useAppStore } from "@/state";
import { generateUid, shiftFormat } from "@/utils";
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const user = useAppStore("user");
  const userId = searchParams.get("userId");

  const form = useForm({ numberFields });
  const { isDirty, isError, actions } = form;

  const [selectedCourse, setSelectedCourse] = useState(defaultValues.expectedCourseId);

  const { loading: metadataLoading, shiftObj } = useMetadata();

  const consultantList = useServerList("users", userApi.get, {
    filters: { status: EMPLOYEE_STATUS.active },
    otherParams: ["fields=:basic", "role=consultant"],
    searchPlaceholder: "Tìm theo tên, email...",
  });

  const statusActive = { status: COURSE_STATUSES.active };
  const courseList = useServerList("courses", courseApi.get, { filters: statusActive });
  const classFilters = {};
  if (selectedCourse) classFilters.courseId = selectedCourse;
  const classList = useServerList("classes", classApi.get, { filters: classFilters });

  const handleSubmit = async (data) => {
    setLoading(true);

    if (editMode) {
      const { id, ...removed } = defaultValues;

      const newAdmission = { ...removed, ...data };
      if (newAdmission.status === ADMISSION_STATUSES.accepted && !newAdmission.studentId) {
        newAdmission.password = generateUid();
      }

      const result = await studentConsultationApi.update(id, newAdmission);
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: ["admissions"] });
      } else {
        addToast({ color: "danger", title: "Lỗi!", description: result.message });
      }

      onReload();
      addToast({ color: "success", title: "Thành công!", description: "Lưu dữ liệu thành công" });
      setLoading(false);
      return;
    }

    const newAdmission = { ...data, studentId: userId };
    if (newAdmission.status === ADMISSION_STATUSES.accepted && !newAdmission.studentId) {
      newAdmission.password = generateUid();
    }

    const result = await studentConsultationApi.create(newAdmission);
    if (result.ok) {
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
    } else {
      addToast({ color: "danger", title: "Lỗi!", description: result.message });
    }

    onReload();
    navigate(`/register-admission?step=1&admissionId=${result.created.id}`);
    addToast({ color: "success", title: "Thành công!", description: "Lưu dữ liệu thành công" });
    setLoading(false);
  };

  const handleFormChange = (data) => {
    if (!data.consultantId) {
      actions.setValue("status", ADMISSION_STATUSES.pending, { shouldOnChange: false });
    } else if (!data.status || data.status === ADMISSION_STATUSES.pending) {
      actions.setValue("status", ADMISSION_STATUSES.working, { shouldOnChange: false });
    }
  };

  return (
    <>
      <Form
        form={form}
        onSubmit={handleSubmit}
        onChange={handleFormChange}
        className="flex-1 px-2 sm:px-10 w-full space-y-4"
      >
        <Section title="Thông tin học viên" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 pb-4">
            <UserBasicFields
              hideImage
              disableCheckMail={defaultValues.studentId}
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
                <Select
                  ref={ref}
                  name={name}
                  size="lg"
                  radius="sm"
                  variant="bordered"
                  label="Tư vấn viên"
                  labelPlacement="outside"
                  placeholder="Chọn tư vấn viên"
                  isReadOnly={user.role === "consultant"}
                  isLoading={consultantList.isLoading}
                  items={consultantList.list}
                  selectedKeys={user.role === "consultant" ? user.id.toString() : value && new Set([value.toString()])}
                  defaultSelectedKeys={defaultValue && new Set([defaultValue.toString()])}
                  onSelectionChange={(keys) => {
                    setValue([...keys][0]);
                    actions.instantChange();
                  }}
                  listboxProps={consultantList.listboxProps}
                  isVirtualized
                  maxListboxHeight={265}
                  itemHeight={50}
                >
                  {(u) => (
                    <SelectItem
                      startContent={
                        <div>
                          <Avatar src={u.imageUrl} />
                        </div>
                      }
                      description={u.email}
                      key={u.id.toString()}
                    >
                      {u.name}
                    </SelectItem>
                  )}
                </Select>
              )}
            />
            <Controller
              name="expectedCourseId"
              defaultValue={defaultValues.expectedCourseId}
              render={({ ref, name, value, defaultValue, setValue }) => {
                return (
                  <Select
                    ref={ref}
                    name={name}
                    size="lg"
                    radius="sm"
                    isRequired
                    variant="bordered"
                    label="Khóa học dự kiến"
                    labelPlacement="outside"
                    placeholder="Chọn khóa học dự kiến"
                    isLoading={courseList.isLoading}
                    items={courseList.list}
                    selectedKeys={value && new Set([value.toString()])}
                    defaultSelectedKes={defaultValue && new Set([defaultValue.toString()])}
                    onSelectionChange={(keys) => {
                      const newValue = [...keys][0];
                      setValue(newValue);
                      setSelectedCourse(newValue);
                      actions.instantChange();
                    }}
                    listboxProps={courseList.listboxProps}
                    isVirtualized
                    maxListboxHeight={265}
                    itemHeight={40}
                  >
                    {(c) => <SelectItem key={c.id.toString()}>{c.name}</SelectItem>}
                  </Select>
                );
              }}
            />
            <Controller
              name="expectedClassId"
              defaultValue={defaultValues.expectedClassId}
              render={({ ref, name, defaultValue, value, setValue }) => (
                <Select
                  ref={ref}
                  name={name}
                  size="lg"
                  radius="sm"
                  variant="bordered"
                  label="Lớp dự kiến"
                  labelPlacement="outside"
                  placeholder="Chọn lớp học dự kiến"
                  selectedKeys={value && new Set([value.toString()])}
                  defaultSelectedKeys={defaultValue && new Set([defaultValue.toString()])}
                  isLoading={classList.isLoading || metadataLoading}
                  onSelectionChange={(newValue) => {
                    setValue(newValue);
                    actions.instantChange();
                  }}
                  listboxProps={courseList.listboxProps}
                  isVirtualized
                  maxListboxHeight={265}
                  itemHeight={40}
                >
                  {classList.list.map((c) => (
                    <SelectItem key={c.id.toString()} description={shiftFormat(shiftObj[c.shiftId])}>
                      {c.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
            <Controller
              name="status"
              defaultValue={defaultValues.status || ADMISSION_STATUSES.pending}
              render={({ name, ref, value, setValue, defaultValue }) => (
                <Select
                  ref={ref}
                  name={name}
                  isRequired
                  selectedKeys={new Set([value])}
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
