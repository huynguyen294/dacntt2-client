import Login from "./Login";
import Register from "./Register";

const authRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
];

export default authRoutes;
