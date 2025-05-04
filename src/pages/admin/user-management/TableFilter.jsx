import { useState } from "react";
import { ROLE_LABELS, USER_ROLES } from "@/constants";
import { Button } from "@heroui/button";

import { CheckCheck, SlidersHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { Radio, RadioGroup } from "@heroui/radio";
import { useTableContext } from "@/components/common";

const TableFilter = ({ role }) => {
  const { filters, setFilters, changePager } = useTableContext();

  const [roles, setRoles] = useState(role !== "_" ? [role] : filters.roles || USER_ROLES);
  const [createdAt, setCreatedAt] = useState(filters.createdAt || "all");
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
          <CheckboxGroup value={roles} label="Vai trò" onValueChange={setRoles}>
            {USER_ROLES.map((r) => (
              <Checkbox key={r} value={r} isDisabled={role !== "_"}>
                {ROLE_LABELS[r]}
              </Checkbox>
            ))}
          </CheckboxGroup>
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
                if (roles.length < USER_ROLES.length) newFilters.roles = roles;
                if (createdAt !== "all") newFilters.createdAt = createdAt;
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

export default TableFilter;
