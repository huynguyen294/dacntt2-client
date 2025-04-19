import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Navbar as HeroUiNavBar, NavbarBrand, NavbarContent } from "@heroui/navbar";
import { Bell, ChevronDown, LayoutDashboard, Menu, Search, Settings } from "lucide-react";
import { useDisclosure } from "@heroui/modal";
import { useNavigate } from "react-router";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import SidebarDrawer from "./SidebarDrawer";

const NavBar = ({ breadcrumbItems = [], hideMenuButton = false }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <HeroUiNavBar maxWidth="full" shouldHideOnScroll>
      <SidebarDrawer isOpen={isOpen} onOpenChange={onOpenChange} />
      <NavbarContent justify="start" className="gap-1">
        {!hideMenuButton && (
          <Button isIconOnly variant="light" radius="full" onPress={onOpen}>
            <Menu />
          </Button>
        )}
        <NavbarBrand>
          <Breadcrumbs
            className="ml-2"
            underline="hover"
            size="lg"
            separator="/"
            itemClasses={{
              separator: "px-2",
            }}
          >
            <BreadcrumbItem onPress={() => navigate("/admin")} startContent={<LayoutDashboard size="16px" />}>
              Tổng quan
            </BreadcrumbItem>
            {breadcrumbItems.map(({ path, label }, index) => (
              <BreadcrumbItem
                href={path}
                onPress={() => {
                  if (index === breadcrumbItems.length - 1) return;
                  navigate(path);
                }}
              >
                {label}
              </BreadcrumbItem>
            ))}
          </Breadcrumbs>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end" className="flex justify-end">
        <div className="bg-default-100 rounded-full p-1.5 flex items-center">
          <Button size="sm" isIconOnly variant="light" radius="full">
            <Search size="20px" />
          </Button>
          <Button size="sm" isIconOnly variant="light" radius="full">
            <Settings size="20px" />
          </Button>
          <Button size="sm" isIconOnly variant="light" radius="full">
            <Bell size="20px" />
          </Button>
          <Divider orientation="vertical" className="h-6 mx-2" />
          <Button
            size="sm"
            variant="light"
            radius="full"
            className="px-1 py-0 pl-0"
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
