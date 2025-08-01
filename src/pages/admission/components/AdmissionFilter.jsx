import { useState } from "react";
import { ADMISSION_STATUSES } from "@/constants";
import { Button } from "@heroui/button";

import { CheckCheck, SlidersHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Radio, RadioGroup } from "@heroui/radio";
import { useTableContext } from "@/components/common";

const AdmissionFilter = () => {
  const { filters, setFilters, changePager } = useTableContext();

  const [createdAt, setCreatedAt] = useState(filters.createdAt || "all");
  const [status, setStatus] = useState("all");
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <Popover
      placement="bottom"
      showArrow
      isOpen={popoverOpen}
      onOpenChange={setPopoverOpen}
      onClose={() => setPopoverOpen(false)}
    >
      <PopoverTrigger>
        <Button
          size="sm"
          variant="flat"
          className="font-semibold min-w-fit"
          startContent={<SlidersHorizontal size="13px" />}
        >
          Lọc
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-2 space-y-4">
          <RadioGroup
            value={createdAt}
            label="Ngày đăng ký"
            defaultValue="all"
            classNames={{ label: "text-base" }}
            onValueChange={setCreatedAt}
          >
            <Radio value="all">Tất cả</Radio>
            <Radio value="7">7 ngày gần nhất</Radio>
            <Radio value="30">30 ngày gần nhất</Radio>
            <Radio value="60">60 ngày gần nhất</Radio>
          </RadioGroup>
          <div className="flex">
            <Button
              onPress={() => {
                setPopoverOpen(false);
                const newFilters = {};
                if (createdAt !== "all") newFilters.createdAt = createdAt;
                if (status !== "all") newFilters.status = status;
                changePager("page", 1);
                setFilters(newFilters);
              }}
              startContent={<CheckCheck size="15px" />}
              size="sm"
              color="primary"
              className="mr-2 h-8"
            >
              Áp dụng
            </Button>
            <Button onPress={() => setPopoverOpen(false)} size="sm" variant="bordered" color="danger">
              Hủy
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdmissionFilter;
