import { examApi } from "@/apis";
import { Form, Section } from "@/components/common";
import { useForm, useNavigate } from "@/hooks";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, RefreshCcw, Save } from "lucide-react";
import { useState } from "react";
import { parseDate, Time } from "@internationalized/date";
import { format } from "date-fns";
import { DATE_FORMAT } from "@/constants";
import { DatePicker } from "@heroui/date-picker";
import { TimeInput } from "@heroui/date-input";

const ExamForm = ({ defaultValues = {}, editMode }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm();
  const { isError, isDirty, actions } = form;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    if (editMode) {
      const { id, ...removed } = defaultValues;
      const result = await examApi.update(id, { ...removed, ...data });
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: ["exams"] });
        navigate("/exams");
      } else {
        addToast({ color: "danger", title: "Lỗi khi sửa kỳ thi", description: result.message });
      }
      return;
    }

    const result = await examApi.create(data);
    if (result.ok) {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      navigate("/exams");
    } else {
      addToast({ color: "danger", title: "Lỗi khi tạo kỳ thi", description: result.message });
    }
    setLoading(false);
  };

  return (
    <Form form={form} onSubmit={handleSubmit} className="w-full space-y-4">
      <Section title="Thông tin kỳ thi" className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 pb-4">
          <Input
            defaultValue={defaultValues.name}
            isRequired
            name="name"
            size="lg"
            variant="bordered"
            label="Tên kỳ thi"
            radius="sm"
            labelPlacement="outside"
            placeholder="Nhập tên kỳ thi"
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
            label="Ngày thi"
            radius="sm"
            labelPlacement="outside"
            classNames={{ label: "-mt-1" }}
          />
          <TimeInput
            hourCycle={12}
            isRequired
            onChange={actions.instantChange}
            defaultValue={defaultValues.time && new Time(...defaultValues.time.split(":"))}
            name="time"
            size="lg"
            variant="bordered"
            label="Giờ thi"
            radius="sm"
            labelPlacement="outside"
            classNames={{ label: "-mt-1" }}
          />
          <Input
            defaultValue={defaultValues.location}
            isRequired
            name="location"
            size="lg"
            variant="bordered"
            label="Điểm thi"
            radius="sm"
            labelPlacement="outside"
            placeholder="Nhập địa điểm"
          />
        </div>
      </Section>
      {/* <Section title="Học sinh dự thi" className="w-full"></Section> */}
      <div className="space-x-4">
        <Button
          isLoading={loading}
          isDisabled={!isDirty || isError}
          type="submit"
          startContent={editMode ? <Save size="20px" /> : <Plus size="20px" />}
          className="shadow-xl"
          color="primary"
        >
          {editMode ? "Lưu thay đổi" : "Thêm kỳ thi"}
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

const numberFields = [];

export default ExamForm;
