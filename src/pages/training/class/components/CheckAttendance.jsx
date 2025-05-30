import useClassData from "../hooks/useClassData";
import { Table, TableProvider } from "@/components/common";
import { ATTENDANCES } from "@/constants";
import { blurEmail, dayFormat, shiftFormat } from "@/utils";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Radio, RadioGroup } from "@heroui/radio";
import { addToast } from "@heroui/toast";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const AttendRow = ({ onInit, onChange }) => {
  useEffect(() => {
    onInit();
  }, []);

  return (
    <RadioGroup orientation="horizontal" defaultValue="yes" onChange={onChange}>
      {Object.keys(ATTENDANCES).map((a) => (
        <Radio key={a} value={a}>
          {ATTENDANCES[a]}
        </Radio>
      ))}
    </RadioGroup>
  );
};

const CheckAttendance = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { students, loading, schedules } = useClassData();
  const [attendances, setAttendances] = useState({});

  const selectedDate = searchParams.get("date");
  const changeAttendance = (id, value) => setAttendances((prev) => ({ ...prev, [id]: value }));

  const renderNote = (row) => {
    return (
      <Input
        variant="bordered"
        classNames={{ inputWrapper: "shadow-none" }}
        onBlur={(e) => {
          if (e.target.value) {
            changeAttendance(row.id, { ...attendances[row.id], note: e.target.value, isTouched: true });
          }
        }}
      />
    );
  };

  const handleSave = async () => {
    addToast({ color: "danger", title: "Lỗi!", description: "Tính năng chưa hỗ trợ" });
  };

  useEffect(() => {
    if (!selectedDate && schedules) {
      searchParams.set("date", schedules[0].date);
      setSearchParams(searchParams);
    }
  }, [schedules, selectedDate]);

  return (
    <div id="attendance">
      {schedules && (
        <Autocomplete
          label="Buổi học: "
          labelPlacement="outside-left"
          inputProps={{ classNames: { label: "text-base font-semibold", input: "min-w-60" } }}
          selectedKey={selectedDate}
          onSelectionChange={(newValue) => {
            searchParams.set("date", newValue);
            setSearchParams(searchParams);
          }}
          isClearable={false}
        >
          {schedules.map((schedule, index) => (
            <AutocompleteItem
              key={schedule.date}
              isDisabled={new Date(schedule.date) > new Date()}
              description={schedule.shift.name + " " + shiftFormat(schedule.shift)}
            >{`Buổi ${index + 1}: ${schedule.date} (${dayFormat(schedule.date)})`}</AutocompleteItem>
          ))}
        </Autocomplete>
      )}
      <TableProvider
        value={{
          columns: [
            { uid: "index", name: "STT", disableSort: true },
            {
              uid: "attend",
              name: "Điểm danh",
              disableSort: true,
              render: (row) => (
                <AttendRow
                  onInit={() => changeAttendance(row.id, { ...attendances[row.id], attend: "yes", isTouched: false })}
                  onChange={(e) =>
                    changeAttendance(row.id, { ...attendances[row.id], attend: e.target.value, isTouched: true })
                  }
                />
              ),
            },
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
      <Button className="mt-2" color="primary" startContent={<Save size="18px" />} onPress={handleSave}>
        Lưu lại
      </Button>
    </div>
  );
};

export default CheckAttendance;
