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

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
