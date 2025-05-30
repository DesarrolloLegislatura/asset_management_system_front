import { RouterProvider } from "react-router";
import router from "./routes/routes";
import { PermissionProvider } from "@/contexts/PermissionContext";

function App() {
  return (
    <PermissionProvider>
      <RouterProvider router={router} />
    </PermissionProvider>
  );
}

export default App;
