import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Navbar as HeroUiNavBar, NavbarBrand, NavbarContent } from "@heroui/navbar";
import { Bell, ChevronDown, Info, LayoutDashboard, LogOut, Menu, Search, Settings, UserPen } from "lucide-react";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { resetAppData, useAppStore } from "@/state";
import { useDisclosure } from "@heroui/modal";
import { signOut } from "@/apis";
import { useNavigate } from "@/hooks";
import { User } from "@heroui/user";
import SidebarDrawer from "./SidebarDrawer";
import { cn } from "@/lib/utils";

const NavBar = ({ breadcrumbItems = [], hideMenuButton = false }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const user = useAppStore("user");

  const handleLogout = () => {
    signOut();
    resetAppData();
    navigate("/login");
  };

  return (
    user && (
      <HeroUiNavBar maxWidth="full" shouldHideOnScroll>
        <SidebarDrawer isOpen={isOpen} onOpenChange={onOpenChange} />
        <NavbarContent justify="start" className="gap-1">
          <Button
            isIconOnly
            variant="light"
            radius="full"
            className={cn("hidden sm:inline-flex", hideMenuButton && "inline-flex sm:hidden")}
            onPress={onOpen}
          >
            <Menu />
          </Button>
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
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  size="sm"
                  variant="light"
                  radius="full"
                  className="px-1 py-0 pl-0"
                  startContent={<Avatar src={user.imageUrl} name={user.name} size="sm" />}
                  endContent={<ChevronDown size="14px" className="mr-2" />}
                >
                  {user.name}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <User name={user.name} description={user.email} />
                </DropdownItem>
                <DropdownItem startContent={<UserPen size="16px" />} key="settings">
                  Hồ sơ
                </DropdownItem>
                <DropdownItem startContent={<Info size="16px" />} key="settings">
                  Liên hệ
                </DropdownItem>
                <DropdownItem startContent={<LogOut size="16px" />} key="logout" color="danger" onPress={handleLogout}>
                  Đăng xuất
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </NavbarContent>
      </HeroUiNavBar>
    )
  );
};

export default NavBar;
