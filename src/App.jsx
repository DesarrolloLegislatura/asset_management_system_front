import { RouterProvider } from "react-router";
import router from "./routes/routes";
import { PermissionProvider } from "@/contexts/PermissionContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <PermissionProvider>
        <RouterProvider router={router} />
      </PermissionProvider>
    </ThemeProvider>
  );
}

export default App;
