import Sidebar from "./Sidebar";
import { Drawer, DrawerBody, DrawerContent } from "@heroui/drawer";
import { useStudentStore } from "@/state";

const SidebarDrawer = ({ isOpen, onOpenChange }) => {
  const ready = useStudentStore("ready");

  return (
    <Drawer classNames={{ body: "px-0 py-0" }} size="xs" isOpen={isOpen} onOpenChange={onOpenChange} placement="left">
      <DrawerContent>
        {() => (
          <DrawerBody>
            <Sidebar ready={ready} className="border-r-0" />
          </DrawerBody>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default SidebarDrawer;
