import SidebarDrawer from "./SidebarDrawer";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Navbar as HeroUiNavBar, NavbarBrand, NavbarContent } from "@heroui/navbar";
import { ArrowDownToLine, ChevronDown, House, Info, LogOut, Menu, MoveLeft, UserPen } from "lucide-react";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { resetAppData, useAppStore } from "@/state";
import { useDisclosure } from "@heroui/modal";
import { signOut } from "@/apis";
import { useNavigate } from "@/hooks";
import { User } from "@heroui/user";
import { cn } from "@/lib/utils";
import { useLocation, useParams } from "react-router";
import { IosInstallModal, UserScheduleButton } from "@/components";
import { Skeleton } from "@heroui/skeleton";
import usePwaInstaller from "@/hooks/usePwaInstaller";

const NavBar = ({ breadcrumbItems = [], ready, isModule, hideMenuButton = false, hideDashboard = false }) => {
  const navigate = useNavigate(true);
  const params = useParams();
  const location = useLocation();
  const pathname = location.pathname;
  const iosInstallModal = useDisclosure();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleInstall = usePwaInstaller(iosInstallModal.onOpen);
  const user = useAppStore("user");

  const handleLogout = () => {
    signOut();
    resetAppData();
    navigate("/login", false);
  };

  const studentLoading = user?.role === "student" && !ready;
  const isSubmodule = isModule && breadcrumbItems.length > 1;

  return (
    user && (
      <HeroUiNavBar maxWidth="full" shouldHideOnScroll classNames={{ wrapper: "px-2 sm:px-6" }}>
        <IosInstallModal isOpen={iosInstallModal.isOpen} onClose={iosInstallModal.onClose} />
        <SidebarDrawer isOpen={isOpen} onOpenChange={onOpenChange} />
        <NavbarContent justify="start" className="gap-1">
          {studentLoading ? (
            <Skeleton className="size-8 rounded-large mr-2" />
          ) : (
            <Button
              isIconOnly
              variant="light"
              radius="full"
              className={cn(hideMenuButton && "inline-flex sm:hidden")}
              onPress={onOpen}
            >
              <Menu />
            </Button>
          )}
          <NavbarBrand>
            {studentLoading ? (
              <Skeleton className="h-8 w-20 rounded-full hidden sm:block" />
            ) : (
              <Breadcrumbs
                className="ml-2 hidden sm:block"
                underline="hover"
                size="lg"
                separator="/"
                itemClasses={{ separator: "px-2" }}
              >
                {!hideDashboard && (
                  <BreadcrumbItem onClick={() => navigate("/")} startContent={<House size="16px" />}>
                    Trang chủ
                  </BreadcrumbItem>
                )}
                {breadcrumbItems.map(({ path, label, startContent }, index) => (
                  <BreadcrumbItem
                    key={label + path}
                    startContent={startContent}
                    onPress={() => {
                      if (index === breadcrumbItems.length - 1) return;
                      if (path === -1) return navigate((from) => from);
                      if (typeof path === "function") return navigate(path({ params, pathname }));
                      path && navigate(path);
                    }}
                  >
                    {typeof label === "function" ? label({ params, pathname }) : label}
                  </BreadcrumbItem>
                ))}
              </Breadcrumbs>
            )}
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent justify="end" className="flex justify-end">
          {studentLoading ? (
            <Skeleton className={cn("h-8 w-10 sm:h-10 sm:w-40 rounded-full")} />
          ) : (
            <div className="bg-default-100 rounded-full p-0 sm:p-1.5 flex items-center">
              {/* <Button size="sm" isIconOnly variant="light" radius="full">
              <Search size="20px" />
            </Button>
            <Button size="sm" isIconOnly variant="light" radius="full">
              <Bell size="20px" />
            </Button> */}
              {user.role === "admin" && (
                <>
                  <UserScheduleButton withFilter iconSize="20px" />
                  <Divider orientation="vertical" className="h-6 mx-2" />
                </>
              )}
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    size="sm"
                    variant="light"
                    radius="full"
                    className="px-0 sm:px-1 py-0 pl-0 min-w-8 h-10 sm:h-auto sm:min-w-auto"
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
                    />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem className="h-14 gap-2">
                    <User avatarProps={{ src: user.imageUrl }} name={user.name} description={user.email} />
                  </DropdownItem>
                  <DropdownItem startContent={<UserPen size="16px" />} onPress={() => navigate(`/profile`)}>
                    Hồ sơ cá nhân
                  </DropdownItem>
                  <DropdownItem
                    isDisabled={!handleInstall}
                    startContent={<ArrowDownToLine size="16px" />}
                    onPress={handleInstall}
                  >
                    Cài đặt ứng dụng
                  </DropdownItem>
                  <DropdownItem startContent={<Info size="16px" />}>Liên hệ</DropdownItem>
                  <DropdownItem startContent={<LogOut size="16px" />} color="danger" onPress={handleLogout}>
                    Đăng xuất
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          )}
        </NavbarContent>
      </HeroUiNavBar>
    )
  );
};

export default NavBar;
