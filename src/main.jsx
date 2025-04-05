import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/AuthProvider";
import { Toaster } from "react-hot-toast";
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { isDesktop } from "react-device-detect";

import App from "./App";
import { createTheme, ThemeProvider } from "@mui/material";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

const theme = createTheme({
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

// eslint-disable-next-line react-refresh/only-export-components
const RootComponent = () => {
  return isDesktop ? (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
          <Toaster
            toastOptions={{
              position: "top-right",
              className: "text-default",
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  ) : (
    <div className="text-center mt-4 text-xs sm:text-base mx-8 text-[#6B6F7B] font-medium">
      Not supported. Please use a desktop to access the
      application.
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);
