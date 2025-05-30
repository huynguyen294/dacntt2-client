import { useState } from "react";
import { COURSE_LEVELS, COURSE_STATUSES } from "@/constants";
import { Button } from "@heroui/button";

import { CheckCheck, SlidersHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { Radio, RadioGroup } from "@heroui/radio";
import { useTableContext } from "@/components/common";

const CourseFilter = () => {
  const { filters, setFilters, changePager } = useTableContext();

  const [levels, setLevels] = useState(Object.keys(COURSE_LEVELS));
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
          <CheckboxGroup value={levels} label="Cấp độ" onValueChange={setLevels}>
            {Object.keys(COURSE_LEVELS).map((key) => (
              <Checkbox key={key} value={key}>
                {COURSE_LEVELS[key]}
              </Checkbox>
            ))}
          </CheckboxGroup>
          <RadioGroup value={status} label="Trạng thái" onValueChange={setStatus}>
            <Radio value="all">Tất cả</Radio>
            {Object.values(COURSE_STATUSES).map((status) => (
              <Radio key={status} value={status}>
                {status}
              </Radio>
            ))}
          </RadioGroup>
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
                if (levels.length < Object.keys(COURSE_LEVELS).length) newFilters.level = levels;
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

export default CourseFilter;
