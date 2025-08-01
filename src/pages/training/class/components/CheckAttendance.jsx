import useClassData from "../hooks/useClassData";
import { attendanceApi } from "@/apis";
import { Loader, Table, TableProvider } from "@/components/common";
import { ATTENDANCES } from "@/constants";
import { blurEmail, dayFormat, shiftFormat } from "@/utils";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Radio, RadioGroup } from "@heroui/radio";
import { addToast } from "@heroui/toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCcw, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

const CheckAttendance = ({ scheduleSelectorProps = {}, customControls }) => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { students, loading, schedules, classId, ready } = useClassData();
  const [attendances, setAttendances] = useState(null);

  const lessonId = searchParams.get("lessonId");
  const changeAttendance = (id, value) => setAttendances((prev) => ({ ...prev, [id]: value }));

  const attendResult = useQuery({
    queryKey: ["classes", classId, "attendances", lessonId, "refs=true"],
    queryFn: () => attendanceApi.get(null, null, null, { classId, lessonId }, ["refs=true"]),
  });

  const editMode = attendResult.data?.rows?.length > 0;
  const isDirty = attendances && Boolean(Object.values(attendances).find((a) => a.isTouched));
  const [saving, setSaving] = useState(false);

  const defaultValues = useMemo(() => {
    if (!attendResult.data || !ready) return null;

    let result = students.reduce((acc, s) => {
      return {
        ...acc,
        [s.id]: {
          attend: "yes",
          note: "",
          isTouched: false,
          classId: +classId,
          lessonId: +lessonId,
          studentId: s.id,
        },
      };
    }, {});

    if (attendResult.data.rows.length > 0) {
      result = {
        ...result,
        ...attendResult.data.rows.reduce((acc, row) => ({ ...acc, [row.studentId]: { ...row, isTouched: false } }), {}),
      };
    }

    return result;
  }, [attendResult.data, ready]);

  const renderNote = (row) => {
    return (
      <Input
        variant="bordered"
        classNames={{ inputWrapper: "shadow-none" }}
        onBlur={(e) => {
          changeAttendance(row.id, { ...attendances[row.id], note: e.target.value, isTouched: true });
        }}
      />
    );
  };

  const handleSave = async () => {
    setSaving(true);

    const toBeCreateList = Object.values(attendances).reduce((acc, a) => {
      const { isTouched, ...removed } = a;
      if (!removed.id) acc.push(removed);
      return acc;
    }, []);

    if (editMode) {
      const toBeUpdatedList = Object.values(attendances).reduce((acc, a) => {
        const { isTouched, ...removed } = a;
        if (isTouched && removed.id) acc.push(removed);
        return acc;
      }, []);

      const result = await attendanceApi.update(toBeUpdatedList);
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: ["classes", classId, "attendances", lessonId] });
      } else {
        addToast({ color: "danger", title: "Lỗi!", description: result.message });
      }

      if (!toBeCreateList.length) {
        setSaving(false);
        return;
      }
    }

    const result = await attendanceApi.create(toBeCreateList);
    if (result.ok) {
      queryClient.invalidateQueries({ queryKey: ["classes", classId, "attendances", lessonId] });
    } else {
      addToast({ color: "danger", title: "Lỗi!", description: result.message });
    }
    setSaving(false);
  };

  useEffect(() => {
    setAttendances(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    if (!lessonId && schedules.length > 0) {
      let date = schedules[0].id;
      schedules.forEach((s) => {
        if (new Date(s.date) < new Date()) date = s.id;
      });

      searchParams.set("lessonId", date);
      setSearchParams(searchParams, { replace: true });
    }
  }, [schedules, lessonId, ready]);

  return (
    <div id="attendance">
      <div className="flex flex-wrap gap-2">
        {customControls}
        {attendances && (
          <Autocomplete
            label="Buổi học"
            labelPlacement="outside-left"
            inputProps={{ classNames: { label: "text-base font-semibold", input: "min-w-60" } }}
            selectedKey={lessonId}
            onSelectionChange={(newValue) => {
              searchParams.set("lessonId", newValue);
              setSearchParams(searchParams, { replace: true });
            }}
            isClearable={false}
            {...scheduleSelectorProps}
          >
            {schedules.map((schedule, index) => (
              <AutocompleteItem
                key={schedule.id.toString()}
                isDisabled={new Date(schedule.date) > new Date()}
                description={schedule.shift.name + " " + shiftFormat(schedule.shift)}
              >{`Buổi ${index + 1}: ${schedule.date} (${dayFormat(schedule.date)})`}</AutocompleteItem>
            ))}
          </Autocomplete>
        )}
      </div>
      <Loader isLoading={attendResult.isLoading || loading} />
      {attendances && (
        <TableProvider
          value={{
            columns: [
              { uid: "index", name: "STT", disableSort: true },
              {
                uid: "attend",
                name: "Điểm danh",
                disableSort: true,
                render: (row) => {
                  const attendance = attendances[row.id];
                  return (
                    <RadioGroup
                      orientation="horizontal"
                      defaultValue={attendance?.attend}
                      value={attendance?.attend}
                      onValueChange={(attend) => changeAttendance(row.id, { ...attendance, attend, isTouched: true })}
                    >
                      {Object.keys(ATTENDANCES).map((a) => (
                        <Radio key={a} value={a}>
                          {ATTENDANCES[a]}
                        </Radio>
                      ))}
                    </RadioGroup>
                  );
                },
              },
              { uid: "name", name: "Tên", disableSort: true },
              { uid: "email", name: "Email", disableSort: true, render: (row) => blurEmail(row.email) },
              {
                uid: "absents",
                name: "Số buổi nghỉ",
                disableSort: true,
                render: (row) => {
                  const attends = attendResult.data?.refs?.studentAttends?.[row.id] || [];
                  const found = attends.find((a) => a.attend === "no");
                  return found?.total || 0;
                },
              },
              {
                uid: "late",
                name: "Số buổi trễ",
                disableSort: true,
                render: (row) => {
                  const attends = attendResult.data?.refs?.studentAttends?.[row.id] || [];
                  const found = attends.find((a) => a.attend === "late");
                  return found?.total || 0;
                },
              },
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
          <div className="flex items-center mt-2 gap-2">
            <Button
              isDisabled={!ready}
              isLoading={saving}
              color="primary"
              startContent={<Save size="18px" />}
              onPress={handleSave}
            >
              Lưu lại
            </Button>
            <Button
              startContent={<RefreshCcw size="18px" />}
              variant="flat"
              onPress={() => setAttendances(defaultValues)}
              isDisabled={!isDirty}
            >
              Đặt lại
            </Button>
          </div>
        </TableProvider>
      )}
    </div>
  );
};

export default CheckAttendance;
