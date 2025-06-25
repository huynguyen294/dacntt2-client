import { ModuleLayout } from "@/layouts";
import { tuitionPaymentBreadcrumbItems } from "./constants";
import { useParams } from "react-router";
import { useStudentStore } from "@/state";

const StudentTuitionPayment = () => {
  const { classes, tuitions, tuitionDiscounts } = useStudentStore(["classes", "tuitions", "tuitionDiscounts"]);
  const { classId } = useParams();
  const foundClass = classes.find((c) => c.id === classId);

  return (
    <ModuleLayout breadcrumbItems={tuitionPaymentBreadcrumbItems}>
      <div className="px-2 sm:px-10 container mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2">
        <div></div>
        <img></img>
      </div>
    </ModuleLayout>
  );
};

export default StudentTuitionPayment;
