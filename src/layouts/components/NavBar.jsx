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
import { cn } from "@/lib/utils";
import { useParams } from "react-router";
import SidebarDrawer from "./SidebarDrawer";

const NavBar = ({ breadcrumbItems = [], hideMenuButton = false, hideDashboard = false }) => {
  const navigate = useNavigate(true);
  const params = useParams();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const user = useAppStore("user");

  const handleLogout = () => {
    signOut();
    resetAppData();
    navigate("/login", false);
  };

  return (
    user && (
      <HeroUiNavBar maxWidth="full" shouldHideOnScroll classNames={{ wrapper: "px-2 sm:px-6" }}>
        <SidebarDrawer isOpen={isOpen} onOpenChange={onOpenChange} />
        <NavbarContent justify="start" className="gap-1">
          <Button
            isIconOnly
            variant="light"
            radius="full"
            className={cn(hideMenuButton && "inline-flex sm:hidden")}
            onPress={onOpen}
          >
            <Menu />
          </Button>
          <NavbarBrand>
            <Breadcrumbs
              className="ml-2 hidden sm:block"
              underline="hover"
              size="lg"
              separator="/"
              itemClasses={{
                separator: "px-2",
              }}
            >
              {!hideDashboard && (
                <BreadcrumbItem onPress={() => navigate("/")} startContent={<LayoutDashboard size="16px" />}>
                  Tổng quan
                </BreadcrumbItem>
              )}
              {breadcrumbItems.map(({ path, label, startContent }, index) => (
                <BreadcrumbItem
                  key={label}
                  startContent={startContent}
                  onPress={() => {
                    if (index === breadcrumbItems.length - 1) return;
                    if (typeof path === "function") return navigate(path(params));
                    path && navigate(path);
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
                  className="px-0 sm:px-1 py-0 pl-0 min-w-6 sm:min-w-auto"
                  startContent={
                    <Avatar
                      className="hidden sm:block"
                      src={(user.imageUrl || "").replace("upload", "upload/w_100")}
                      name={user.name}
                      size="sm"
                    />
                  }
                  endContent={<ChevronDown size="14px" className="mr-2 hidden sm:block" />}
                >
                  <span className="hidden sm:block">{user.name}</span>
                  <Avatar
                    className="block sm:hidden"
                    src={(user.imageUrl || "").replace("upload", "upload/w_100")}
                    name={user.name}
                    size="sm"
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="user" className="h-14 gap-2">
                  <User avatarProps={{ src: user.imageUrl }} name={user.name} description={user.email} />
                </DropdownItem>
                <DropdownItem startContent={<UserPen size="16px" />} key="profile" onPress={() => navigate(`/profile`)}>
                  Hồ sơ cá nhân
                </DropdownItem>
                <DropdownItem startContent={<Info size="16px" />} key="contact">
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
