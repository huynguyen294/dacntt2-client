import { ModuleLayout } from "@/layouts";
import { trainingSettingsBreadcrumbItems } from "./constants";

const TrainingSettings = () => {
  return (
    <ModuleLayout breadcrumbItems={trainingSettingsBreadcrumbItems}>
      <div className="px-10">Hello TrainingSettings Module!</div>
    </ModuleLayout>
  );
};

export default TrainingSettings;
