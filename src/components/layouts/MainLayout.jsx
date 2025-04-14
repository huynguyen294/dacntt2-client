import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";

const MainLayout = ({ title, children }) => {
  return (
    <main className="flex">
      <Sidebar />
      <div className="flex-1 h-[100dvh] flex flex-col">
        <NavBar title={title} />
        <div className="px-6 flex-1 overflow-y-auto">{children}</div>
      </div>
    </main>
  );
};

export default MainLayout;
