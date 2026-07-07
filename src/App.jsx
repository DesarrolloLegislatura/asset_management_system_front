import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import router from "./routes/routes";
import { queryClient } from "@/shared/api/queryClient";
import { ThemeProvider } from "@/shared/theme/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
