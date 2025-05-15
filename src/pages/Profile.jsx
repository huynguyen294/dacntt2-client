import { useState } from "react";
import { ModuleLayout } from "@/layouts";
import ProfileForm from "./ProfileForm";
import { useAppStore } from "@/state";

const Profile = () => {
  const [reload, setReload] = useState(new Date().toString());
  const user = useAppStore("user");

  return (
    <ModuleLayout key={reload} breadcrumbItems={[{ label: "Hồ sơ", path: "/profile" }]}>
      {user && <ProfileForm onReload={setReload} />}
    </ModuleLayout>
  );
};

export default Profile;
