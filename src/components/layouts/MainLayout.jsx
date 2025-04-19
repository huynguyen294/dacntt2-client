/* eslint-disable react-refresh/only-export-components */
import { withAuth } from "@/hocs";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";

const MainLayout = ({ title, children, hideMenuButton }) => {
  return (
    <main className="flex">
      <Sidebar />
      <div className="flex-1 h-[100dvh] flex flex-col">
        <NavBar title={title} hideMenuButton={hideMenuButton} />
        <div className="px-6 flex-1 overflow-y-auto">{children}</div>
      </div>
    </main>
  );
};

export default withAuth(MainLayout);
