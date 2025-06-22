import TuitionDiscountForm from "./components/TuitionDiscountForm";
import { FormPage, ModuleLayout } from "@/layouts";
import { addTuitionDiscountBreadcrumbItems } from "./constants";

const AddTuitionDiscount = () => {
  return (
    <ModuleLayout breadcrumbItems={addTuitionDiscountBreadcrumbItems}>
      <FormPage title="Thêm miễn giảm">
        <TuitionDiscountForm />
      </FormPage>
    </ModuleLayout>
  );
};

export default AddTuitionDiscount;
