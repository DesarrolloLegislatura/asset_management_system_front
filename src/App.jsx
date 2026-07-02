import { RouterProvider } from "react-router";
import router from "./routes/routes";
import { ThemeProvider } from "@/shared/theme/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
