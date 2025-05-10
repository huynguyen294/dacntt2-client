import { FormPage, ModuleLayout } from "@/layouts";
import { addClassBreadcrumbItems } from "./constants";
import ClassForm from "./components/ClassForm";

const AddClass = () => {
  return (
    <ModuleLayout breadcrumbItems={addClassBreadcrumbItems}>
      <FormPage title="Thêm lớp học">
        <ClassForm />
      </FormPage>
    </ModuleLayout>
  );
};

export default AddClass;
