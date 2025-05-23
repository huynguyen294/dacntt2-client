import { FormPage, ModuleLayout } from "@/layouts";
import { addExamBreadcrumbItems } from "../constants";
import ExamForm from "./components/ExamForm";

const AddClass = () => {
  return (
    <ModuleLayout breadcrumbItems={addExamBreadcrumbItems}>
      <FormPage title="Thêm kỳ thi">
        <ExamForm />
      </FormPage>
    </ModuleLayout>
  );
};

export default AddClass;
