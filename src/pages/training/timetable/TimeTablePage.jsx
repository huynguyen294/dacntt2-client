import { ModuleLayout } from "@/layouts";
import { timetableBreadcrumbItems } from "../constants";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { LoadMoreButton } from "@/components/common";
import { useServerList } from "@/hooks";
import { classApi, userApi } from "@/apis";
import { Avatar } from "@heroui/avatar";
import { TimeTable } from "@/components";

const TimeTablePage = () => {
  const userList = useServerList("users", userApi.get, { filters: { role: ["student", "teacher"] } });
  const classList = useServerList("classes", classApi.get);

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
          items={userList.list}
          isVirtualized
          maxListboxHeight={265}
          itemHeight={50}
          listboxProps={{
            bottomContent: userList.hasMore && <LoadMoreButton onLoadMore={userList.onLoadMore} />,
          }}
          isLoading={userList.isLoading}
          onInputChange={userList.onQueryChange}
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
    </ModuleLayout>
  );
};

export default TimeTablePage;
