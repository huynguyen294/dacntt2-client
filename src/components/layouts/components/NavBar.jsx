import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Navbar as HeroUiNavBar, NavbarBrand, NavbarContent } from "@heroui/navbar";
import { Bell, ChevronDown, Menu, Search, Settings } from "lucide-react";

const NavBar = ({ title }) => {
  return (
    <HeroUiNavBar maxWidth="full">
      <NavbarContent justify="start">
        <Button isIconOnly variant="light" radius="full">
          <Menu />
        </Button>
        <NavbarBrand className="text-lg font-semibold">{title}</NavbarBrand>
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
