import { createCourse, updateCourse } from "@/apis";
import { CurrencyInput, Dot, Form, Section } from "@/components/common";
import { COURSE_LEVELS, COURSE_STATUSES } from "@/constants";
import { useForm, useNavigate } from "@/hooks";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, RefreshCcw, Save } from "lucide-react";
import { useState } from "react";

const CourseForm = ({ defaultValues = {}, editMode }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm({ numberFields });
  const { isError, isDirty, actions } = form;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    if (editMode) {
      const { id, ...removed } = defaultValues;
      const result = await updateCourse(id, { ...removed, ...data });
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        navigate("/admin/courses");
      } else {
        addToast({ color: "danger", title: "Lỗi khi sửa khóa học", description: result.message });
      }
      return;
    }

    const result = await createCourse(data);
    console.log(result);
    if (result.ok) {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      navigate("/admin/courses");
    } else {
      addToast({ color: "danger", title: "Lỗi khi tạo khóa học", description: result.message });
    }
    setLoading(false);
  };

  return (
    <Form form={form} onSubmit={handleSubmit} className="w-full space-y-4">
      <Section title="Thông tin khóa học" className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 pb-4">
          <Input
            autoFocus
            defaultValue={defaultValues.name}
            isRequired
            name="name"
            size="lg"
            variant="bordered"
            label="Tên khóa học"
            radius="sm"
            labelPlacement="outside"
            placeholder="Nhập tên khóa học"
          />
          <Input
            isRequired
            defaultValue={defaultValues.numberOfStudents}
            name="numberOfStudents"
            size="lg"
            variant="bordered"
            label="Số lượng học viên"
            type="number"
            radius="sm"
            labelPlacement="outside"
            placeholder="Nhập số học viên"
          />
          <Input
            isRequired
            defaultValue={defaultValues.numberOfLessons}
            name="numberOfLessons"
            size="lg"
            variant="bordered"
            label="Số buổi học"
            type="number"
            radius="sm"
            labelPlacement="outside"
            placeholder="Nhập số buổi học"
          />
          <CurrencyInput
            defaultValue={defaultValues.tuitionFee}
            isRequired
            name="tuitionFee"
            size="lg"
            variant="bordered"
            label="Học phí"
            radius="sm"
            labelPlacement="outside"
            placeholder="Nhập học phí"
          />
          <Input
            defaultValue={defaultValues.description}
            name="description"
            size="lg"
            variant="bordered"
            label="Mô tả"
            radius="sm"
            labelPlacement="outside"
            placeholder="Nhập mô tả ngắn"
          />
          <Select
            name="level"
            onChange={actions.instantChange}
            defaultSelectedKeys={defaultValues.level ? new Set([defaultValues.level.toString()]) : new Set([])}
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
          <Select
            name="status"
            isRequired
            onChange={actions.instantChange}
            defaultSelectedKeys={defaultValues.status ? new Set([defaultValues.status]) : new Set([COURSE_STATUSES[0]])}
            size="lg"
            variant="bordered"
            label="Trạng thái"
            radius="sm"
            labelPlacement="outside"
            placeholder="Đang mở, Tạm đóng..."
          >
            {COURSE_STATUSES.map((status) => (
              <SelectItem key={status}>{status}</SelectItem>
            ))}
          </Select>
        </div>
      </Section>
      <div className="space-x-4">
        <Button
          isLoading={loading}
          isDisabled={isError}
          type="submit"
          startContent={editMode ? <Save size="20px" /> : <Plus size="20px" />}
          className="shadow-xl"
          color="primary"
        >
          {editMode ? "Lưu thay đổi" : "Thêm khóa học"}
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

export default CourseForm;
