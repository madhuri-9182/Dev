import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/AuthProvider";
import { Toaster } from "react-hot-toast";
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

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
  return (
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
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);
