import { ModuleLayout } from "@/layouts";
import { timetableBreadcrumbItems } from "../constants";
import { Autocomplete, AutocompleteItem, AutocompleteSection } from "@heroui/autocomplete";
import { LoadMoreButton } from "@/components/common";
import { useServerList } from "@/hooks";
import { classApi, userApi } from "@/apis";
import { Avatar } from "@heroui/avatar";
import { TimeTable } from "@/components";
import { format } from "date-fns";
import { DATE_FORMAT, EMPLOYEE_STATUS } from "@/constants";
import { useState } from "react";

const TimeTablePage = () => {
  const [selectedUser, setSelectedUser] = useState("2");
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
        <Autocomplete
          size="lg"
          variant="bordered"
          label="Lớp học"
          radius="sm"
          labelPlacement="outside"
          placeholder="Chọn lớp học"
          items={classList.list}
          selectedKey={selectedClass}
          isVirtualized
          maxListboxHeight={265}
          itemHeight={40}
          listboxProps={{
            bottomContent: classList.hasMore && <LoadMoreButton onLoadMore={classList.onLoadMore} />,
          }}
          isLoading={classList.isLoading}
          onInputChange={classList.onQueryChange}
          onSelectionChange={setSelectedClass}
        >
          {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
        </Autocomplete>
        <Autocomplete
          size="lg"
          variant="bordered"
          label="Người dùng"
          radius="sm"
          labelPlacement="outside"
          placeholder="Nhập tên, email, số điện thoại..."
          isVirtualized
          maxListboxHeight={265}
          itemHeight={50}
          selectedKey={selectedUser}
          listboxProps={{
            bottomContent: studentList.hasMore && <LoadMoreButton onLoadMore={studentList.onLoadMore} />,
          }}
          isLoading={studentList.isLoading || teacherList.isLoading}
          onInputChange={studentList.onQueryChange}
          onSelectionChange={setSelectedUser}
        >
          {teacherList.list.length > 0 && (
            <AutocompleteSection title="Giáo viên">
              {teacherList.list.map((item) => (
                <AutocompleteItem
                  key={item.id}
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
            </AutocompleteSection>
          )}
          {studentList.list.length > 0 && (
            <AutocompleteSection title="Học viên">
              {studentList.list.map((item) => (
                <AutocompleteItem
                  key={item.id}
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
            </AutocompleteSection>
          )}
        </Autocomplete>
      </div>
      <div className="px-2 sm:px-10 mt-4 overflow-y-auto pt-2 pb-6">
        <TimeTable
          teacherId={Number(selectedTeacher)}
          studentId={Number(selectedStudent)}
          classId={Number(selectedClass)}
        />
      </div>
    </ModuleLayout>
  );
};

export default TimeTablePage;
