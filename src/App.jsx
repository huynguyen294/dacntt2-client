import { createBrowserRouter, RouterProvider } from "react-router";
import { useVerifyUser } from "./hooks";

import "./App.css";
import appRoutes from "./routes";

const App = () => {
  useVerifyUser();
  const router = createBrowserRouter(appRoutes);

  return <RouterProvider router={router} />;
};

export default App;
