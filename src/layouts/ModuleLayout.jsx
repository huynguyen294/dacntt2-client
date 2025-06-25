import NavBar from "./components/NavBar";
import { cn } from "@/lib/utils";
import { withAuth } from "@/hocs";
import { useAppStore, useStudentStore } from "@/state";
import { Loader } from "@/components/common";

const ModuleLayout = withAuth(({ title, breadcrumbItems, children, className }) => {
  const user = useAppStore("user");
  const { ready, additionalReady } = useStudentStore(["ready", "additionalReady"]);

  return (
    <main className={cn("h-[100dvh] flex flex-col overflow-hidden container mx-auto", className)}>
      <NavBar
        ready={ready && additionalReady}
        title={title}
        isModule
        shouldHideOnScroll
        breadcrumbItems={breadcrumbItems}
      />
      {user?.role === "student" && <Loader isLoading={!ready} />}
      {user?.role !== "student" ? children : ready && additionalReady && children}
    </main>
  );
});

export default ModuleLayout;
