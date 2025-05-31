import { Button } from "@heroui/button";
import { Dropdown as HeroUIDropDown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Ellipsis, EllipsisVertical } from "lucide-react";

/**
 * @property {*} form
 * @param {{
 *   menuItems: [ { key: string, label: string, startContent: React.ReactNode, color: string, disabled: boolean } ],
 *   onAction: (key) => {},
 *   variant: 'horizontal' | 'vertical',
 *   placement: string,
 *   children: React.ReactNode,
 * }} props
 */

const DropDown = ({
  isDisabled,
  btnClass,
  menuItems = [],
  onAction = () => {},
  variant = "horizontal",
  placement = "left",
}) => {
  return (
    <HeroUIDropDown showArrow placement={placement}>
      <DropdownTrigger>
        <Button radius="full" isIconOnly size="sm" variant="light" className={btnClass} isDisabled={isDisabled}>
          {variant === "vertical" ? <EllipsisVertical /> : <Ellipsis />}
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="flat" onAction={onAction}>
        {menuItems.map(({ startContent, label, key, color, disabled }) => (
          <DropdownItem key={key} startContent={startContent} color={color} isDisabled={disabled}>
            {label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </HeroUIDropDown>
  );
};

export default DropDown;
