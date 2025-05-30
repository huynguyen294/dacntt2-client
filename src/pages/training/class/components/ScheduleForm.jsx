import useClassData from "../hooks/useClassData";
import { DATE_FORMAT } from "@/constants";
import { scheduleApi, userApi } from "@/apis";
import { useMetadata, useServerList } from "@/hooks";
import { shiftFormat } from "@/utils";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Avatar } from "@heroui/avatar";
import { DatePicker } from "@heroui/date-picker";
import { Textarea } from "@heroui/input";
import { parseDate } from "@internationalized/date";
import { format } from "date-fns";
import { Controller, Form, useForm } from "react-simple-formkit";
import { Checkbox } from "@heroui/checkbox";
import { addToast } from "@heroui/toast";
import { useQueryClient } from "@tanstack/react-query";

const ScheduleForm = ({ defaultValues = {}, onClose }) => {
  const form = useForm({ numberFields });
  const queryClient = useQueryClient();
  const { loading, shifts } = useMetadata();
  const { fullSchedules, data, classId } = useClassData();
  const teacherList = useServerList("users", userApi.get, { filters: { role: ["teacher"] } });

  const handleSubmit = async (data) => {
    const found = fullSchedules.find((s) => s.date === data.date);

    if (!found) {
      const result = await scheduleApi.create({ ...data, classId });
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: ["classes", classId, "schedules"] });
        onClose();
      } else {
        addToast({ color: "danger", title: "Lỗi!", description: result.message });
      }
      return;
    }

    addToast({ color: "danger", title: "Lỗi!", description: "Tính năng chưa hỗ trợ" });
    return;
  };

  return (
    <Form form={form} onSubmit={handleSubmit} id="schedule-form" className="flex flex-col gap-4">
      <DatePicker
        isRequired
        name="date"
        label="Ngày học"
        labelPlacement="outside"
        variant="bordered"
        size="lg"
        defaultValue={defaultValues.date && parseDate(format(defaultValues.date, DATE_FORMAT))}
        aria-labelledby="date-picker"
        isDateUnavailable={(date) =>
          Boolean(
            fullSchedules.find(
              (s) => s.date === date.toString() && s.date !== defaultValues.date && !s.isAbsented && !s.isDeleted
            )
          )
        }
        minValue={parseDate(format(data.item.openingDay, DATE_FORMAT))}
        maxValue={parseDate(format(data.item.closingDay, DATE_FORMAT))}
      />
      <Controller
        name="shiftId"
        defaultValue={defaultValues.shiftId || data.item.shiftId}
        render={({ ref, value, setValue, name, defaultValue }) => (
          <Autocomplete
            ref={ref}
            selectedKey={value && value.toString()}
            onSelectionChange={setValue}
            name={name}
            isLoading={loading}
            size="lg"
            variant="bordered"
            label="Ca học"
            radius="sm"
            labelPlacement="outside"
            placeholder="Chọn ca học"
            defaultSelectedKey={defaultValue && defaultValue.toString()}
            items={shifts || []}
          >
            {(s) => <AutocompleteItem key={s.id.toString()}>{`${s.name} ${shiftFormat(s)}`}</AutocompleteItem>}
          </Autocomplete>
        )}
      />
      <Controller
        name="teacherId"
        defaultValue={defaultValues.teacherId || data.item.teacherId}
        render={({ ref, name, value, setValue, defaultValue }) => (
          <Autocomplete
            size="lg"
            ref={ref}
            name={name}
            variant="bordered"
            label="Giáo viên"
            radius="sm"
            labelPlacement="outside"
            placeholder="Tìm theo tên, email, số điện thoại..."
            isVirtualized
            isLoading={teacherList.isLoading}
            selectedKey={value && value.toString()}
            defaultSelectedKey={defaultValue && defaultValue.toString()}
            onSelectionChange={setValue}
            maxListboxHeight={265}
            itemHeight={50}
            listboxProps={{
              bottomContent: teacherList.hasMore && <LoadMoreButton onLoadMore={teacherList.onLoadMore} />,
            }}
            onInputChange={teacherList.onQueryChange}
          >
            {teacherList.list.map((item) => (
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
      <Textarea defaultValue={defaultValues.note} name="note" label="Ghi chú" variant="bordered" />
      <Controller
        name="isAbsented"
        defaultValue={defaultValues.isAbsented}
        render={({ ref, name, defaultValue, value, setValue }) => (
          <Checkbox
            ref={ref}
            name={name}
            defaultSelected={defaultValue}
            value={value}
            onChange={(e) => setValue(e.target.checked)}
          >
            Báo vắng
          </Checkbox>
        )}
      />
    </Form>
  );
};

const numberFields = ["shiftId", "teacherId"];

export default ScheduleForm;
