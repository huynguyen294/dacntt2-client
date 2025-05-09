import { FormPage, ModuleLayout } from "@/layouts";
import { addCoursesBreadcrumbItems } from "./constants";
import CourseForm from "./components/CourseForm";

const AddCourse = () => {
  return (
    <ModuleLayout breadcrumbItems={addCoursesBreadcrumbItems}>
      <FormPage title="Thêm khóa học">
        <CourseForm />
      </FormPage>
    </ModuleLayout>
  );
};

export default AddCourse;
