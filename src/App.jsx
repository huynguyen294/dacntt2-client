import { RouterProvider } from "react-router";
import { useInitialization, useRouter } from "./hooks";

import "./App.css";

const App = () => {
  useInitialization();
  const router = useRouter();

  return <RouterProvider router={router} />;
};

export default App;
