import { useServerList } from "@/hooks";
import { classApi, userApi } from "@/apis";
import { Avatar } from "@heroui/avatar";
import { EMPLOYEE_STATUS, ORDER_BY_NAME } from "@/constants";
import { Select, SelectItem, SelectSection } from "@heroui/select";

const TimetableFilter = ({ value, onChange }) => {
  const studentList = useServerList("users", userApi.get, { filters: { role: "student" } });
  const teacherList = useServerList("users", userApi.get, {
    filters: { role: "teacher", status: EMPLOYEE_STATUS.active },
    otherParams: ["role=teacher"],
    searchQuery: studentList.query,
    searchPlaceholder: "Tìm theo mã, tên, email...",
    paging: false,
  });
  const classList = useServerList("classes", classApi.get, {
    order: ORDER_BY_NAME,
    paging: false,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
      <Select
        size="lg"
        variant="bordered"
        label="Chế độ xem"
        radius="sm"
        labelPlacement="outside"
        defaultSelectedKeys={new Set(["week"])}
        onSelectionChange={(keys) => {
          if (keys.size === 0) return;
          const generalMode = [...keys][0];
          if (generalMode === "week") {
            onChange({ ...value, generalMode: false });
          } else {
            onChange({ ...value, generalMode: true });
          }
        }}
      >
        <SelectItem key="week">Xem theo tuần</SelectItem>
        <SelectItem key="general">Xem tổng quát</SelectItem>
      </Select>
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
        onSelectionChange={(keys) => {
          const classId = [...keys][0] && Number([...keys][0]);
          onChange({ ...value, classId });
        }}
      >
        {(item) => <SelectItem key={item.id?.toString()}>{item.name}</SelectItem>}
      </Select>
      <Select
        size="lg"
        variant="bordered"
        label="Giáo viên/ Học viên"
        placeholder="Chọn giáo viên/ học viên"
        radius="sm"
        labelPlacement="outside"
        isVirtualized
        maxListboxHeight={265}
        itemHeight={50}
        listboxProps={studentList.listboxProps}
        isLoading={studentList.isLoading || teacherList.isLoading}
        onSelectionChange={(keys) => {
          const userId = [...keys][0] && Number([...keys][0]);
          const foundTeacher = teacherList.list.find((t) => t.id == userId);
          const newValue = { ...value };

          if (foundTeacher) {
            newValue.teacherId = userId;
            newValue.studentId = null;
          } else {
            newValue.teacherId = null;
            newValue.studentId = userId;
          }

          onChange(newValue);
        }}
      >
        {teacherList.list.length > 0 && (
          <SelectSection title="Giáo viên">
            {teacherList.list.map((item) => (
              <SelectItem
                key={item.id.toString()}
                startContent={
                  <div>
                    <Avatar src={item.imageUrl} />
                  </div>
                }
                description={item.email}
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectSection>
        )}
        {studentList.list.length > 0 && (
          <SelectSection title="Học viên">
            {studentList.list.map((item) => (
              <SelectItem
                key={item.id}
                startContent={
                  <div>
                    <Avatar src={item.imageUrl} />
                  </div>
                }
                description={item.email}
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectSection>
        )}
      </Select>
    </div>
  );
};

export default TimetableFilter;
