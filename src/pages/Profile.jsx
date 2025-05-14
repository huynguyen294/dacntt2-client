import { useState } from "react";
import ProfileForm from "./ProfileForm";
import { ModuleLayout } from "@/layouts";

const Profile = () => {
  const [reload, setReload] = useState(new Date().toString());

  return (
    <ModuleLayout key={reload} breadcrumbItems={[{ label: "Hồ sơ", path: "/profile" }]}>
      <ProfileForm onReload={setReload} />
    </ModuleLayout>
  );
};

export default Profile;
