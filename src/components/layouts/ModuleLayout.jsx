/* eslint-disable react-refresh/only-export-components */
import { cn } from "@/lib/utils";
import { withAuth } from "@/hocs";
import NavBar from "./components/NavBar";

const ModuleLayout = ({ title, breadcrumbItems, children, className }) => {
  return (
    <main className={cn("h-[100dvh] flex flex-col overflow-hidden container mx-auto", className)}>
      <NavBar title={title} shouldHideOnScroll breadcrumbItems={breadcrumbItems} />
      {children}
    </main>
  );
};

export default withAuth(ModuleLayout);
