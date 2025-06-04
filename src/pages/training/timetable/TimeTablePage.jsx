import { ModuleLayout } from "@/layouts";
import { timetableBreadcrumbItems } from "../constants";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Loader, LoadMoreButton } from "@/components/common";
import { useMetadata, useServerList } from "@/hooks";
import { classApi, scheduleApi, userApi } from "@/apis";
import { Avatar } from "@heroui/avatar";
import { TimeTable } from "@/components";
import { format } from "date-fns";
import { DATE_FORMAT, EMPLOYEE_STATUS } from "@/constants";

const TimeTablePage = () => {
  const metadata = useMetadata();
  const studentList = useServerList("users", userApi.get, { filters: { role: "student" } });
  const teacherList = useServerList("users", userApi.get, {
    filters: { role: "teacher", status: EMPLOYEE_STATUS.active },
    otherParams: ["role=teacher"],
  });
  const classList = useServerList("classes", classApi.get, {
    filters: {
      openingDay: { lte: format(new Date(), DATE_FORMAT) },
      closingDay: { gte: format(new Date(), DATE_FORMAT) },
    },
    paging: false,
  });
  const scheduleList = useServerList("class-schedules", classList.ready && scheduleApi.get, {
    filters: { classId: classList.list.map((c) => c.id) },
    otherParams: ["refs=true"],
    paging: false,
  });

  const ready = classList.ready && scheduleList.ready && teacherList.ready && Boolean(metadata.shifts);
  const isLoading = classList.isLoading && scheduleList.isLoading && teacherList.isLoading && metadata.loading;

  return (
    <ModuleLayout breadcrumbItems={timetableBreadcrumbItems}>
      <Loader isLoading={isLoading} />
      {ready && (
        <>
          <div className="px-2 sm:px-10 grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
            <Autocomplete
              size="lg"
              variant="bordered"
              label="Lớp học"
              radius="sm"
              labelPlacement="outside"
              placeholder="Chọn lớp học"
              items={classList.list}
              isVirtualized
              maxListboxHeight={265}
              itemHeight={40}
              listboxProps={{
                bottomContent: classList.hasMore && <LoadMoreButton onLoadMore={classList.onLoadMore} />,
              }}
              isLoading={classList.isLoading}
              onInputChange={classList.onQueryChange}
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
              items={teacherList.list}
              isVirtualized
              maxListboxHeight={265}
              itemHeight={50}
              listboxProps={{
                bottomContent: teacherList.hasMore && <LoadMoreButton onLoadMore={teacherList.onLoadMore} />,
              }}
              isLoading={teacherList.isLoading}
              onInputChange={teacherList.onQueryChange}
            >
              {(item) => (
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
              )}
            </Autocomplete>
          </div>
          <div className="px-2 sm:px-10 mt-4">
            <TimeTable />
          </div>
        </>
      )}
    </ModuleLayout>
  );
};

export default TimeTablePage;
