import { Button } from "@heroui/button";
import { Dropdown as HeroUIDropDown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Ellipsis, EllipsisVertical } from "lucide-react";

/**
 * @property {*} form
 * @param {{
 *   menuItems: [ { key: "", label: "", startContent: React.ReactNode, color: "" } ],
 *   onAction: (key) => {},
 *   variant: 'horizontal' | 'vertical',
 *   placement: string,
 *   children: React.ReactNode,
 * }} props
 */

const DropDown = ({ menuItems = [], onAction = () => {}, variant = "horizontal", placement = "left" }) => {
  return (
    <HeroUIDropDown showArrow placement={placement}>
      <DropdownTrigger>
        <Button radius="full" isIconOnly size="sm" variant="light">
          {variant === "vertical" ? <EllipsisVertical /> : <Ellipsis />}
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="flat" onAction={onAction}>
        {menuItems.map(({ startContent, label, key, color }) => (
          <DropdownItem key={key} startContent={startContent} color={color}>
            {label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </HeroUIDropDown>
  );
};

export default DropDown;
