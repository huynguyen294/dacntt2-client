/* eslint-disable react-refresh/only-export-components */
import { withAuth } from "@/hocs";
import { cn } from "@/lib/utils";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import { useStudentStore } from "@/state";

const MainLayout = ({ children, hideMenuButton, hideDashboard, breadcrumbItems = [], classNames = {} }) => {
  const ready = useStudentStore("ready");

  return (
    <main className="flex">
      <Sidebar ready={ready} className="hidden sm:flex" />
      <div className="flex-1 h-[100dvh] flex flex-col">
        <NavBar
          ready={ready}
          hideMenuButton={hideMenuButton}
          hideDashboard={hideDashboard}
          breadcrumbItems={breadcrumbItems}
        />
        <div className={cn("px-2 sm:px-6 flex-1 overflow-y-auto", classNames.content)}>{children}</div>
      </div>
    </main>
  );
};

export default withAuth(MainLayout);
