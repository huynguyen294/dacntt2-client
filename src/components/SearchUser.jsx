/* eslint-disable no-unused-vars */
import { userApi } from "@/apis";
import { useServerList } from "@/hooks";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Search } from "lucide-react";
import { Loader, LoadMoreButton } from "./common";

const SearchUser = ({ onChange = (key) => {}, role = ["student"] }) => {
  const userList = useServerList("users", userApi.get, { filters: { role } });

  return (
    <div className="pb-4 sm:pb-10">
      <Input
        onChange={(e) => userList.onQueryChange(e.target.value)}
        startContent={<Search size="14px" />}
        placeholder="Nhập tên, email..."
      />
      <Loader variant="progress" isLoading={userList.isLoading} />
      <div className="h-[60dvh]  overflow-y-auto">
        <Listbox
          variant="flat"
          aria-label="Actions"
          onAction={onChange}
          emptyContent="Không có dữ liệu"
          bottomContent={userList.hasMore && <LoadMoreButton size="md" onLoadMore={userList.onLoadMore} />}
        >
          {userList.list.map((row) => (
            <ListboxItem
              className="!text-base"
              startContent={
                <div>
                  <Avatar size="lg" src={row.imageUrl} />
                </div>
              }
              endContent={
                <Button size="sm" className="h-8" color="primary" onPress={() => onChange(row.id)}>
                  Đăng ký
                </Button>
              }
              description={row.email}
              key={row.id.toString()}
            >
              {row.name}
            </ListboxItem>
          ))}
        </Listbox>
      </div>
    </div>
  );
};

export default SearchUser;
