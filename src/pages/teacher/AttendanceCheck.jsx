import CheckAttendance from "../training/class/components/CheckAttendance";
import { EmptyMessage } from "@/components";
import { ModuleLayout } from "@/layouts";
import { useParams } from "react-router";
import { classApi } from "@/apis";
import { ORDER_BY_NAME } from "@/constants";
import { useNavigate, useServerList } from "@/hooks";
import { Select, SelectItem } from "@heroui/select";

const AttendanceCheck = () => {
  const navigate = useNavigate();
  const { classId } = useParams();

  const classList = useServerList("classes", classApi.get, { order: ORDER_BY_NAME, paging: false });

  const customControls = (
    <Select
      size="lg"
      variant="bordered"
      label="Lớp học"
      radius="sm"
      labelPlacement="outside"
      placeholder="Tìm theo tên lớp học"
      isVirtualized
      maxListboxHeight={265}
      itemHeight={40}
      items={classList.list}
      isLoading={classList.isLoading}
      listboxProps={classList.listboxProps}
      selectedKeys={classId !== "undefined" && new Set([classId])}
      className="w-full sm:w-[300px]"
      onSelectionChange={(keys) => {
        const classId = [...keys][0];
        navigate(`/attendance-check/${classId}`);
      }}
    >
      {(item) => <SelectItem key={item.id?.toString()}>{item.name}</SelectItem>}
    </Select>
  );

  return (
    <ModuleLayout breadcrumbItems={[{ label: "Điểm danh" }]}>
      <div className="px-2 sm:px-10 overflow-y-auto pb-10">
        {classId === "undefined" ? (
          <>
            {customControls}
            <EmptyMessage message="Vui lòng chọn lớp học" />
          </>
        ) : (
          <CheckAttendance
            customControls={customControls}
            scheduleSelectorProps={{
              labelPlacement: "outside",
              radius: "sm",
              className: "w-full sm:w-[300px]",
              inputProps: { classNames: { input: "min-w-60" } },
              size: "lg",
              variant: "bordered",
            }}
          />
        )}
      </div>
    </ModuleLayout>
  );
};

export default AttendanceCheck;
