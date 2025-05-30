import { FormPage, ModuleLayout } from "@/layouts";
import { addCourseBreadcrumbItems } from "../constants";
import CourseForm from "./components/CourseForm";

const AddCourse = () => {
  return (
    <ModuleLayout breadcrumbItems={addCourseBreadcrumbItems}>
      <FormPage title="Thêm khóa học">
        <CourseForm />
      </FormPage>
    </ModuleLayout>
  );
};

export default AddCourse;
