import { createBrowserRouter, RouterProvider } from "react-router";
import { Login, Register } from "./pages";

import "./App.css";

const App = () => {
  const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
