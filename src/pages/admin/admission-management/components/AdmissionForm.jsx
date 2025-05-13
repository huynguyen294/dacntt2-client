import { getUsersWithRole } from "@/apis";
import { UserBasicFields } from "@/components";
import { Section } from "@/components/common";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useQuery } from "@tanstack/react-query";
import { MoveRight, Plus, RefreshCcw, Save } from "lucide-react";
import { useState } from "react";
import { Controller, Form, useForm } from "react-simple-formkit";

const AdmissionForm = ({ defaultValues = {}, editMode }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm();
  const { isDirty, isError, actions } = form;

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["all-users", "consultant"],
    queryFn: () =>
      getUsersWithRole(
        { paging: "false" },
        { orderBy: "name", order: "asc" },
        null,
        { status: "Đang làm việc" },
        "consultant"
      ),
  });

  const handleSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    setLoading(false);
  };

  return (
    <>
      <Form form={form} onSubmit={handleSubmit} className="flex-1 px-2 sm:px-10 w-full space-y-4">
        <Section title="Thông tin tư vấn" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 pb-4">
            <Controller
              name="consultantId"
              defaultValue={defaultValues.consultantId && defaultValues.consultantId.toString()}
              render={({ ref, name, defaultValue, value, setValue }) => (
                <Autocomplete
                  isRequired
                  ref={ref}
                  size="lg"
                  radius="sm"
                  name={name}
                  value={value}
                  variant="bordered"
                  label="Tư vấn viên"
                  labelPlacement="outside"
                  placeholder="Chọn giáo viên"
                  isLoading={userLoading}
                  onChange={actions.instantChange}
                  onSelectionChange={setValue}
                  defaultSelectedKey={defaultValue}
                >
                  {userData?.users &&
                    userData?.users.map((u) => <AutocompleteItem key={u.id.toString()}>{u.name}</AutocompleteItem>)}
                </Autocomplete>
              )}
            />
            <UserBasicFields
              hideImage
              autoFocus={false}
              form={form}
              defaultValues={defaultValues}
              classNames={{ address: "md:col-span-2 lg:col-span-3" }}
            />
            <Select
              name="status"
              isRequired
              onChange={actions.instantChange}
              defaultSelectedKeys={new Set(defaultValues.status ? [defaultValues.status] : ["Đang tư vấn"])}
              size="lg"
              variant="bordered"
              label="Trạng thái"
              radius="sm"
              labelPlacement="outside"
              placeholder="Chọn trạng thái"
            >
              <SelectItem key="Chờ tư vấn">Chờ tư vấn</SelectItem>
              <SelectItem key="Đang tư vấn">Đang tư vấn</SelectItem>
              <SelectItem key="Đã đồng ý">Đã đồng ý</SelectItem>
              <SelectItem key="Đã hủy">Đã hủy</SelectItem>
            </Select>
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
              defaultValue={defaultValues.source}
              size="lg"
              variant="bordered"
              label="Ghi chú"
              radius="sm"
              labelPlacement="outside"
              placeholder="Nhập ghi chú thêm (nếu có)"
            />
            <Controller
              name="expectedCourseId"
              defaultValue={defaultValues.expectedCourseId}
              render={({ ref, name, defaultValue, value, setValue }) => (
                <Autocomplete
                  isRequired
                  ref={ref}
                  size="lg"
                  radius="sm"
                  name={name}
                  value={value}
                  variant="bordered"
                  label="Khóa học dự kiến"
                  labelPlacement="outside"
                  placeholder="Chọn khóa học"
                  isLoading={userLoading}
                  onChange={actions.instantChange}
                  onSelectionChange={setValue}
                  defaultSelectedKey={defaultValue}
                >
                  <AutocompleteItem key={1}></AutocompleteItem>
                </Autocomplete>
              )}
            />
            <Controller
              name="expectedClassId"
              defaultValue={defaultValues.expectedClassId}
              render={({ ref, name, defaultValue, value, setValue }) => (
                <Autocomplete
                  ref={ref}
                  size="lg"
                  radius="sm"
                  name={name}
                  value={value}
                  variant="bordered"
                  label="Lớp học dự kiến"
                  labelPlacement="outside"
                  placeholder="Chọn lớp học"
                  isLoading={userLoading}
                  onChange={actions.instantChange}
                  onSelectionChange={setValue}
                  defaultSelectedKey={defaultValue}
                >
                  <AutocompleteItem key={1}></AutocompleteItem>
                </Autocomplete>
              )}
            />
          </div>
          <div className="space-x-4">
            <Button
              isLoading={loading}
              isDisabled={isError}
              type="submit"
              startContent={<Save size="20px" />}
              color="primary"
            >
              Lưu
            </Button>
            <Button type="reset" isDisabled={!isDirty} startContent={<RefreshCcw size="16px" />} variant="flat">
              Đặt lại
            </Button>
          </div>
        </Section>
      </Form>
    </>
  );
};

export default AdmissionForm;
