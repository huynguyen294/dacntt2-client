import useClassData from "../hooks/useClassData";
import { DropDown, Table, TableProvider } from "@/components/common";
import { Button } from "@heroui/button";
import { Edit, ListChecks, MegaphoneOff, Plus, Trash2 } from "lucide-react";
import { useParams } from "react-router";
import { dayFormat, shiftFormat } from "@/utils";

const ClassSchedule = () => {
  const { id } = useParams();

  // const user = useAppStore('user')
  const { loading, schedules } = useClassData(id);

  const renderActions = (row) => {
    return (
      <DropDown
        menuItems={[
          { key: "absented", label: "Báo vắng", startContent: <MegaphoneOff size="18px" className="w-4" /> },
          { key: "attendance", label: "Điểm danh", startContent: <ListChecks size="18px" className="w-4" /> },
          { key: "edit", label: "Chỉnh sửa", startContent: <Edit size="18px" className="w-4" /> },
          { key: "delete", label: "Xóa", startContent: <Trash2 size="18px" className="w-4" />, color: "danger" },
        ]}
      />
    );
  };

  const renderTime = (row) => {
    const day = dayFormat(row.date);
    const shift = row.shift.name + " " + shiftFormat(row.shift);
    return (
      <div className="my-2">
        <p className="font-semibold">
          {row.date} ({day})
        </p>
        <p className="font-semibold text-foreground-500">{shift}</p>
      </div>
    );
  };

  const renderTeacher = (row) => {
    return (
      <div>
        <p className="font-semibold">{row?.teacher?.name}</p>
        <p className="text-foreground-500">({row?.teacher?.email})</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Button variant="shadow" radius="full" color="primary" startContent={<Plus />}>
        Học bù
      </Button>
      {schedules && (
        <TableProvider
          value={{
            columns: [
              { uid: "index", name: "STT", disableSort: true },
              { uid: "time", name: "Thời gian", disableSort: true, render: renderTime },
              { uid: "teacher", name: "Giáo viên", disableSort: true, render: renderTeacher },
              { uid: "actions", name: "Thao tác", disableSort: true, render: renderActions },
            ],
          }}
        >
          <Table
            rows={schedules}
            isHeaderSticky={false}
            classNames={{ wrapper: "shadow-none p-0 rounded-none" }}
            selectionMode="none"
            isLoading={loading}
          />
        </TableProvider>
      )}
    </div>
  );
};

export default ClassSchedule;
