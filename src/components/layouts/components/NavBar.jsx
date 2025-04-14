import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Navbar as HeroUiNavBar, NavbarBrand, NavbarContent } from "@heroui/navbar";
import { Bell, ChevronDown, Menu, Search, Settings } from "lucide-react";
import SidebarDrawer from "./SidebarDrawer";
import { useDisclosure } from "@heroui/modal";

const NavBar = ({ title, hideMenuButton = false }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <HeroUiNavBar maxWidth="full">
      <SidebarDrawer isOpen={isOpen} onOpenChange={onOpenChange} />
      <NavbarContent justify="start" className="gap-1">
        {!hideMenuButton && (
          <Button isIconOnly variant="light" radius="full" onPress={onOpen}>
            <Menu />
          </Button>
        )}
        <NavbarBrand className="text-xl font-bold">{title}</NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end" className="flex justify-end">
        <div className="bg-default-100 rounded-full p-1 flex items-center">
          <Button isIconOnly variant="light" radius="full">
            <Search size="22px" />
          </Button>
          <Button isIconOnly variant="light" radius="full">
            <Settings size="22px" />
          </Button>
          <Button isIconOnly variant="light" radius="full">
            <Bell size="22px" />
          </Button>
          <Divider orientation="vertical" className="h-6 mx-2" />
          <Button
            variant="light"
            radius="full"
            className="px-1 py-0"
            startContent={<Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" name="Admin" size="sm" />}
            endContent={<ChevronDown size="14px" className="mr-2" />}
          >
            Admin Admin
          </Button>
        </div>
      </NavbarContent>
    </HeroUiNavBar>
  );
};

export default NavBar;
