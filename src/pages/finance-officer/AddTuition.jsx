import TuitionForm from "./components/TuitionForm";
import { FormPage, ModuleLayout } from "@/layouts";
import { addTuitionBreadcrumbItems } from "./constants";

const AddTuition = () => {
  return (
    <ModuleLayout breadcrumbItems={addTuitionBreadcrumbItems}>
      <FormPage title="Thêm học phí">
        <TuitionForm />
      </FormPage>
    </ModuleLayout>
  );
};

export default AddTuition;
