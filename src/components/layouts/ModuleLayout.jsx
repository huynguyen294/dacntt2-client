import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import NavBar from "./components/NavBar";
import { Home } from "lucide-react";
import { useNavigate } from "@/hooks";

const ModuleLayout = ({ title, breadcrumbItems = [], children }) => {
  const navigate = useNavigate();

  return (
    <main className="flex">
      <div className="flex-1 h-[100dvh] flex flex-col">
        <NavBar title={title} />
        <div className="px-6 flex-1 overflow-y-auto">
          <Breadcrumbs>
            <BreadcrumbItem onPress={() => navigate("/admin")} startContent={<Home size="12px" />}>
              Trang chủ
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
          {children}
        </div>
      </div>
    </main>
  );
};

export default ModuleLayout;
