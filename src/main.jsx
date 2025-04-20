import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Createtrip from "./create/Createtrip.jsx";
import "./index.css";
import Header from "./components/custom/Header.jsx";
import { Toaster } from "sonner";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />

        <App />
      </>
    ),
  },
  {
    path: "/create-trip",
    element: (
      <>
        <Header />
        <Createtrip />
      </>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </StrictMode>
);
