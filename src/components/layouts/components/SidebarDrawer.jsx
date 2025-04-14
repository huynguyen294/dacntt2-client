import { Drawer, DrawerBody, DrawerContent } from "@heroui/drawer";
import Sidebar from "./Sidebar";

const SidebarDrawer = ({ isOpen, onOpenChange }) => {
  return (
    <Drawer classNames={{ body: "px-0 py-0" }} size="xs" isOpen={isOpen} onOpenChange={onOpenChange} placement="left">
      <DrawerContent>
        {() => (
          <DrawerBody>
            <Sidebar />
          </DrawerBody>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default SidebarDrawer;
