import TuitionForm from "./components/TuitionForm";
import { FormPage, ModuleLayout } from "@/layouts";
import { addTuitionBreadcrumbItems } from "./constants";

const AddCourse = () => {
  return (
    <ModuleLayout breadcrumbItems={addTuitionBreadcrumbItems}>
      <FormPage title="Thêm học phí">
        <TuitionForm />
      </FormPage>
    </ModuleLayout>
  );
};

export default AddCourse;
