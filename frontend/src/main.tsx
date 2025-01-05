import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./authContext.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import AllRoutes from "./Routes.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <Router>
      <AllRoutes />
    </Router>
  </AuthProvider>
);
