import useClassData from "../hooks/useClassData";
import { Table, TableProvider } from "@/components/common";
import { blurEmail, dayFormat, shiftFormat } from "@/utils";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Radio, RadioGroup } from "@heroui/radio";
import { Save } from "lucide-react";

const CheckAttendance = () => {
  const { students, loading, schedules } = useClassData();

  const renderAttend = (row) => {
    return (
      <RadioGroup orientation="horizontal" defaultValue="yes">
        <Radio value="yes">Có</Radio>
        <Radio value="no">Không</Radio>
        <Radio value="late">Trễ</Radio>
      </RadioGroup>
    );
  };

  const renderNote = (row) => {
    return <Input variant="bordered" classNames={{ inputWrapper: "shadow-none" }} />;
  };

  return (
    <div id="attendance">
      <Autocomplete
        label="Buổi học: "
        labelPlacement="outside-left"
        inputProps={{ classNames: { label: "text-base font-semibold" } }}
        defaultSelectedKey={schedules[0]?.date}
      >
        {schedules.map((schedule, index) => (
          <AutocompleteItem
            key={schedule.date}
            description={schedule.shift.name + " " + shiftFormat(schedule.shift)}
          >{`Buổi ${index + 1}: ${schedule.date} (${dayFormat(schedule.date)})`}</AutocompleteItem>
        ))}
      </Autocomplete>
      <TableProvider
        value={{
          columns: [
            { uid: "index", name: "STT", disableSort: true },
            { uid: "attend", name: "Điểm danh", disableSort: true, render: renderAttend },
            { uid: "name", name: "Tên", disableSort: true },
            { uid: "email", name: "Email", disableSort: true, render: (row) => blurEmail(row.email) },
            { uid: "absents", name: "Số buổi nghỉ", disableSort: true, render: () => 0 },
            { uid: "late", name: "Số buổi trễ", disableSort: true, render: () => 0 },
            { uid: "note", name: "Nhận xét", disableSort: true, render: renderNote },
          ],
        }}
      >
        <Table
          rows={students}
          isHeaderSticky={false}
          classNames={{ wrapper: "shadow-none p-2 mt-2 border-2" }}
          selectionMode="none"
          isLoading={loading}
        />
      </TableProvider>
      <Button className="mt-2" color="primary" startContent={<Save size="18px" />}>
        Lưu lại
      </Button>
    </div>
  );
};

export default CheckAttendance;
