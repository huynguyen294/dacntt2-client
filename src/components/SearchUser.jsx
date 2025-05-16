/* eslint-disable no-unused-vars */
import { userApi } from "@/apis";
import { useDebounce } from "@/hooks";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Spinner } from "@heroui/spinner";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";

const SearchUser = ({ onChange = (key) => {} }) => {
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query);

  const { isLoading, data } = useQuery({
    queryKey: ["users", "search", "student", debounceQuery],
    queryFn: () =>
      userApi.get({}, {}, debounceQuery, { roles: ["student"] }, { otherParams: ["fields=id,name,email,imageUrl"] }),
  });

  return (
    <div className="pb-4 sm:pb-10">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        startContent={<Search size="14px" />}
        placeholder="Nhập tên hoặc email"
      />
      <div className="h-[60dvh]  overflow-y-auto mt-2">
        <Listbox variant="flat" aria-label="Actions" onAction={onChange} emptyContent="Không có dữ liệu">
          {isLoading && (
            <ListboxItem key="loader" className="w-full">
              <div className="w-full h-20 flex justify-center items-center">
                <Spinner size="sm" />
              </div>
            </ListboxItem>
          )}
          {data?.rows &&
            data?.rows.map((row) => (
              <ListboxItem
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
                key={row.id}
              >
                <span className="text-base">{row.name}</span>
              </ListboxItem>
            ))}
        </Listbox>
      </div>
    </div>
  );
};

export default SearchUser;
