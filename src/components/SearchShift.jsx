/* eslint-disable no-unused-vars */
import { shiftApi } from "@/apis";
import { useServerList } from "@/hooks";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Search } from "lucide-react";
import { Loader, LoadMoreButton } from "./common";
import { shiftFormat } from "@/utils";

const SearchShift = ({ endBtnText, onChange = (key) => {}, filters, otherParams }) => {
  const shiftList = useServerList("shifts", shiftApi.get, { filters, otherParams });

  return (
    <div className="pb-4 sm:pb-10">
      <Input
        onChange={(e) => shiftList.onQueryChange(e.target.value)}
        startContent={<Search size="14px" />}
        placeholder="Nhập tên..."
      />
      <Loader variant="progress" isLoading={shiftList.isLoading} />
      <div className="h-[60dvh]  overflow-y-auto">
        <Listbox
          variant="flat"
          aria-label="Actions"
          onAction={onChange}
          emptyContent="Không có dữ liệu"
          bottomContent={shiftList.hasMore && <LoadMoreButton size="md" onLoadMore={shiftList.onLoadMore} />}
        >
          {shiftList.list.map((row) => (
            <ListboxItem
              className="!text-base"
              endContent={
                endBtnText && (
                  <Button size="sm" className="h-8" color="primary" onPress={() => onChange(row.id)}>
                    {endBtnText}
                  </Button>
                )
              }
              description={shiftFormat(row)}
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

export default SearchShift;
