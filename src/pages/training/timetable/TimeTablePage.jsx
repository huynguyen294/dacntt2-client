import { ModuleLayout } from "@/layouts";
import { timetableBreadcrumbItems } from "../constants";
import { LoadMoreButton } from "@/components/common";
import { useServerList } from "@/hooks";
import { classApi, userApi } from "@/apis";
import { Avatar } from "@heroui/avatar";
import { TimeTable } from "@/components";
import { format } from "date-fns";
import { DATE_FORMAT, EMPLOYEE_STATUS } from "@/constants";
import { useState } from "react";
import { Input } from "@heroui/input";
import { Select, SelectItem, SelectSection } from "@heroui/select";

const TimeTablePage = () => {
  const [selectedUser, setSelectedUser] = useState();
  const [selectedClass, setSelectedClass] = useState();

  const studentList = useServerList("users", userApi.get, { filters: { role: "student" } });
  const teacherList = useServerList("users", userApi.get, {
    filters: { role: "teacher", status: EMPLOYEE_STATUS.active },
    otherParams: ["role=teacher"],
    searchQuery: studentList.query,
    paging: false,
  });
  const classList = useServerList("classes", classApi.get, {
    filters: {
      openingDay: { lte: format(new Date(), DATE_FORMAT) },
      closingDay: { gte: format(new Date(), DATE_FORMAT) },
    },
    paging: false,
  });

  const selectedTeacher = teacherList.list.find((t) => t.id == selectedUser) ? selectedUser : null;
  const selectedStudent = !selectedTeacher ? selectedUser : null;

  return (
    <ModuleLayout breadcrumbItems={timetableBreadcrumbItems}>
      <div className="px-2 sm:px-10 grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
        <Select
          size="lg"
          variant="bordered"
          label="Lớp học"
          radius="sm"
          labelPlacement="outside"
          placeholder="Tìm theo tên lớp học"
          items={classList.list}
          isVirtualized
          maxListboxHeight={265}
          itemHeight={40}
          isLoading={classList.isLoading}
          onInputChange={classList.onQueryChange}
          inputValue={classList.query}
          listboxProps={{
            topContent: (
              <Input
                placeholder="Tìm theo tên, email, số điện thoại"
                variant="bordered"
                classNames={{ inputWrapper: "border-1 shadow-none" }}
                onValueChange={classList.onQueryChange}
              />
            ),
            bottomContent: classList.hasMore && <LoadMoreButton onLoadMore={classList.onLoadMore} />,
          }}
          onSelectionChange={(keys) => setSelectedClass([...keys][0])}
        >
          {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
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
          listboxProps={{
            topContent: (
              <Input
                placeholder="Tìm theo tên, email, số điện thoại"
                variant="bordered"
                classNames={{ inputWrapper: "border-1 shadow-none" }}
                onValueChange={studentList.onQueryChange}
              />
            ),
            bottomContent: studentList.hasMore && <LoadMoreButton onLoadMore={studentList.onLoadMore} />,
          }}
          isLoading={studentList.isLoading || teacherList.isLoading}
          onSelectionChange={(keys) => setSelectedUser([...keys][0])}
        >
          {teacherList.list.length > 0 && (
            <SelectSection title="Giáo viên">
              {teacherList.list.map((item) => (
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
      <div className="px-2 sm:px-10 mt-4 overflow-y-auto pt-2 pb-6">
        <TimeTable
          teacherId={selectedTeacher && Number(selectedTeacher)}
          studentId={selectedStudent && Number(selectedStudent)}
          classId={selectedClass && Number(selectedClass)}
        />
      </div>
    </ModuleLayout>
  );
};

export default TimeTablePage;
