import { InformationSheet } from "@/components";
import { withStudentReady } from "@/hocs";
import { MainLayout } from "@/layouts";

const Dashboard = () => {
  return (
    <MainLayout hideMenuButton>
      <InformationSheet />
    </MainLayout>
  );
};

export default withStudentReady(Dashboard, MainLayout);
